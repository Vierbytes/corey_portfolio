/*
  Desktop Component

  This is the main component that represents the desktop environment.
  It manages the state of all open windows and renders the desktop icons,
  windows, and taskbar.

  I'm using React's useState to keep track of which windows are open,
  their positions, sizes, and which one is currently focused.
*/

import { useState } from 'react';
import Window from './Window';
import Taskbar from './Taskbar';
import StartMenu from './StartMenu';
import ContextMenu from './ContextMenu';
import AboutMe from './windows/AboutMe';
import Projects from './windows/Projects';
import Skills from './windows/Skills';
import Contact from './windows/Contact';
import Resume from './windows/Resume';
import {
  AboutMeIcon,
  ProjectsIcon,
  SkillsIcon,
  ContactIcon,
  ResumeIcon,
} from './icons/DesktopIcons';
import '../styles/Desktop.css';

// Map each window id to its content component
// This keeps the rendering logic clean - just look up the id and render
const WINDOW_CONTENT = {
  about: <AboutMe />,
  projects: <Projects />,
  skills: <Skills />,
  contact: <Contact />,
  resume: <Resume />,
};

// Configuration for all the desktop icons and their corresponding windows
// Each icon uses an inline SVG component for that authentic OS look
const DESKTOP_APPS = [
  { id: 'about', title: 'About Me', icon: <AboutMeIcon /> },
  { id: 'projects', title: 'Projects', icon: <ProjectsIcon /> },
  { id: 'skills', title: 'Skills', icon: <SkillsIcon /> },
  { id: 'contact', title: 'Contact', icon: <ContactIcon /> },
  { id: 'resume', title: 'Resume', icon: <ResumeIcon /> },
];

function Desktop() {
  // State to track all open windows
  // Each window object has: id, title, icon, position, size, isMinimized, isMaximized
  const [windows, setWindows] = useState([]);

  // State to track which window is currently focused (on top)
  const [focusedWindowId, setFocusedWindowId] = useState(null);

  // Counter to assign z-index values (higher = on top)
  const [topZIndex, setTopZIndex] = useState(100);

  // Start menu toggle
  const [showStartMenu, setShowStartMenu] = useState(false);

  // Right-click context menu position (null = hidden, { x, y } = visible)
  const [contextMenu, setContextMenu] = useState(null);

  // Opens a new window or focuses an existing one
  const openWindow = (appId) => {
    const app = DESKTOP_APPS.find((a) => a.id === appId);
    if (!app) return;

    // Check if window is already open
    const existingWindow = windows.find((w) => w.id === appId);

    if (existingWindow) {
      // If minimized, restore it
      if (existingWindow.isMinimized) {
        setWindows(
          windows.map((w) =>
            w.id === appId ? { ...w, isMinimized: false } : w
          )
        );
      }
      // Bring to front
      focusWindow(appId);
    } else {
      // Create new window with default position and size
      // Offsetting each new window slightly so they don't stack exactly on top of each other
      const offset = (windows.length % 5) * 30;
      const newWindow = {
        id: app.id,
        title: app.title,
        icon: app.icon,
        position: { x: 100 + offset, y: 50 + offset },
        size: { width: 600, height: 400 },
        isMinimized: false,
        isMaximized: false,
        zIndex: topZIndex + 1,
      };

      setWindows([...windows, newWindow]);
      setTopZIndex(topZIndex + 1);
      setFocusedWindowId(app.id);
    }
  };

  // Brings a window to the front and closes any open menus
  const focusWindow = (windowId) => {
    setWindows(
      windows.map((w) =>
        w.id === windowId ? { ...w, zIndex: topZIndex + 1 } : w
      )
    );
    setTopZIndex(topZIndex + 1);
    setFocusedWindowId(windowId);
    setShowStartMenu(false);
    setContextMenu(null);
  };

  // Closes a window
  const closeWindow = (windowId) => {
    setWindows(windows.filter((w) => w.id !== windowId));
    if (focusedWindowId === windowId) {
      setFocusedWindowId(null);
    }
  };

  // Minimizes a window
  const minimizeWindow = (windowId) => {
    setWindows(
      windows.map((w) =>
        w.id === windowId ? { ...w, isMinimized: true } : w
      )
    );
    if (focusedWindowId === windowId) {
      setFocusedWindowId(null);
    }
  };

  // Toggles maximize state
  const toggleMaximize = (windowId) => {
    setWindows(
      windows.map((w) =>
        w.id === windowId ? { ...w, isMaximized: !w.isMaximized } : w
      )
    );
  };

  // Updates window position (called during drag)
  const updateWindowPosition = (windowId, position) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === windowId ? { ...w, position } : w))
    );
  };

  // Updates window size (called during resize)
  const updateWindowSize = (windowId, size) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === windowId ? { ...w, size } : w))
    );
  };

  // Updates both size and position at once (called during resize from north/west edges)
  // This avoids the stale state issue where two separate setWindows calls would
  // overwrite each other during rapid mousemove events
  const updateWindowResize = (windowId, size, position) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === windowId ? { ...w, size, position } : w))
    );
  };

  return (
    <>
      <div
        className="desktop"
        onContextMenu={(e) => {
          // Only show context menu when right-clicking the desktop background
          // not when right-clicking inside a window or on an icon
          if (e.target.closest('.window') || e.target.closest('.desktop-icon')) return;
          e.preventDefault();
          setContextMenu({ x: e.clientX, y: e.clientY });
          setShowStartMenu(false);
        }}
      >
        {/* Desktop Icons */}
        <div className="desktop__icons">
          {DESKTOP_APPS.map((app) => (
            <button
              key={app.id}
              className="desktop-icon no-select"
              onDoubleClick={() => openWindow(app.id)}
            >
              <div className="desktop-icon__image">{app.icon}</div>
              <span className="desktop-icon__label">{app.title}</span>
            </button>
          ))}
        </div>

        {/* Windows */}
        <div className="desktop__windows">
          {windows.map((window) => (
            <Window
              key={window.id}
              {...window}
              isFocused={focusedWindowId === window.id}
              onFocus={() => focusWindow(window.id)}
              onClose={() => closeWindow(window.id)}
              onMinimize={() => minimizeWindow(window.id)}
              onMaximize={() => toggleMaximize(window.id)}
              onPositionChange={(pos) => updateWindowPosition(window.id, pos)}
              onSizeChange={(size) => updateWindowSize(window.id, size)}
              onResize={(size, pos) => updateWindowResize(window.id, size, pos)}
            >
              {WINDOW_CONTENT[window.id]}
            </Window>
          ))}
        </div>
      </div>

      {/* Start Menu - shows when the start button is clicked */}
      {showStartMenu && (
        <StartMenu
          apps={DESKTOP_APPS}
          onAppClick={(id) => {
            openWindow(id);
            setShowStartMenu(false);
          }}
          onClose={() => setShowStartMenu(false)}
        />
      )}

      {/* Right-click Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onOpenAbout={() => {
            openWindow('about');
            setContextMenu(null);
          }}
        />
      )}

      {/* Taskbar */}
      <Taskbar
        windows={windows}
        focusedWindowId={focusedWindowId}
        onStartClick={() => {
          setShowStartMenu(!showStartMenu);
          setContextMenu(null);
        }}
        isStartMenuOpen={showStartMenu}
        onWindowClick={(id) => {
          // Restore minimized window AND bring to front in one state update
          // This fixes the issue where focusWindow was using stale state
          setWindows(
            windows.map((w) =>
              w.id === id
                ? { ...w, isMinimized: false, zIndex: topZIndex + 1 }
                : w
            )
          );
          setTopZIndex(topZIndex + 1);
          setFocusedWindowId(id);
        }}
      />
    </>
  );
}

export default Desktop;
