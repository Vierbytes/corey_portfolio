/*
  Start Menu Component

  Opens when you click the Start button in the taskbar, just like Windows.
  Shows a user profile section at the top and a list of all the desktop
  apps below. Clicking an app opens its window and closes the menu.

  The menu closes when you click outside it or press Escape, which I
  handled with useEffect listeners on the document.
*/

import { useEffect, useRef } from 'react';
import '../styles/StartMenu.css';

function StartMenu({ apps, onAppClick, onClose }) {
  const menuRef = useRef(null);

  // Close the menu when clicking outside it or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Don't close if clicking inside the menu or on the start button
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        const startBtn = e.target.closest('.taskbar__start');
        if (!startBtn) {
          onClose();
        }
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Small delay so the click that opened the menu doesn't immediately close it
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 0);
    document.addEventListener('keydown', handleEscape);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <div ref={menuRef} className="start-menu">
      {/* User profile section at the top */}
      <div className="start-menu__profile">
        <div className="start-menu__avatar">CL</div>
        <div className="start-menu__user-info">
          <span className="start-menu__user-name">Corey Lindsey</span>
          <span className="start-menu__user-title">Software Engineer</span>
        </div>
      </div>

      {/* Divider line */}
      <div className="start-menu__divider" />

      {/* App list */}
      <div className="start-menu__apps">
        {apps.map((app) => (
          <button
            key={app.id}
            className="start-menu__app-btn"
            onClick={() => onAppClick(app.id)}
          >
            <span className="start-menu__app-icon">{app.icon}</span>
            <span className="start-menu__app-title">{app.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default StartMenu;
