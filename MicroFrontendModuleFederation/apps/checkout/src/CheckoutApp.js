const React = require('react');
const { TeamBanner } = require('@mf/shared');

function CheckoutApp() {
  return React.createElement(
    'div',
    {
      style: {
        border: '2px dashed #059669',
        borderRadius: '12px',
        padding: '1rem',
        margin: '1rem 0',
        background: '#ecfdf5',
      },
    },
    React.createElement('h3', null, 'Checkout Remote App'),
    React.createElement(TeamBanner, { teamName: 'Checkout', color: '#059669' }),
    React.createElement('p', null, 'This remote includes its own SSR endpoint and client bundle.')
  );
}

exports.default = CheckoutApp;
module.exports = CheckoutApp;
