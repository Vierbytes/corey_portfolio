/*
  Window Component

  This is a reusable window component that can be dragged, resized,
  minimized, maximized, and closed. It's the core of the desktop OS feel.

  The dragging is implemented using mouse events. When you mousedown on
  the header, it starts tracking mouse movement and updates the position.

  I spent a while figuring out the dragging logic. The key insight was
  that you need to track the offset between where you clicked and the
  window's top-left corner, not just the mouse position directly.
*/

import { useRef, useEffect } from 'react';
import '../styles/Window.css';

function Window({
  id,
  title,
  icon,
  position,
  size,
  zIndex,
  isMinimized,
  isMaximized,
  isFocused,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  onPositionChange,
  onSizeChange,
  children,
}) {
  const windowRef = useRef(null);
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Handle dragging
  const handleMouseDown = (e) => {
    // Only start drag if clicking on the header (not the buttons)
    if (e.target.closest('.window__controls')) return;

    isDragging.current = true;
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };

    // Bring window to front when starting to drag
    onFocus();

    // Add listeners to document so we can track mouse even outside the window
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;

    const newX = e.clientX - dragOffset.current.x;
    const newY = e.clientY - dragOffset.current.y;

    // Keep window within bounds (don't let it go off screen)
    const boundedX = Math.max(0, newX);
    const boundedY = Math.max(0, newY);

    onPositionChange({ x: boundedX, y: boundedY });
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // Cleanup event listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Build the class names based on state
  const windowClasses = [
    'window',
    isFocused && 'window--focused',
    isMaximized && 'window--maximized',
    isMinimized && 'window--minimized',
  ]
    .filter(Boolean)
    .join(' ');

  // Style object for positioning
  const windowStyle = isMaximized
    ? { zIndex }
    : {
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex,
      };

  return (
    <div
      ref={windowRef}
      className={windowClasses}
      style={windowStyle}
      onMouseDown={onFocus}
    >
      {/* Window Header (title bar) */}
      <div className="window__header no-select" onMouseDown={handleMouseDown}>
        <div className="window__title">
          <span className="window__title-icon">{icon}</span>
          <span>{title}</span>
        </div>

        {/* Control buttons */}
        <div className="window__controls">
          <button
            className="window__control-btn"
            onClick={onMinimize}
            aria-label="Minimize"
          >
            <svg viewBox="0 0 10 10" fill="currentColor">
              <rect x="0" y="4" width="10" height="1" />
            </svg>
          </button>

          <button
            className="window__control-btn"
            onClick={onMaximize}
            aria-label={isMaximized ? 'Restore' : 'Maximize'}
          >
            {isMaximized ? (
              // Restore icon (two overlapping squares)
              <svg viewBox="0 0 10 10" fill="none" stroke="currentColor">
                <rect x="2" y="0" width="8" height="8" strokeWidth="1" />
                <rect x="0" y="2" width="8" height="8" strokeWidth="1" />
              </svg>
            ) : (
              // Maximize icon (single square)
              <svg viewBox="0 0 10 10" fill="none" stroke="currentColor">
                <rect x="0" y="0" width="10" height="10" strokeWidth="1" />
              </svg>
            )}
          </button>

          <button
            className="window__control-btn window__control-btn--close"
            onClick={onClose}
            aria-label="Close"
          >
            <svg viewBox="0 0 10 10" fill="currentColor">
              <path d="M1 0L0 1L4 5L0 9L1 10L5 6L9 10L10 9L6 5L10 1L9 0L5 4L1 0Z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="window__content">
        {children || (
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Content for {title} will go here...
          </p>
        )}
      </div>

      {/* Resize handles (visual only for now, functionality coming later) */}
      {!isMaximized && (
        <>
          <div className="window__resize-handle window__resize-handle--n" />
          <div className="window__resize-handle window__resize-handle--s" />
          <div className="window__resize-handle window__resize-handle--e" />
          <div className="window__resize-handle window__resize-handle--w" />
          <div className="window__resize-handle window__resize-handle--ne" />
          <div className="window__resize-handle window__resize-handle--nw" />
          <div className="window__resize-handle window__resize-handle--se" />
          <div className="window__resize-handle window__resize-handle--sw" />
        </>
      )}
    </div>
  );
}

export default Window;
