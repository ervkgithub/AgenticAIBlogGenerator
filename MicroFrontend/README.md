# Microfrontend Demo Platform

This repository is a working example of a microfrontend architecture built to help you understand what microfrontends are in a practical way.

It uses:

- `Next.js` for the host shell
- `React.js` for independently owned remote apps
- `TypeScript` for strong contracts and maintainability
- `Tailwind CSS` for consistent styling
- `Jest` and Testing Library for unit testing
- `npm workspaces` for a simple monorepo developer experience

## What This Project Demonstrates

This demo simulates **four independent frontend teams**:

- `Marketing` team
- `Catalog` team
- `Account` team
- `Checkout` team

Each team owns its own app, build config, tests, Tailwind setup, and local dev server.

The `shell` app composes all of them into one unified experience.

## Why This Is A Microfrontend

This setup follows real microfrontend principles:

- Each remote has its **own deployable frontend**
- Each remote can be **run and developed independently**
- The host shell composes the UI at runtime
- Shared contracts are centralized in `packages/contracts`
- Team boundaries are explicit and easy to scale

In this example, the remotes expose **custom elements (web components)** through independent React bundles. The Next.js shell loads those bundles from separate ports and renders them inside the main application.

## Folder Structure

```text
MicroFrontend/
├── apps/
│   ├── shell/       # Next.js host shell on port 3000
│   ├── marketing/   # React remote on port 3001
│   ├── catalog/     # React remote on port 3002
│   ├── account/     # React remote on port 3003
│   └── checkout/    # React remote on port 3004
├── packages/
│   └── contracts/   # Shared TypeScript contracts
├── package.json
└── README.md
```

## Architecture Overview

### 1. Shell App

`apps/shell` is the main application shell built with Next.js.

Responsibilities:

- page layout and routing
- loading remote scripts
- rendering microfrontends into the host UI
- defining integration metadata
- enforcing shared contracts

### 2. Remote Apps

Each remote app:

- is a standalone React app
- runs on its own port
- has its own `webpack.config.js`
- exposes a custom element such as `marketing-widget`
- can be opened and tested independently

### 3. Shared Contracts

`packages/contracts` contains shared TypeScript types used by both the host and the remotes.

This is important because in production microfrontend systems, shared contracts reduce integration errors and improve reliability.

## Production-Ready Design Choices

This repo is intentionally structured to be clean and scalable:

- strong typing through shared contracts
- isolated team ownership by workspace/app
- independent runtime loading of remotes
- Tailwind class prefixing in remotes to reduce style clashes
- reusable UI patterns and consistent app structure
- basic testing for each app
- no hidden coupling between teams
- simple, maintainable monorepo setup

## Security And Reliability Notes

The shell uses a fixed allowlist of remote script URLs declared in code.

That matters because production systems should avoid loading arbitrary script URLs from user input. In a real deployment, you would also add:

- CSP headers
- remote asset integrity checks where possible
- versioned remote manifests
- monitoring and error reporting
- contract/version compatibility checks

## Setup Requirements

Install these before running:

- `Node.js 20+`
- `npm 10+`

To verify:

```bash
node -v
npm -v
```

## Step-By-Step Setup

### 1. Open the project folder

```bash
cd "C:\Users\Lenovo\Desktop\Agentic AI\MicroFrontend"
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run all apps together

```bash
npm run dev
```

This starts:

- shell at [http://localhost:3000](http://localhost:3000)
- marketing at [http://localhost:3001](http://localhost:3001)
- catalog at [http://localhost:3002](http://localhost:3002)
- account at [http://localhost:3003](http://localhost:3003)
- checkout at [http://localhost:3004](http://localhost:3004)

Open [http://localhost:3000](http://localhost:3000) to see the full composed experience.

## Running Individual Apps

You can run each team app independently.

### Run only the shell

```bash
npm run dev --workspace @micro/shell
```

### Run only marketing

```bash
npm run dev --workspace @micro/marketing
```

### Run only catalog

```bash
npm run dev --workspace @micro/catalog
```

### Run only account

```bash
npm run dev --workspace @micro/account
```

### Run only checkout

```bash
npm run dev --workspace @micro/checkout
```

## Build For Production

```bash
npm run build
```

## Run Tests

Run all tests:

```bash
npm run test
```

Run type checks:

```bash
npm run typecheck
```

## How The Runtime Composition Works

1. The Next.js shell defines remote metadata in `apps/shell/lib/microfrontends.ts`
2. Each remote serves a `bundle.js` file on its own port
3. The shell loads the remote script dynamically
4. The script registers a custom element like `catalog-widget`
5. The shell creates that element and passes typed props to it
6. The remote renders itself inside the shell UI

This gives you separation between teams while keeping one product experience for users.

## Example Team Ownership Model

Here is a realistic split:

- Marketing team controls banners, campaigns, and hero sections
- Catalog team controls search, listing cards, and discovery
- Account team controls profile and authenticated customer experiences
- Checkout team controls payment and order confidence surfaces
- Platform team controls the shell, contracts, observability, and governance

## How To Extend This Project

You can grow this into a more advanced system by adding:

- authentication and role-based access
- shared design system package
- remote manifest service
- feature flags
- analytics/events package
- CI/CD pipelines per team app
- visual regression testing
- end-to-end tests

## Important Note

This example is intentionally designed to be easier to understand than a very large enterprise setup.

It is still a strong foundation because it demonstrates:

- independent frontend ownership
- runtime composition
- contract-based integration
- styling isolation
- maintainable code organization

If you want, this can later be upgraded to:

- Module Federation
- edge-composed microfrontends
- SSR per remote
- containerized deployment
- CI pipelines per team

## Quick Start Summary

```bash
cd "C:\Users\Lenovo\Desktop\Agentic AI\MicroFrontend"
npm install
npm run dev
```

Then open:

- [http://localhost:3000](http://localhost:3000)

