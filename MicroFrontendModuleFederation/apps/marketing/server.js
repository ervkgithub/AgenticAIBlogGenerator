const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const React = require('react');
const ReactDOMServer = require('react-dom/server');

dotenv.config({ path: path.resolve(__dirname, '.env.' + (process.env.NODE_ENV || 'development')) });

const app = express();
const port = process.env.PORT || 4001;

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/ssr', (req, res) => {
  const MarketingApp = require('./src/MarketingApp');
  const markup = ReactDOMServer.renderToString(React.createElement(MarketingApp));
  res.send(`<section><h2>Marketing Remote</h2>${markup}</section>`);
});

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public/index.html'));
});

app.listen(port, () => {
  console.log(`Marketing remote listening on http://localhost:${port}`);
});
