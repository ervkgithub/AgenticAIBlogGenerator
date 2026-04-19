# 🔍 AI Output Validation

A local, full-stack AI-powered code analysis tool that evaluates codebases, live websites, and raw code snippets across **10 engineering dimensions** — powered by [Ollama](https://ollama.com/) LLMs running entirely on your machine. No API keys. No cloud. 100% private.

![Tech Stack](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi)
![Tech Stack](https://img.shields.io/badge/Frontend-Next.js%2016-black?style=flat-square&logo=nextdotjs)
![Tech Stack](https://img.shields.io/badge/AI-Ollama%20%2F%20Llama3-6c47ff?style=flat-square)
![Tech Stack](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v3-38bdf8?style=flat-square&logo=tailwindcss)

---

## 📐 Architecture Overview

```
AIOutputValidation/
├── backend/                  # Python FastAPI server
│   ├── main.py               # API entry point (3 routes)
│   ├── requirements.txt      # Python dependencies
│   └── services/
│       ├── ai_analyzer.py    # Ollama LLM integration + prompts
│       ├── file_handler.py   # Multi-file reading + chunking
│       ├── repo_scanner.py   # Git repo cloning + extraction
│       └── url_scanner.py    # Playwright headless URL scanning
│
└── frontend/                 # Next.js 16 + Tailwind CSS frontend
    └── src/
        ├── app/
        │   ├── layout.tsx    # Root layout
        │   ├── page.tsx      # Main dashboard (tabs + Strict Mode)
        │   └── globals.css   # Global styles
        └── components/
            └── ReportViewer.tsx  # Structured JSON report renderer
```

---

## ✨ Features

| Feature | Description |
|---|---|
| 📁 **File Upload** | Drag & drop single or multi-file code analysis |
| 🌐 **Live URL Scan** | Playwright headless browser extracts DOM, meta tags, body for analysis |
| 🐙 **GitHub Repo Scan** | Clones any public repo and reads all source files |
| 🟢 **Normal Mode** | Thorough, balanced senior-level review |
| 🔴 **Strict Mode** | Brutal, zero-tolerance FAANG/Principal Engineer review |
| 📊 **10-Dimension Report** | UI/UX, Accessibility, SEO, Security, Performance, Production, Reliability, Scalability, Reusability, Maintainability |
| 🎯 **Severity Badges** | Critical / High / Medium / Low per issue |
| 💡 **Improvement Plan** | Prioritized, actionable steps to reach Excellent |

---

## 🧱 Prerequisites

Before starting, make sure you have these installed:

| Tool | Version | Download |
|---|---|---|
| Python | 3.10+ | https://python.org |
| Node.js | 18+ | https://nodejs.org |
| Ollama | Latest | https://ollama.com |
| Git | Any | https://git-scm.com |

---

## 🚀 Getting Started

### Step 1 — Clone the Repository

```bash
git clone https://github.com/ervkgithub/AIOutputValidation.git
cd AIOutputValidation
```

---

## 🐍 Backend Setup (FastAPI)

### Step 2 — Navigate to the backend folder

```bash
cd backend
```

### Step 3 — (Recommended) Create a Python virtual environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
```

### Step 4 — Install Python dependencies

```bash
python -m pip install -r requirements.txt
```

### Step 5 — Install Playwright's Chromium browser

```bash
python -m playwright install chromium
```

### Step 6 — Pull an Ollama model

Ollama must be running in the background. Pull **at least one** of these models:

```bash
# Recommended (4.7 GB) — Best quality
ollama pull llama3

# Smaller alternative (397 MB) — Faster but less accurate
ollama pull qwen2.5:0.5b
```

> You can check what's downloaded with: `ollama list`

### Step 7 — Start the FastAPI server

```bash
python main.py
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Application startup complete.
```

✅ **Backend is ready at `http://localhost:8000`**

---

## ⚡ Frontend Setup (Next.js + Tailwind CSS)

> Open a **new terminal window** — keep the backend running.

### Step 8 — Navigate to the frontend folder

```bash
cd frontend
```

### Step 9 — Install Node.js dependencies

```bash
npm install
```

### Step 10 — Start the development server

```bash
npm run dev
```

You should see:
```
▲ Next.js 16.x.x (Turbopack)
- Local:   http://localhost:3000
✓ Ready in X.Xs
```

✅ **Frontend is ready at `http://localhost:3000`**

---

## 🖥️ How to Use

1. **Open your browser** at `http://localhost:3000`
2. **Choose your input method** from the three tabs:
   - `Upload Files` — Click or drag & drop any code file (.js, .ts, .py, .jsx, etc.)
   - `GitHub Repo` — Paste a public GitHub repository URL
   - `Live URL` — Paste any live website URL
3. **(Optional) Enable Strict Mode** — Click the toggle at the top for a brutal FAANG-level review
4. **Click "Analyze Now"** and wait ~1–3 minutes (LLM analysis takes time locally)
5. **Review your report** — Overall grade, per-dimension scores, issues with severity, code fixes, and an improvement plan

---

## 🔁 Running Both Servers Simultaneously

You need **two terminal windows** open at all times:

| Terminal | Command | Port |
|---|---|---|
| Terminal 1 (Backend) | `cd backend && python main.py` | `8000` |
| Terminal 2 (Frontend) | `cd frontend && npm run dev` | `3000` |

---

## 🛠️ Configuration

### Changing the AI Model

In `backend/main.py`, update the model name in the three route handlers:

```python
# Change "llama3" to any model you have pulled via ollama
result = analyze_code_with_ollama(code_input, model="llama3", strict=req.strict)
```

### Available Models (tested)

| Model | Size | Speed | Quality |
|---|---|---|---|
| `llama3` | 4.7 GB | Slow | ⭐⭐⭐⭐⭐ |
| `llava` | 4.7 GB | Slow | ⭐⭐⭐⭐ |
| `qwen2.5:0.5b` | 397 MB | Fast | ⭐⭐ |

---

## 📦 Backend Dependencies

| Package | Purpose |
|---|---|
| `fastapi` | REST API framework |
| `uvicorn` | ASGI server with hot reload |
| `ollama` | Python client for local LLMs |
| `playwright` | Headless browser for URL scanning |
| `gitpython` | Git repository cloning |
| `python-multipart` | File upload parsing |
| `pydantic` | Request/response validation |
| `httpx` | Async HTTP requests |

---

## 📦 Frontend Dependencies

| Package | Purpose |
|---|---|
| `next` | React framework (App Router) |
| `tailwindcss` | Utility-first CSS |
| `lucide-react` | Icon library |
| `axios` | HTTP client for API calls |
| `typescript` | Type safety |

---

## 🔴 Troubleshooting

### `"model 'mistral' not found"`
You don't have that model downloaded. Run `ollama list` to see available models, then update `model="..."` in `backend/main.py`.

### `"Network Error"` in the UI
The FastAPI backend isn't running. Go to your backend terminal and run `python main.py`.

### `"Can't resolve '@/components/ReportViewer'"`
The `components` folder must be inside `frontend/src/`. Run:
```bash
move frontend\components frontend\src\components
```

### `"python pip install"` fails
Use the correct command — `python -m pip install -r requirements.txt` (not `python pip install`).

### Hydration mismatch warning in browser
This is caused by browser extensions injecting attributes into the HTML. It's harmless and suppressed via `suppressHydrationWarning` on the `<html>` tag.

---

## 📊 Analysis Dimensions

| # | Dimension | What is Checked |
|---|---|---|
| 1 | UI/UX | Component structure, interaction patterns |
| 2 | Accessibility | WCAG 2.1 AA — aria labels, alt text, keyboard nav |
| 3 | SEO | Meta tags, heading hierarchy, semantic HTML |
| 4 | Security | XSS, CSRF, secrets exposure, dangerouslySetInnerHTML |
| 5 | Performance | Memoization, code splitting, lazy loading, debounce |
| 6 | Production Readiness | Error boundaries, environment config, logging |
| 7 | Reliability | Error handling, loading states, edge cases |
| 8 | Scalability | Architecture patterns, modularization, coupling |
| 9 | Reusability | Component abstractions, DRY principles |
| 10 | Maintainability | Naming, typing, documentation, clean code |

---

## 📄 License

MIT — Free to use, modify, and distribute.

---

## 🙌 Built With

- [FastAPI](https://fastapi.tiangolo.com/) — Python web framework
- [Next.js](https://nextjs.org/) — React production framework
- [Ollama](https://ollama.com/) — Run LLMs locally
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first styling
- [Playwright](https://playwright.dev/) — Browser automation
- [GitPython](https://gitpython.readthedocs.io/) — Git integration
