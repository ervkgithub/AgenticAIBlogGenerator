const React = require('react');
const { createRoot } = require('react-dom/client');
const CheckoutApp = require('./CheckoutApp');

const container = document.getElementById('root');
if (container) {
  createRoot(container).render(React.createElement(CheckoutApp));
}
