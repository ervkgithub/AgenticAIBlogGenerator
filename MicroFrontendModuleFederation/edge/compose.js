const fs = require('fs');
const path = require('path');

async function fetchRemoteFragment(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Remote SSR fetch failed: ${url} (${response.status})`);
  }
  return response.text();
}

function loadManifest() {
  const manifestPath = path.resolve(__dirname, 'remote-manifest.json');
  const content = fs.readFileSync(manifestPath, 'utf-8');
  return JSON.parse(content);
}

async function composePage() {
  const manifest = loadManifest();
  const fragments = await Promise.all(
    manifest.remotes.map(async (remote) => {
      const html = await fetchRemoteFragment(remote.ssrUrl);
      return `<!-- remote:${remote.name} -->\n${html}`;
    })
  );

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Module Federation Host</title>
  </head>
  <body>
    <div id="root">
      <section class="host-shell">
        <h1>Host Container (Edge-Composed SSR)</h1>
        ${fragments.join('\n')}
      </section>
    </div>
    <script src="/host.js"></script>
    ${manifest.remotes
      .map(
        (remote) => `<script src="${remote.remoteEntry}" crossorigin="anonymous"></script>`
      )
      .join('\n')}
  </body>
</html>`;
}

module.exports = {
  composePage,
  loadManifest,
};
