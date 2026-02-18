import { useEffect, useMemo, useRef, useState } from 'react';

const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const SPOTIFY_REDIRECT_URI =
  import.meta.env.VITE_SPOTIFY_REDIRECT_URI ||
  `${window.location.origin}${window.location.pathname}`;
const TOKEN_STORAGE_KEY = 'spotify-auth';
const OAUTH_STATE_KEY = 'spotify-oauth-state';
const OAUTH_VERIFIER_KEY = 'spotify-oauth-verifier';
const SCOPES = [
  'streaming',
  'user-read-email',
  'user-read-private',
  'user-read-currently-playing',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-top-read',
  'playlist-read-private',
  'playlist-read-collaborative',
];

let spotifySdkPromise;

function loadSpotifySdk() {
  if (window.Spotify) return Promise.resolve();
  if (spotifySdkPromise) return spotifySdkPromise;

  spotifySdkPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    script.onload = () => {
      window.onSpotifyWebPlaybackSDKReady = () => resolve();
    };
    script.onerror = () => reject(new Error('Failed to load Spotify SDK.'));
    document.body.appendChild(script);
  });

  return spotifySdkPromise;
}

function generateRandomString(length = 64) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values, (x) => chars[x % chars.length]).join('');
}

function base64UrlEncode(bytes) {
  let binary = '';
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function generateCodeChallenge(verifier) {
  const data = new TextEncoder().encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return base64UrlEncode(new Uint8Array(digest));
}

function getStoredAuth() {
  try {
    const raw = localStorage.getItem(TOKEN_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function storeAuth(data) {
  localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(data));
}

function clearAuth() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  sessionStorage.removeItem(OAUTH_STATE_KEY);
  sessionStorage.removeItem(OAUTH_VERIFIER_KEY);
}

async function spotifyApi(path, accessToken, options = {}) {
  const res = await fetch(`https://api.spotify.com/v1${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
  });

  if (res.status === 204) return null;
  if (!res.ok) {
    const err = new Error(`Spotify API error (${res.status})`);
    err.status = res.status;
    err.retryAfter = Number(res.headers.get('retry-after') || 0);
    throw err;
  }

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return res.json();
  return null;
}

function formatArtists(artists = []) {
  return artists.map((a) => a.name).join(', ');
}

function formatMs(ms = 0) {
  const total = Math.floor(ms / 1000);
  const minutes = Math.floor(total / 60);
  const seconds = `${total % 60}`.padStart(2, '0');
  return `${minutes}:${seconds}`;
}

async function hydratePlaylistTotals(items = [], token) {
  const detailResults = await Promise.allSettled(
    items.map((playlist) =>
      spotifyApi(`/playlists/${playlist.id}?fields=id,tracks(total)`, token)
    )
  );

  return items.map((playlist, index) => {
    const detail = detailResults[index];
    const trackTotal =
      detail?.status === 'fulfilled' && typeof detail.value?.tracks?.total === 'number'
        ? detail.value.tracks.total
        : playlist.tracks?.total ?? 0;

    return { ...playlist, trackTotal };
  });
}

function getSettledValue(result) {
  return result?.status === 'fulfilled' ? result.value : null;
}

function getRateLimitError(results = []) {
  const rejected = results.find((r) => r?.status === 'rejected' && r.reason?.status === 429);
  return rejected?.reason || null;
}

function MusicPlayer() {
  const [auth, setAuth] = useState(() => getStoredAuth());
  const [profile, setProfile] = useState(null);
  const [nowPlaying, setNowPlaying] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [sdkReady, setSdkReady] = useState(false);
  const [hasPremium, setHasPremium] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [audioActivated, setAudioActivated] = useState(false);

  const playerRef = useRef(null);
  const progressTimerRef = useRef(null);

  const isConfigured = Boolean(SPOTIFY_CLIENT_ID);
  const isAuthenticated = Boolean(auth?.accessToken);

  const expiresSoon = useMemo(() => {
    if (!auth?.expiresAt) return true;
    return Date.now() >= auth.expiresAt - 60_000;
  }, [auth]);

  const exchangeCodeForToken = async (code) => {
    const verifier = sessionStorage.getItem(OAUTH_VERIFIER_KEY);
    if (!verifier) throw new Error('Missing code verifier. Please connect again.');

    const body = new URLSearchParams({
      client_id: SPOTIFY_CLIENT_ID,
      grant_type: 'authorization_code',
      code,
      redirect_uri: SPOTIFY_REDIRECT_URI,
      code_verifier: verifier,
    });

    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    if (!res.ok) throw new Error('Spotify token exchange failed.');

    const data = await res.json();
    const tokenData = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: Date.now() + data.expires_in * 1000,
    };
    storeAuth(tokenData);
    setAuth(tokenData);
  };

  const refreshAccessToken = async (refreshToken) => {
    const body = new URLSearchParams({
      client_id: SPOTIFY_CLIENT_ID,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });

    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    if (!res.ok) throw new Error('Spotify token refresh failed.');

    const data = await res.json();
    const tokenData = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token || refreshToken,
      expiresAt: Date.now() + data.expires_in * 1000,
    };
    storeAuth(tokenData);
    setAuth(tokenData);
    return tokenData;
  };

  const loadSpotifyData = async (token) => {
    setIsLoading(true);
    setError('');
    try {
      const results = await Promise.allSettled([
        spotifyApi('/me', token),
        spotifyApi('/me/player', token),
        spotifyApi('/me/top/tracks?limit=8&time_range=short_term', token),
        spotifyApi('/me/playlists?limit=8', token),
      ]);

      const me = getSettledValue(results[0]);
      const playback = getSettledValue(results[1]);
      const top = getSettledValue(results[2]);
      const userPlaylists = getSettledValue(results[3]);

      setProfile(me);
      setHasPremium(me?.product === 'premium');
      setNowPlaying(playback?.item || null);
      setIsPlaying(Boolean(playback && !playback.is_playing ? false : playback?.is_playing));
      setPosition(playback?.progress_ms || 0);
      setDuration(playback?.item?.duration_ms || 0);
      setTopTracks(top?.items || []);
      const playlistItems = userPlaylists?.items || [];
      const playlistsWithTotals = await hydratePlaylistTotals(playlistItems, token);
      setPlaylists(playlistsWithTotals);

      const rateLimitErr = getRateLimitError(results);
      if (rateLimitErr) {
        const waitText = rateLimitErr.retryAfter
          ? ` Try again in ${rateLimitErr.retryAfter}s.`
          : ' Try again in a moment.';
        setError(`Spotify rate limit reached.${waitText}`);
      }
    } catch (err) {
      setError(err.message || 'Failed to load Spotify data.');
    } finally {
      setIsLoading(false);
    }
  };

  const connectSpotify = async () => {
    if (!isConfigured) return;
    setError('');

    try {
      const state = generateRandomString(24);
      const verifier = generateRandomString(128);
      const challenge = await generateCodeChallenge(verifier);

      sessionStorage.setItem(OAUTH_STATE_KEY, state);
      sessionStorage.setItem(OAUTH_VERIFIER_KEY, verifier);

      const params = new URLSearchParams({
        response_type: 'code',
        client_id: SPOTIFY_CLIENT_ID,
        scope: SCOPES.join(' '),
        redirect_uri: SPOTIFY_REDIRECT_URI,
        state,
        code_challenge_method: 'S256',
        code_challenge: challenge,
      });

      window.location.assign(`https://accounts.spotify.com/authorize?${params.toString()}`);
    } catch {
      setError('Failed to start Spotify login.');
    }
  };

  const disconnectSpotify = () => {
    clearAuth();
    playerRef.current?.disconnect();
    playerRef.current = null;
    setAuth(null);
    setProfile(null);
    setNowPlaying(null);
    setTopTracks([]);
    setDeviceId('');
    setSdkReady(false);
    setError('');
  };

  useEffect(() => {
    if (!isConfigured) return;

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    const oauthError = params.get('error');

    if (oauthError) {
      setError('Spotify login was cancelled or denied.');
      return;
    }
    if (!code) return;

    const expectedState = sessionStorage.getItem(OAUTH_STATE_KEY);
    if (!state || state !== expectedState) {
      setError('Spotify state mismatch. Please connect again.');
      return;
    }

    exchangeCodeForToken(code)
      .catch((err) => setError(err.message || 'Spotify login failed.'))
      .finally(() => {
        window.history.replaceState({}, document.title, window.location.pathname);
      });
  }, [isConfigured]);

  useEffect(() => {
    if (!isConfigured || !auth?.accessToken) return;

    const ensureTokenAndLoad = async () => {
      try {
        const tokenData = expiresSoon ? await refreshAccessToken(auth.refreshToken) : auth;
        await loadSpotifyData(tokenData.accessToken);
      } catch {
        setError('Session expired. Please reconnect Spotify.');
      }
    };

    ensureTokenAndLoad();
  }, [auth, expiresSoon, isConfigured]);

  useEffect(() => {
    if (!isAuthenticated || !auth?.accessToken) return;

    let unmounted = false;
    const setupPlayer = async () => {
      try {
        await loadSpotifySdk();
        if (unmounted || !window.Spotify) return;

        const player = new window.Spotify.Player({
          name: 'Corey Portfolio Player',
          volume: 0.8,
          getOAuthToken: (cb) => cb(auth.accessToken),
        });

        player.addListener('ready', async ({ device_id }) => {
          if (unmounted) return;
          setDeviceId(device_id);
          setSdkReady(true);
          try {
            await spotifyApi('/me/player', auth.accessToken, {
              method: 'PUT',
              body: JSON.stringify({ device_ids: [device_id], play: false }),
            });
          } catch {
            setError('Player connected, but transfer playback failed.');
          }
        });

        player.addListener('player_state_changed', (state) => {
          if (!state) return;
          setIsPlaying(!state.paused);
          setPosition(state.position);
          setDuration(state.duration);
          setNowPlaying(state.track_window?.current_track || null);
        });

        player.addListener('account_error', () => {
          setHasPremium(false);
          setError('Spotify Premium is required for in-page playback controls.');
        });
        player.addListener('authentication_error', ({ message }) => setError(message));
        player.addListener('initialization_error', ({ message }) => setError(message));
        player.addListener('playback_error', ({ message }) => setError(message));

        const connected = await player.connect();
        if (!connected) setError('Failed to connect Spotify Web Playback SDK.');

        playerRef.current = player;
      } catch (err) {
        setError(err.message || 'Failed to initialize player.');
      }
    };

    setupPlayer();

    return () => {
      unmounted = true;
      playerRef.current?.disconnect();
      playerRef.current = null;
      setSdkReady(false);
      setDeviceId('');
    };
  }, [isAuthenticated, auth?.accessToken]);

  useEffect(() => {
    if (!isPlaying) {
      clearInterval(progressTimerRef.current);
      return;
    }

    progressTimerRef.current = setInterval(() => {
      setPosition((prev) => Math.min(prev + 1000, duration || prev + 1000));
    }, 1000);

    return () => clearInterval(progressTimerRef.current);
  }, [isPlaying, duration]);

  const playbackRequest = async (path, options = {}) => {
    if (!auth?.accessToken || !deviceId) {
      setError('Player is not ready yet.');
      return false;
    }

    try {
      await spotifyApi(`${path}${path.includes('?') ? '&' : '?'}device_id=${deviceId}`, auth.accessToken, options);
      return true;
    } catch (err) {
      setError(err.message || 'Playback request failed.');
      return false;
    }
  };

  const togglePlayback = async () => {
    if (!audioActivated) {
      setError('Click Enable Audio first, then try playback controls.');
      return;
    }
    const ok = await playbackRequest(isPlaying ? '/me/player/pause' : '/me/player/play', {
      method: 'PUT',
    });
    if (ok) setIsPlaying(!isPlaying);
  };

  const previousTrack = () => playbackRequest('/me/player/previous', { method: 'POST' });
  const nextTrack = () => playbackRequest('/me/player/next', { method: 'POST' });

  const seekTrack = async (nextPosition) => {
    setPosition(nextPosition);
    await playbackRequest(`/me/player/seek?position_ms=${nextPosition}`, { method: 'PUT' });
  };

  const changeVolume = async (nextVolume) => {
    setVolume(nextVolume);
    await playerRef.current?.setVolume(nextVolume / 100);
  };

  const playTrack = async (uri) => {
    if (!audioActivated) {
      setError('Click Enable Audio first, then play a track.');
      return;
    }
    const ok = await playbackRequest('/me/player/play', {
      method: 'PUT',
      body: JSON.stringify({ uris: [uri] }),
    });
    if (ok) setIsPlaying(true);
  };

  const playPlaylist = async (uri) => {
    if (!audioActivated) {
      setError('Click Enable Audio first, then play a playlist.');
      return;
    }
    const ok = await playbackRequest('/me/player/play', {
      method: 'PUT',
      body: JSON.stringify({ context_uri: uri }),
    });
    if (ok) setIsPlaying(true);
  };

  const activateAudio = async () => {
    if (!playerRef.current) return;
    try {
      await playerRef.current.activateElement();
      setAudioActivated(true);
      setError('');
    } catch {
      setError('Could not activate audio. Try clicking Enable Audio again.');
    }
  };

  const searchTracks = async (e) => {
    e.preventDefault();
    if (!auth?.accessToken || !searchQuery.trim()) return;
    try {
      const data = await spotifyApi(
        `/search?type=track&limit=8&q=${encodeURIComponent(searchQuery.trim())}`,
        auth.accessToken
      );
      setSearchResults(data?.tracks?.items || []);
    } catch (err) {
      setError(err.message || 'Search failed.');
    }
  };

  if (!isConfigured) {
    return (
      <div className="music-player">
        <h2 className="music-player__title">Spotify Setup Required</h2>
        <p className="music-player__text">
          Add <code>VITE_SPOTIFY_CLIENT_ID</code> in your environment and restart the app.
        </p>
      </div>
    );
  }

  return (
    <div className="music-player">
      <div className="music-player__header">
        <div>
          <h2 className="music-player__title">Spotify Player</h2>
          <p className="music-player__text">
            {profile
              ? `Connected as ${profile.display_name || profile.id}`
              : 'Connect Spotify to play music directly in this window.'}
          </p>
          {isAuthenticated && (
            <p className="music-player__text">
              {sdkReady
                ? `Web player ready${deviceId ? ` (device: ${deviceId.slice(0, 8)}...)` : ''}`
                : 'Initializing web player...'}
            </p>
          )}
          {isAuthenticated && sdkReady && (
            <button className="music-player__btn music-player__btn--ghost" onClick={activateAudio}>
              {audioActivated ? 'Audio Enabled' : 'Enable Audio'}
            </button>
          )}
        </div>

        <div className="music-player__actions">
          {!isAuthenticated && (
            <button className="music-player__btn" onClick={connectSpotify}>
              Connect Spotify
            </button>
          )}
          {isAuthenticated && (
            <>
              <button
                className="music-player__btn music-player__btn--ghost"
                onClick={() => loadSpotifyData(auth.accessToken)}
                disabled={isLoading}
              >
                Refresh
              </button>
              <button className="music-player__btn" onClick={disconnectSpotify}>
                Disconnect
              </button>
            </>
          )}
        </div>
      </div>

      {error && <p className="music-player__error">{error}</p>}
      {isAuthenticated && !hasPremium && (
        <p className="music-player__error">
          Spotify Premium is required for in-browser playback controls.
        </p>
      )}

      {isAuthenticated && (
        <div className="music-player__content">
          <section className="music-player__panel">
            <h3 className="music-player__panel-title">Now Playing</h3>
            {nowPlaying ? (
              <div className="music-player__track">
                {nowPlaying.album?.images?.[0] && (
                  <img
                    className="music-player__cover"
                    src={nowPlaying.album.images[0].url}
                    alt={nowPlaying.name}
                  />
                )}
                <div>
                  <p className="music-player__track-name">{nowPlaying.name}</p>
                  <p className="music-player__track-meta">
                    {formatArtists(nowPlaying.artists)}
                  </p>
                </div>
              </div>
            ) : (
              <p className="music-player__text">Select a track to start playback.</p>
            )}

            <div className="music-player__controls">
              <button className="music-player__control" onClick={previousTrack} disabled={!sdkReady}>
                ⏮
              </button>
              <button className="music-player__control" onClick={togglePlayback} disabled={!sdkReady}>
                {isPlaying ? '⏸' : '▶'}
              </button>
              <button className="music-player__control" onClick={nextTrack} disabled={!sdkReady}>
                ⏭
              </button>
            </div>

            <div className="music-player__seek">
              <span>{formatMs(position)}</span>
              <input
                type="range"
                min="0"
                max={duration || 1}
                value={Math.min(position, duration || 1)}
                onChange={(e) => seekTrack(Number(e.target.value))}
                disabled={!sdkReady || !duration}
              />
              <span>{formatMs(duration)}</span>
            </div>

            <div className="music-player__volume">
              <span>Volume</span>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => changeVolume(Number(e.target.value))}
                disabled={!sdkReady}
              />
            </div>
          </section>

          <section className="music-player__panel">
            <h3 className="music-player__panel-title">Search Tracks</h3>
            <form className="music-player__search" onSubmit={searchTracks}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Spotify tracks..."
              />
              <button type="submit" className="music-player__btn music-player__btn--ghost">
                Search
              </button>
            </form>
            <div className="music-player__list">
              {searchResults.map((track) => (
                <button
                  key={track.id}
                  className="music-player__list-item"
                  onClick={() => playTrack(track.uri)}
                  disabled={!sdkReady || !hasPremium}
                >
                  <span className="music-player__list-title">{track.name}</span>
                  <span className="music-player__list-meta">
                    {formatArtists(track.artists)}
                  </span>
                </button>
              ))}
            </div>

            <h3 className="music-player__panel-title music-player__panel-title--spaced">Your Playlists</h3>
            <div className="music-player__list">
              {playlists.map((playlist) => (
                <button
                  key={playlist.id}
                  className="music-player__list-item"
                  onClick={() => playPlaylist(playlist.uri)}
                  disabled={!sdkReady || !hasPremium}
                >
                  <span className="music-player__list-title">{playlist.name}</span>
                  <span className="music-player__list-meta">
                    {playlist.owner?.display_name || 'Spotify'} • {playlist.trackTotal ?? 0} tracks
                  </span>
                </button>
              ))}
              {!playlists.length && (
                <p className="music-player__text">No playlists found on your account yet.</p>
              )}
            </div>

            <h3 className="music-player__panel-title music-player__panel-title--spaced">Top Tracks</h3>
            <div className="music-player__list">
              {topTracks.map((track) => (
                <button
                  key={track.id}
                  className="music-player__list-item"
                  onClick={() => playTrack(track.uri)}
                  disabled={!sdkReady || !hasPremium}
                >
                  <span className="music-player__list-title">{track.name}</span>
                  <span className="music-player__list-meta">
                    {formatArtists(track.artists)}
                  </span>
                </button>
              ))}
              {!topTracks.length && (
                <p className="music-player__text">
                  Play more music on Spotify to populate recommendations.
                </p>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default MusicPlayer;
