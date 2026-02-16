/*
  useIsMobile Hook

  Custom hook that detects if the viewport is mobile-sized (under 768px).
  I'm using window.matchMedia instead of a resize listener because it only
  fires when crossing the threshold, not on every single pixel of resize.
  This makes it way more efficient.

  Components use this to switch between desktop and mobile layouts -
  like showing full-screen windows on phones instead of draggable ones.
*/

import { useState, useEffect } from 'react';

// 768px is the standard tablet/mobile breakpoint
const MOBILE_QUERY = '(max-width: 767px)';

function useIsMobile() {
  // Initialize from the current viewport width so there's no flash
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia(MOBILE_QUERY).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY);

    // This only fires when the viewport crosses the 767px boundary
    const handler = (e) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);

    return () => mql.removeEventListener('change', handler);
  }, []);

  return isMobile;
}

export default useIsMobile;
