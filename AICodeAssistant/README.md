# TaskMaster Pro

A modern, responsive task management application built with Next.js 14, TypeScript, Tailwind CSS, and Zod validation.

## Features

- ✅ Create, edit, delete, and toggle task completion
- ✅ Priority levels (Low/Medium/High)
- ✅ Due dates
- ✅ Filter by All/Pending/Completed
- ✅ Real-time stats dashboard
- ✅ Responsive design (mobile-first)
- ✅ Form validation
- ✅ Clean, modern UI
- ✅ Persistent in-memory storage (with sample data)

## Quick Start

1. **Clone & Install**

```bash
npx create-next-app@latest my-task-app --typescript --tailwind --eslint --app
cd my-task-app
```

2. **Replace files** with the generated code above

3. **Install dependencies**

```bash
npm install
```

4. **Run the app**

```bash
npm run dev
```

5. **Open** [http://localhost:3000](http://localhost:3000)

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Validation**: Zod
- **Icons**: Lucide React
- **Date handling**: date-fns
- **State**: React hooks + API routes

## Production Deployment

```bash
npm run build
npm start
```

**Deploy anywhere**: Vercel, Netlify, Railway, Fly.io, etc.

## Customization

- Add authentication (NextAuth.js)
- Replace in-memory storage with PostgreSQL/Supabase
- Add drag & drop reordering
- Implement categories/labels
- Add user accounts & sharing
