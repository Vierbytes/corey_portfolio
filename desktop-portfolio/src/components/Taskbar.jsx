/*
  Taskbar Component

  The taskbar at the bottom of the screen that shows open windows
  and the system clock. Clicking on a window button brings that
  window to the front (or restores it if minimized).

  The clock updates every second using setInterval inside useEffect.
  I had to remember to clean up the interval when the component unmounts
  to avoid memory leaks.
*/

import { useState, useEffect } from 'react';
import '../styles/Taskbar.css';

function Taskbar({ windows, focusedWindowId, onWindowClick }) {
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

  return (
    <div className="taskbar no-select">
      {/* Start button placeholder (for future start menu) */}
      <button className="taskbar__start" aria-label="Start menu">
        <span className="taskbar__start-icon">⊞</span>
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
