/*
  Theme Context

  This manages all the theming state for the desktop - dark/light mode,
  accent colors, and wallpaper backgrounds. I learned about React Context
  from the docs and it seemed perfect for this since multiple components
  need access to theme settings.

  The theme gets saved to localStorage so it persists when you refresh
  the page. A useEffect syncs the theme state to CSS custom properties
  on the document root, which is how the CSS picks up the changes.
*/

import { createContext, useContext, useState, useEffect } from 'react';

// Accent color presets - each has a base, hover, and active shade
// I picked these from Windows 11's color options
export const ACCENT_COLORS = [
  { name: 'Blue', value: '#0078d4', hover: '#1a86d9', active: '#006cc1' },
  { name: 'Purple', value: '#8764b8', hover: '#9b7dc4', active: '#7555a3' },
  { name: 'Red', value: '#e74856', hover: '#ee5f6b', active: '#d13440' },
  { name: 'Orange', value: '#f7630c', hover: '#f8762b', active: '#e55600' },
  { name: 'Green', value: '#00cc6a', hover: '#1ad67a', active: '#00b85e' },
  { name: 'Pink', value: '#ea005e', hover: '#ee1a6e', active: '#d40054' },
];

// Wallpaper options - solid colors and animated wallpapers from public/wallpapers/
// I found some cool pixel art gifs that give it a chill desktop vibe
export const WALLPAPER_OPTIONS = [
  // Solid colors
  { id: 'default', label: 'Default Dark', type: 'solid', value: '#0c0c0c' },
  { id: 'solid-dark-blue', label: 'Dark Blue', type: 'solid', value: '#0a1628' },
  { id: 'solid-dark-purple', label: 'Dark Purple', type: 'solid', value: '#1a0a28' },
  { id: 'solid-teal', label: 'Teal', type: 'solid', value: '#0a2828' },
  { id: 'light-default', label: 'Light Gray', type: 'solid', value: '#f0f0f0' },
  // Animated wallpapers from public/wallpapers/
  { id: 'dance', label: 'Dance', type: 'image', value: '/wallpapers/dance.gif' },
  { id: 'dancedance', label: 'Dance Dance', type: 'image', value: '/wallpapers/dancedance.webp' },
  { id: 'luffyspin', label: 'Luffy Spin', type: 'image', value: '/wallpapers/luffyspin.gif' },
  { id: 'nightpoke', label: 'Night Poke', type: 'image', value: '/wallpapers/nightpoke.gif' },
  { id: 'nightstroll', label: 'Night Stroll', type: 'image', value: '/wallpapers/nightstroll.gif' },
  { id: 'nighttrain', label: 'Night Train', type: 'image', value: '/wallpapers/nighttrain.gif' },
  { id: 'nkylfayx', label: 'Pixel City', type: 'image', value: '/wallpapers/nkylfayx2fye1.gif' },
  { id: 'picnic', label: 'Picnic', type: 'image', value: '/wallpapers/picnic.gif' },
  { id: 'rain', label: 'Rain', type: 'image', value: '/wallpapers/rain.gif' },
  { id: 'skyline', label: 'Skyline', type: 'image', value: '/wallpapers/skyline.gif' },
  { id: 'thecrashout', label: 'crashout', type: 'video', value: '/wallpapers/TheCrashoutAward.mp4' },
  { id: 'memes', label: 'meme', type: 'video', value: '/wallpapers/MemesNo.mp4' },
];

// Default theme settings
const DEFAULT_THEME = {
  mode: 'dark',
  accent: '#0078d4',
  wallpaper: 'default',
};

// Create the context
const ThemeContext = createContext();

// Try to load saved theme from localStorage
// If it fails or doesn't exist, use the defaults
function loadSavedTheme() {
  try {
    const saved = localStorage.getItem('desktop-theme');
    if (saved) {
      return { ...DEFAULT_THEME, ...JSON.parse(saved) };
    }
  } catch (err) {
    // If localStorage is corrupted or parsing fails, just use defaults
    console.warn('Failed to load saved theme, using defaults');
  }
  return DEFAULT_THEME;
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(loadSavedTheme);

  // Sync theme to the DOM whenever it changes
  // This sets CSS custom properties and data attributes that the
  // stylesheets use to switch between light and dark mode
  useEffect(() => {
    const root = document.documentElement;

    // Set the data-theme attribute for light/dark CSS switching
    root.setAttribute('data-theme', theme.mode);

    // Apply the accent color and its hover/active variants
    const accent =
      ACCENT_COLORS.find((c) => c.value === theme.accent) || ACCENT_COLORS[0];
    root.style.setProperty('--color-primary', accent.value);
    root.style.setProperty('--color-primary-hover', accent.hover);
    root.style.setProperty('--color-primary-active', accent.active);

    // Apply the wallpaper - either a solid color or an image
    const wallpaper =
      WALLPAPER_OPTIONS.find((w) => w.id === theme.wallpaper) ||
      WALLPAPER_OPTIONS[0];
    if (wallpaper.type === 'solid') {
      root.style.setProperty('--color-desktop-bg', wallpaper.value);
      root.style.setProperty('--wallpaper-image', 'none');
    } else if (wallpaper.type === 'image') {
      // For image wallpapers (gif, webp, etc.), use CSS background-image
      root.style.setProperty('--color-desktop-bg', '#0c0c0c');
      root.style.setProperty('--wallpaper-image', `url(${wallpaper.value})`);
    } else if (wallpaper.type === 'video') {
      // For video wallpapers, the <video> element in Desktop handles rendering
      // Just set a dark fallback bg and clear any background image
      root.style.setProperty('--color-desktop-bg', '#0c0c0c');
      root.style.setProperty('--wallpaper-image', 'none');
    }

    // Save to localStorage so it persists across page reloads
    localStorage.setItem('desktop-theme', JSON.stringify(theme));
  }, [theme]);

  // Helper functions to update individual theme properties
  // This way components don't need to know the full theme shape
  const setMode = (mode) => setTheme((prev) => ({ ...prev, mode }));
  const setAccent = (accent) => setTheme((prev) => ({ ...prev, accent }));
  const setWallpaper = (wallpaper) =>
    setTheme((prev) => ({ ...prev, wallpaper }));

  return (
    <ThemeContext.Provider value={{ theme, setMode, setAccent, setWallpaper }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to access the theme context
// This is cleaner than importing useContext and ThemeContext separately
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
