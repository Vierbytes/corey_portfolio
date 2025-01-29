/*
  Window Component

  Using react-draggable to handle all the drag logic. This simplifies
  the code a lot since the library handles mouse tracking, bounds,
  and touch support automatically.

  The 'handle' prop tells it to only drag when clicking the header,
  and 'cancel' prevents dragging when clicking the control buttons.

  Important: react-draggable uses CSS transforms for positioning, so
  we don't set top/left on the window itself. The Draggable wrapper
  handles all positioning through transform: translate().
*/

import { useRef } from 'react';
import Draggable from 'react-draggable';
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
  // Ref needed for react-draggable to work with React 18+
  const nodeRef = useRef(null);

  // Build the class names based on state
  const windowClasses = [
    'window',
    isFocused && 'window--focused',
    isMaximized && 'window--maximized',
    isMinimized && 'window--minimized',
  ]
    .filter(Boolean)
    .join(' ');

  // Style object for sizing and z-index (no top/left, draggable handles that)
  const windowStyle = isMaximized
    ? { zIndex }
    : {
        width: size.width,
        height: size.height,
        zIndex,
      };

  // Called when dragging stops, updates position in parent state
  const handleDragStop = (_e, data) => {
    onPositionChange({ x: data.x, y: data.y });
  };

  // If minimized, don't render anything
  if (isMinimized) {
    return null;
  }

  // The window content
  const windowContent = (
    <div
      ref={nodeRef}
      className={windowClasses}
      style={windowStyle}
      onMouseDown={onFocus}
    >
      {/* Window Header (title bar) - this is the drag handle */}
      <div className="window__header no-select">
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
              <svg viewBox="0 0 10 10" fill="none" stroke="currentColor">
                <rect x="2" y="0" width="8" height="8" strokeWidth="1" />
                <rect x="0" y="2" width="8" height="8" strokeWidth="1" />
              </svg>
            ) : (
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

      {/* Resize handles (visual only for now) */}
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

  // If maximized, don't wrap with Draggable (can't drag a maximized window)
  if (isMaximized) {
    return windowContent;
  }

  // Wrap with Draggable for normal windows
  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".window__header"
      cancel=".window__controls"
      position={position}
      onStop={handleDragStop}
      onStart={onFocus}
      bounds="parent"
    >
      {windowContent}
    </Draggable>
  );
}

export default Window;
