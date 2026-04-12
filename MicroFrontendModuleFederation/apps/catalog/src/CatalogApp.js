const React = require('react');
const { TeamBanner } = require('@mf/shared');

function CatalogApp() {
  return React.createElement(
    'div',
    {
      style: {
        border: '2px dashed #9333ea',
        borderRadius: '12px',
        padding: '1rem',
        margin: '1rem 0',
        background: '#f5f3ff',
      },
    },
    React.createElement('h3', null, 'Catalog Remote App'),
    React.createElement(TeamBanner, { teamName: 'Catalog', color: '#9333ea' }),
    React.createElement('p', null, 'This remote operates independently, including standalone SSR.')
  );
}

exports.default = CatalogApp;
module.exports = CatalogApp;
