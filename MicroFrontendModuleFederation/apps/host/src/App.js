import React from 'react';
import { TeamBanner } from '@mf/shared';

function App() {
  React.useEffect(() => {
    if (window.mountRemote) {
      window.mountRemote('marketing', '#remote-marketing');
      window.mountRemote('catalog', '#remote-catalog');
      window.mountRemote('checkout', '#remote-checkout');
    }
  }, []);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
      <h1>Host Container</h1>
      <TeamBanner teamName="Host Composition Team" color="#0f766e" />
      <div id="remote-marketing">Loading marketing remote...</div>
      <div id="remote-catalog">Loading catalog remote...</div>
      <div id="remote-checkout">Loading checkout remote...</div>
    </div>
  );
}

export default App;
