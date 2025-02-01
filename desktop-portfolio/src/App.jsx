/*
  App Component

  The root component of the desktop portfolio.
  On first load it shows a boot animation (like a real computer starting up),
  then switches to the actual Desktop once the animation finishes.
*/

import { useState } from 'react';
import Desktop from './components/Desktop';
import BootScreen from './components/BootScreen';

function App() {
  // Start with the boot animation showing
  const [isBooting, setIsBooting] = useState(true);

  // Show boot screen first, then desktop
  if (isBooting) {
    return <BootScreen onComplete={() => setIsBooting(false)} />;
  }

  return <Desktop />;
}

export default App;
