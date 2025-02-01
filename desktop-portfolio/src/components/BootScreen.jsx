/*
  Boot Screen Component

  This plays a short loading animation when the site first loads,
  like the startup screen you see when turning on a computer.
  It shows a logo and a spinning loader, then fades out and reveals
  the actual desktop.

  I used useEffect with setTimeout to auto-dismiss after a few seconds.
  The fade-out class triggers a CSS animation before the component
  gets removed from the DOM.
*/

import { useState, useEffect } from 'react';
import '../styles/BootScreen.css';

function BootScreen({ onComplete }) {
  // Track whether we're in the fade-out phase
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // After 2.5 seconds, start the fade-out animation
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 2500);

    // After the fade completes (2.5s + 0.5s fade), tell App we're done
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`boot-screen ${isFadingOut ? 'boot-screen--fading' : ''}`}>
      {/* Simple Windows-style boot logo */}
      <div className="boot-screen__content">
        <div className="boot-screen__logo">
          {/* Four squares arranged in a grid - inspired by the Windows logo */}
          <div className="boot-screen__logo-grid">
            <div className="boot-screen__logo-square boot-screen__logo-square--1" />
            <div className="boot-screen__logo-square boot-screen__logo-square--2" />
            <div className="boot-screen__logo-square boot-screen__logo-square--3" />
            <div className="boot-screen__logo-square boot-screen__logo-square--4" />
          </div>
        </div>

        {/* Loading dots animation */}
        <div className="boot-screen__loader">
          <div className="boot-screen__dot" />
          <div className="boot-screen__dot" />
          <div className="boot-screen__dot" />
          <div className="boot-screen__dot" />
          <div className="boot-screen__dot" />
        </div>
      </div>
    </div>
  );
}

export default BootScreen;
