const React = require('react');

function TeamBanner({ teamName, color = '#3b82f6' }) {
  return React.createElement(
    'div',
    {
      style: {
        border: `2px solid ${color}`,
        borderRadius: '12px',
        padding: '1rem',
        margin: '1rem 0',
        background: '#f8fafc',
      },
    },
    React.createElement('strong', null, `Team: ${teamName}`)
  );
}

function getRemoteConfig() {
  return {
    cdnBase: process.env.REMOTE_CDN_BASE || 'http://localhost:4000',
  };
}

module.exports = {
  TeamBanner,
  getRemoteConfig,
};
