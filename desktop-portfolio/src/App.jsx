/*
  App Component

  The root component of the desktop portfolio.
  This just renders the Desktop component which handles everything else.

  Later on, this could be expanded to include things like:
  - A boot sequence animation
  - Theme context provider
  - Global state management
*/

import Desktop from './components/Desktop';

function App() {
  return <Desktop />;
}

export default App;
