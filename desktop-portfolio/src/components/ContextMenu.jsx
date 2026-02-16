/*
  Context Menu Component

  This is the right-click menu that appears on the desktop background.
  It shows a few options like "About this desktop" which opens the
  About Me window, and some fun decorative items to make it feel real.

  Closes when you click outside it or press Escape.
*/

import { useEffect, useRef } from 'react';
import '../styles/ContextMenu.css';

function ContextMenu({ x, y, onClose, onOpenAbout, onOpenSettings }) {
  const menuRef = useRef(null);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Small delay so the right-click that opened it doesn't close it
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

  // Make sure the menu doesn't go off-screen
  // Adjust position if it would overflow the viewport
  const adjustedStyle = {
    top: y,
    left: x,
  };

  return (
    <div ref={menuRef} className="context-menu" style={adjustedStyle}>
      <button className="context-menu__item" onClick={onClose}>
        View
      </button>
      <button className="context-menu__item" onClick={onClose}>
        Sort by
      </button>
      <button className="context-menu__item" onClick={() => window.location.reload()}>
        Refresh
      </button>

      <div className="context-menu__divider" />

      <button className="context-menu__item" onClick={onOpenSettings}>
        Display settings
      </button>
      <button className="context-menu__item" onClick={onOpenAbout}>
        About this desktop
      </button>
    </div>
  );
}

export default ContextMenu;
