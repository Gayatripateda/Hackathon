# Hackathon Starter Kit

A minimal React + Vite frontend connected to a Python + FastAPI backend. It includes a Gemini AI chat demo; document processing, databases, authentication, and deployment are not implemented.

## Run locally

Start the backend in PowerShell:

```powershell
Set-Location .\backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
notepad .env
python -m uvicorn app.main:app --reload
```

Add your Gemini API key to the local `backend\.env` file. Never put it in React code or commit the `.env` file; the root `.gitignore` excludes it. The [Gemini free-tier data policy](https://ai.google.dev/gemini-api/terms) may allow prompts to be used to improve Google's services, so do not send sensitive information. Check Google's current [age and usage terms](https://ai.google.dev/gemini-api/terms) before creating or using an account.

In a second terminal, start the frontend:

```powershell
Set-Location .\frontend
npm.cmd ci
npm.cmd run dev
```

Open the address printed by Vite (usually `http://localhost:5173`). FastAPI's interactive API page is at `http://127.0.0.1:8000/docs`.


## Project guide

See [docs/PROJECT_GUIDE.md](docs/PROJECT_GUIDE.md) for the architecture, setup, current scope, security notes, roadmap, and team workflow.
