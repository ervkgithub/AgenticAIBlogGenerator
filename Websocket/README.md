# PulseOps Real-Time SPA Dashboard Demo

This project is a real-time single-page dashboard built with `Next.js`, `React`, `styled-components`, `Socket.IO`, and `Jest`.

It includes:

- A responsive SPA dashboard UI
- Real-time metric updates over websockets
- Styled UI using `styled-components`
- Unit/UI tests with `Jest` and Testing Library
- A custom Node server to run Next.js and Socket.IO together

## Tech Stack

- `Next.js`
- `React`
- `styled-components`
- `Express`
- `Socket.IO`
- `Jest`
- `@testing-library/react`

## Prerequisites

Make sure these are installed on your machine:

- `Node.js` 18 or later
- `npm` 9 or later

To verify:

```powershell
node -v
npm -v
```

## Project Setup

1. Open a terminal.
2. Move into the project folder:

```powershell
cd "C:\Users\Lenovo\Desktop\Agentic AI\Websocket"
```

3. Install dependencies:

```powershell
npm install
```

## Run the App in Development

Start the development server:

```powershell
npm run dev
```

By default, the app tries to run on:

```text
http://localhost:3000
```

If port `3000` is already in use, run it on a different port:

```powershell
$env:PORT=3010
npm run dev
```

Then open:

```text
http://localhost:3010
```

## Run Tests

Run the Jest test suite:

```powershell
npm test
```

Run tests in watch mode:

```powershell
npm run test:watch
```

## Create a Production Build

Build the app:

```powershell
npm run build
```

Start the production server:

```powershell
npm run start
```

## Project Structure

```text
Websocket/
|-- __tests__/
|   |-- DashboardPage.test.js
|   |-- ServiceTable.test.js
|-- pages/
|   |-- _app.js
|   |-- _document.js
|   |-- index.js
|-- src/
|   |-- features/
|   |   |-- dashboard/
|   |   |   |-- components/
|   |   |   |   |-- ActivityChart.js
|   |   |   |   |-- RegionGrid.js
|   |   |   |   |-- ServiceTable.js
|   |   |   |   |-- StatCard.js
|   |   |   |-- DashboardPage.js
|   |   |   |-- useDashboardStream.js
|   |-- styles/
|   |   |-- theme.js
|-- .gitignore
|-- jest.config.js
|-- jest.setup.js
|-- jsconfig.json
|-- next.config.js
|-- package.json
|-- server.js
```

## How Real-Time Updates Work

- `server.js` starts an `Express` server
- `Socket.IO` runs on the same server
- Every connected client receives periodic dashboard snapshots
- The React hook `useDashboardStream` listens for `dashboard:update`
- The UI automatically re-renders when new live data arrives

## Important Commands

```powershell
npm install
npm run dev
npm test
npm run build
npm run start
```

## Notes

- Styling is implemented with `styled-components`
- Testing is set up with `Jest` and `@testing-library/react`
- The dashboard is implemented as a single-page experience
- If `localhost:3000` is busy, use another port with the `PORT` environment variable

## Current Verified Working Option

This app was already verified successfully on:

```text
http://localhost:3010
```

To run on that port in PowerShell:

```powershell
$env:PORT=3010
npm run dev
```
