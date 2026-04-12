const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const { composePage } = require('../../edge/compose');

dotenv.config({ path: path.resolve(__dirname, '.env.' + (process.env.NODE_ENV || 'development')) });

const app = express();
const port = process.env.PORT || 4000;

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/remote-manifest.json', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../edge/remote-manifest.json'));
});

app.get('/', async (req, res) => {
  try {
    const html = await composePage();
    res.send(html);
  } catch (error) {
    res.status(500).send(`<pre>Host composition failure:\n${error.message}</pre>`);
  }
});

app.listen(port, () => {
  console.log(`Host container listening on http://localhost:${port}`);
});
