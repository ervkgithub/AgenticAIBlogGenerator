const React = require('react');
const { createRoot } = require('react-dom/client');
const MarketingApp = require('./MarketingApp');

const container = document.getElementById('root');
if (container) {
  createRoot(container).render(React.createElement(MarketingApp));
}
