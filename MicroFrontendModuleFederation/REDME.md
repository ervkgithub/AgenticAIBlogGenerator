# MicroFrontendModuleFederation

This project demonstrates a production-ready Webpack Module Federation microfrontend architecture with:

- Host container app that composes independent remotes
- Independent remote apps for `marketing`, `catalog`, and `checkout`
- Standalone SSR endpoints for each remote
- Edge-style composition via remote manifest metadata
- Dockerized deployment for host and remote containers
- Independent CI workflows for each app

## How it works

### 1. Host container (`apps/host`)

- Uses Webpack Module Federation to load remote modules dynamically.
- Exposes no remotes itself; it consumes remotes from the three team apps.
- Renders the host shell client-side using React `createRoot`.
- Loads remotes using federated dynamic imports such as `import('marketing/MarketingApp')`.
- Mounts remote components into host DOM placeholders:
  - `#remote-marketing`
  - `#remote-catalog`
  - `#remote-checkout`

### 2. Remote apps (`apps/marketing`, `apps/catalog`, `apps/checkout`)

- Each remote app is an independent webpack-based React app.
- Each app exposes a single component via Module Federation:
  - `marketing` exposes `./MarketingApp`
  - `catalog` exposes `./CatalogApp`
  - `checkout` exposes `./CheckoutApp`
- Each remote also provides a standalone SSR endpoint at `/ssr`.
- The host can compose remote UI either by loading the remote bundle or by fetching remote SSR fragments.

### 3. Shared package (`packages/shared`)

- Contains reusable UI utilities and configuration helpers.
- Shared via local `file:../packages/shared` dependency references so each workspace can import it cleanly.

### 4. Edge composition

- Uses `edge/remote-manifest.json` to declare remote endpoints and remote entry URLs.
- Allows a composition layer or edge runtime to discover remote URLs and SSR endpoints.
- The host currently simulates edge composition through the manifest and dynamic runtime loading.

## Configuration

### Prerequisites

- Node.js 20.x or later
- npm 10.x or later
- Docker (for container builds)

### Install dependencies

From the project root:

```bash
cd "C:\Users\Lenovo\Desktop\Agentic AI\MicroFrontendModuleFederation"
npm install
```

### Run locally

To start all apps at once:

```bash
npm run dev
```

This will start:

- Host: `http://localhost:4000`
- Marketing remote: `http://localhost:4001`
- Catalog remote: `http://localhost:4002`
- Checkout remote: `http://localhost:4003`

### Run individual apps

You can run each workspace separately:

```bash
npm run dev --workspace @mf/host
npm run dev --workspace @mf/marketing
npm run dev --workspace @mf/catalog
npm run dev --workspace @mf/checkout
```

### Build

To build all workspaces:

```bash
npm run build
```

### Docker

To build and run containers:

```bash
npm run docker:compose
```

### CI

Each app has its own GitHub Actions workflow under `.github/workflows`:

- `ci-host.yml`
- `ci-marketing.yml`
- `ci-catalog.yml`
- `ci-checkout.yml`

Each workflow installs dependencies, runs build/test, and builds the Docker image for that app.

## Troubleshooting

- If remotes do not load, verify the remote apps are running and reachable on their configured ports.
- Ensure `webpack-dev-server` and `webpack` versions are compatible with your npm and Node.js environment.
- If client mount errors appear, make sure host placeholders are present and `mountRemote` is using the correct DOM selectors.

## Notes

- This setup is intentionally designed for independent team ownership: each remote can be developed, tested, and deployed separately.
- The host is the composition layer; remotes remain isolated and expose only the components required by the host.
