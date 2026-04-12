const React = require('react');
const { TeamBanner } = require('@mf/shared');

function MarketingApp() {
  return React.createElement(
    'div',
    {
      style: {
        border: '2px dashed #1d4ed8',
        borderRadius: '12px',
        padding: '1rem',
        margin: '1rem 0',
        background: '#eff6ff',
      },
    },
    React.createElement('h3', null, 'Marketing Remote App vvv'),
    React.createElement(TeamBanner, { teamName: 'Marketing', color: '#1d4ed8' }),
    React.createElement('p', null, 'This remote supports independent SSR and is loaded dynamically by the host container.')
  );
}

exports.default = MarketingApp;
module.exports = MarketingApp;
