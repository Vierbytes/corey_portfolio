/*
  Taskbar Component

  The taskbar at the bottom of the screen that shows open windows
  and the system clock. Clicking on a window button brings that
  window to the front (or restores it if minimized).

  The clock updates every second using setInterval inside useEffect.
  I had to remember to clean up the interval when the component unmounts
  to avoid memory leaks.

  The start button now opens the start menu - it calls onStartClick
  which is handled by the Desktop component.

  On mobile, the taskbar simplifies to just a back button and clock.
  No start menu or window buttons since the icons are already the
  home screen and only one window shows at a time.
*/

import { useState, useEffect } from 'react';
import '../styles/Taskbar.css';

function Taskbar({
  windows,
  focusedWindowId,
  onWindowClick,
  onStartClick,
  isStartMenuOpen,
  isMobile,
  onBackClick,
}) {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update the clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Cleanup function to clear the interval when component unmounts
    return () => clearInterval(timer);
  }, []);

  // Format time as HH:MM AM/PM
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Format date as M/D/YYYY
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Mobile taskbar - simplified with just a back button and clock
  if (isMobile) {
    return (
      <div className="taskbar taskbar--mobile no-select">
        <button
          className="taskbar__back-btn"
          onClick={onBackClick}
          aria-label="Back to home"
        >
          {/* Simple back/home arrow */}
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        </button>

        <div className="taskbar__tray">
          <div className="taskbar__clock">
            <span className="taskbar__time">{formatTime(currentTime)}</span>
          </div>
        </div>
      </div>
    );
  }

  // Desktop taskbar - full version with start menu, window buttons, clock
  return (
    <div className="taskbar no-select">
      {/* Start button - opens the start menu */}
      <button
        className={`taskbar__start ${isStartMenuOpen ? 'taskbar__start--active' : ''}`}
        aria-label="Start menu"
        onClick={onStartClick}
      >
        <img className="taskbar__start-icon" src="/icons8-windows.svg" alt="Start" />
      </button>

      {/* Open windows */}
      <div className="taskbar__windows">
        {windows.map((window) => (
          <button
            key={window.id}
            className={`taskbar__window-btn ${
              focusedWindowId === window.id && !window.isMinimized
                ? 'taskbar__window-btn--active'
                : ''
            }`}
            onClick={() => onWindowClick(window.id)}
          >
            <span className="taskbar__window-btn-icon">{window.icon}</span>
            <span className="taskbar__window-btn-title">{window.title}</span>
          </button>
        ))}
      </div>

      {/* System tray with clock */}
      <div className="taskbar__tray">
        <div className="taskbar__clock">
          <span className="taskbar__time">{formatTime(currentTime)}</span>
          <span className="taskbar__date">{formatDate(currentTime)}</span>
        </div>
      </div>
    </div>
  );
}

export default Taskbar;
