const React = require('react');
const { createRoot } = require('react-dom/client');
const CatalogApp = require('./CatalogApp');

const container = document.getElementById('root');
if (container) {
  createRoot(container).render(React.createElement(CatalogApp));
}
