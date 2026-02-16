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

  Resize is handled manually with mousedown/mousemove/mouseup events
  on the 8 edge and corner handles. When resizing from the north or
  west sides, we also need to update the window position so the
  opposite edge stays anchored in place.

  The tricky part was getting resize to work with React's state model.
  Since mousemove fires rapidly, I store all the starting values in a
  ref on mousedown, then calculate deltas from that on each move. The
  onResize callback updates both size and position in a single state
  update to avoid stale closure issues.
*/

import { useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import '../styles/Window.css';

// Minimum window dimensions - matches the CSS min-width/min-height
const MIN_WIDTH = 300;
const MIN_HEIGHT = 200;

function Window({
  id,
  title,
  icon,
  position,
  size,
  zIndex,
  isMinimized,
  isMaximized,
  isMobile,
  isFocused,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  onPositionChange,
  onSizeChange,
  onResize,
  children,
}) {
  // Ref needed for react-draggable to work with React 18+
  const nodeRef = useRef(null);

  /*
    Resize state ref - stores everything we need during a resize drag:
    - direction: which handle was grabbed ('n', 'se', 'nw', etc.)
    - startX/Y: mouse position when the drag started
    - startWidth/Height: window size when the drag started
    - startPosX/Y: window position when the drag started

    Using a ref instead of state because mousemove fires dozens of times
    per second and we don't want to re-render just to track the start values.
  */
  const resizeRef = useRef(null);

  /*
    Storing the onResize callback in a ref so our mousemove handler always
    calls the latest version. Without this, the event listener would capture
    a stale closure from when it was first attached.
  */
  const onResizeRef = useRef(onResize);
  onResizeRef.current = onResize;

  const onSizeChangeRef = useRef(onSizeChange);
  onSizeChangeRef.current = onSizeChange;

  // Build the class names based on state
  const windowClasses = [
    'window',
    isFocused && 'window--focused',
    isMaximized && 'window--maximized',
    isMinimized && 'window--minimized',
    isMobile && 'window--mobile',
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

  /*
    These are the raw mousemove/mouseup handlers that get attached to
    document during a resize. They're defined once and stored in refs
    so we can reliably remove them later.
  */
  const handleMouseMove = useRef((e) => {
    if (!resizeRef.current) return;

    const { direction, startX, startY, startWidth, startHeight, startPosX, startPosY } =
      resizeRef.current;

    // How far the mouse moved from where we started
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    let newWidth = startWidth;
    let newHeight = startHeight;
    let newPosX = startPosX;
    let newPosY = startPosY;

    // East side - dragging right makes it wider
    if (direction.includes('e')) {
      newWidth = Math.max(MIN_WIDTH, startWidth + deltaX);
    }

    // West side - dragging left makes it wider, but also moves the window
    // so the right edge stays where it was
    if (direction.includes('w')) {
      newWidth = Math.max(MIN_WIDTH, startWidth - deltaX);
      // Only move position if we actually resized (not clamped at min)
      if (newWidth > MIN_WIDTH) {
        newPosX = startPosX + deltaX;
      } else {
        // Clamped - position should be where it would be at min width
        newPosX = startPosX + (startWidth - MIN_WIDTH);
      }
    }

    // South side - dragging down makes it taller
    if (direction.includes('s')) {
      newHeight = Math.max(MIN_HEIGHT, startHeight + deltaY);
    }

    // North side - dragging up makes it taller, moves window down to anchor bottom
    if (direction.includes('n')) {
      newHeight = Math.max(MIN_HEIGHT, startHeight - deltaY);
      if (newHeight > MIN_HEIGHT) {
        newPosY = startPosY + deltaY;
      } else {
        newPosY = startPosY + (startHeight - MIN_HEIGHT);
      }
    }

    // Use the single onResize callback to update both size and position
    // in one state update - this prevents the stale closure problem where
    // calling onSizeChange and onPositionChange separately would cause
    // the second call to overwrite the first
    const needsPositionUpdate = newPosX !== startPosX || newPosY !== startPosY;

    if (needsPositionUpdate && onResizeRef.current) {
      onResizeRef.current(
        { width: newWidth, height: newHeight },
        { x: newPosX, y: newPosY }
      );
    } else if (onSizeChangeRef.current) {
      // For east/south only resizing, just update the size
      onSizeChangeRef.current({ width: newWidth, height: newHeight });
    }
  });

  const handleMouseUp = useRef(() => {
    resizeRef.current = null;
    document.removeEventListener('mousemove', handleMouseMove.current);
    document.removeEventListener('mouseup', handleMouseUp.current);
  });

  /*
    Resize start handler - called when mousedown fires on a resize handle.

    Records the starting state so we can calculate deltas during mousemove.
    The direction string tells us which edges are being dragged (e.g. 'se'
    means south + east corner).
  */
  const handleResizeStart = (direction, e) => {
    // Prevent the click from triggering drag or other handlers
    e.preventDefault();
    e.stopPropagation();

    // Save the starting state for delta calculations
    resizeRef.current = {
      direction,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: size.width,
      startHeight: size.height,
      startPosX: position.x,
      startPosY: position.y,
    };

    // Listen on document so we can track the mouse even outside the window
    document.addEventListener('mousemove', handleMouseMove.current);
    document.addEventListener('mouseup', handleMouseUp.current);
  };

  // Cleanup: if the component unmounts while we're resizing, remove listeners
  useEffect(() => {
    const moveHandler = handleMouseMove.current;
    const upHandler = handleMouseUp.current;
    return () => {
      document.removeEventListener('mousemove', moveHandler);
      document.removeEventListener('mouseup', upHandler);
    };
  }, []);

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
      {/* Window Header (title bar) - drag handle + double-click to maximize */}
      <div
        className="window__header no-select"
        onDoubleClick={isMobile ? undefined : onMaximize}
      >
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

      {/* Resize handles - each edge and corner can be dragged to resize
         Hidden on mobile since windows are always full-screen */}
      {!isMaximized && !isMobile && (
        <>
          <div
            className="window__resize-handle window__resize-handle--n"
            onMouseDown={(e) => handleResizeStart('n', e)}
          />
          <div
            className="window__resize-handle window__resize-handle--s"
            onMouseDown={(e) => handleResizeStart('s', e)}
          />
          <div
            className="window__resize-handle window__resize-handle--e"
            onMouseDown={(e) => handleResizeStart('e', e)}
          />
          <div
            className="window__resize-handle window__resize-handle--w"
            onMouseDown={(e) => handleResizeStart('w', e)}
          />
          <div
            className="window__resize-handle window__resize-handle--ne"
            onMouseDown={(e) => handleResizeStart('ne', e)}
          />
          <div
            className="window__resize-handle window__resize-handle--nw"
            onMouseDown={(e) => handleResizeStart('nw', e)}
          />
          <div
            className="window__resize-handle window__resize-handle--se"
            onMouseDown={(e) => handleResizeStart('se', e)}
          />
          <div
            className="window__resize-handle window__resize-handle--sw"
            onMouseDown={(e) => handleResizeStart('sw', e)}
          />
        </>
      )}
    </div>
  );

  // If maximized or mobile, don't wrap with Draggable
  // Mobile windows are always full-screen, no need for dragging
  if (isMaximized || isMobile) {
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
