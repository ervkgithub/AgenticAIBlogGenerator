# MicroFrontendModuleFederation

A production-ready Module Federation microfrontend demo with edge-composed SSR remotes, independent deployment, and CI per team.

## Architecture

- `apps/host`: module federation container and edge composition shell
- `apps/marketing`: remote microfrontend with standalone SSR endpoint
- `apps/catalog`: remote microfrontend with standalone SSR endpoint
- `apps/checkout`: remote microfrontend with standalone SSR endpoint
- `packages/shared`: shared UI and configuration utilities
- `edge/remote-manifest.json`: CDN-edge manifest for remotes

## Features

- Webpack Module Federation for dynamic remote loading
- Edge-side composition with runtime remote SSR assembly
- SSR per remote microfrontend
- Dockerized host and remotes
- Independent CI workflows for each unit
- Environment-based configuration support

## Getting Started

1. Install dependencies

```bash
cd "C:\Users\Lenovo\Desktop\Agentic AI\MicroFrontendModuleFederation"
npm install
```

2. Start the development environment

```bash
npm run dev
```

3. Open the host app at `http://localhost:4000`

## Containers

- Host: `localhost:4000`
- Marketing: `localhost:4001`
- Catalog: `localhost:4002`
- Checkout: `localhost:4003`

## CI

Each microfrontend app has its own GitHub Actions workflow under `.github/workflows/`.
