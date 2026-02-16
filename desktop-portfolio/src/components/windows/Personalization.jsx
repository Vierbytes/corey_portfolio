/*
  Personalization Window

  This is like the Windows Settings > Personalization page. It lets you
  change the theme (dark/light), pick an accent color, and choose a
  desktop background. All the changes happen instantly because they're
  managed through React Context and CSS custom properties.

  I learned about useContext from the React docs - it lets any component
  access shared state without passing props through every level.
*/

import { useTheme, ACCENT_COLORS, WALLPAPER_OPTIONS } from '../../context/ThemeContext';

function Personalization() {
  const { theme, setMode, setAccent, setWallpaper } = useTheme();

  return (
    <div className="personalization">
      {/* Theme mode toggle - dark or light */}
      <div className="personalization__section">
        <h3 className="personalization__section-title">Theme</h3>
        <p className="personalization__section-desc">
          Choose between dark and light mode
        </p>
        <div className="personalization__toggle-group">
          <button
            className={`personalization__toggle-btn ${
              theme.mode === 'dark' ? 'personalization__toggle-btn--active' : ''
            }`}
            onClick={() => setMode('dark')}
          >
            Dark
          </button>
          <button
            className={`personalization__toggle-btn ${
              theme.mode === 'light' ? 'personalization__toggle-btn--active' : ''
            }`}
            onClick={() => setMode('light')}
          >
            Light
          </button>
        </div>
      </div>

      {/* Accent color picker */}
      <div className="personalization__section">
        <h3 className="personalization__section-title">Accent color</h3>
        <p className="personalization__section-desc">
          Pick a color for buttons, highlights, and active states
        </p>
        <div className="personalization__color-grid">
          {ACCENT_COLORS.map((color) => (
            <button
              key={color.value}
              className={`personalization__color-swatch ${
                theme.accent === color.value
                  ? 'personalization__color-swatch--active'
                  : ''
              }`}
              style={{ backgroundColor: color.value }}
              onClick={() => setAccent(color.value)}
              title={color.name}
              aria-label={`${color.name} accent color`}
            />
          ))}
        </div>
      </div>

      {/* Wallpaper/background picker */}
      <div className="personalization__section">
        <h3 className="personalization__section-title">Background</h3>
        <p className="personalization__section-desc">
          Choose a desktop background color
        </p>
        <div className="personalization__wallpaper-grid">
          {WALLPAPER_OPTIONS.map((wp) => (
            <button
              key={wp.id}
              className={`personalization__wallpaper-option ${
                theme.wallpaper === wp.id
                  ? 'personalization__wallpaper-option--active'
                  : ''
              }`}
              style={
                wp.type === 'solid'
                  ? { backgroundColor: wp.value }
                  : wp.type === 'image'
                    ? {
                        backgroundImage: `url(${wp.value})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }
                    : { backgroundColor: '#1a1a1a', overflow: 'hidden' }
              }
              onClick={() => setWallpaper(wp.id)}
            >
              {/* Video wallpapers get a small preview video as thumbnail */}
              {wp.type === 'video' && (
                <video
                  className="personalization__wallpaper-video"
                  src={wp.value}
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              )}
              <span className="personalization__wallpaper-label">
                {wp.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Personalization;
