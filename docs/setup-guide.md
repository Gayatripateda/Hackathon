# Setup Guide

## Prerequisites

- Windows PowerShell.
- Node.js and npm installed.
- Python installed. The project owner's environment notes Python 3.12.
- Git, if you are cloning or synchronizing the repository.

The repository does not pin Node.js or Python versions. The frontend has a lockfile; the backend currently has no dependency manifest.

## Start the backend

Open a PowerShell terminal at the repository root:

```powershell
Set-Location .\backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install fastapi uvicorn
python -m uvicorn app.main:app --reload
```

The install command is a manual workaround for the missing backend dependency manifest. It does not pin versions. When the backend dependency file is added, prefer installing from that file instead.

The API is served at `http://127.0.0.1:8000`. Keep this terminal running.

## Start the frontend

Open a second PowerShell terminal at the repository root:

```powershell
Set-Location .\frontend\app
npm ci
npm run dev
```

Open the local address printed by Vite (normally `http://localhost:5173`). Keep this terminal running as well. The frontend's current request URL is hard-coded to `http://127.0.0.1:8000/`.

## Test the API

With the backend running, use another PowerShell terminal:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/
Invoke-RestMethod http://127.0.0.1:8000/health
```

You can also open `http://127.0.0.1:8000/docs` to inspect and manually try the FastAPI routes.

Expected response fields:

- `/`: `message` and `status`.
- `/health`: `status`.

## Check the frontend

On `http://localhost:5173`, the page should show a connected state and the message returned by the root API route when the backend is reachable. If the backend is stopped or unreachable, the page displays a disconnected state.

Frontend checks, from `frontend/app/`:

```powershell
npm run lint
npm run build
```

These commands are configured in the package manifest; they are not substitutes for automated API or browser integration tests, which are not currently present.

## Common setup issues

- **Backend import or server command fails:** ensure the virtual environment is active and FastAPI/Uvicorn installed successfully.
- **Frontend reports disconnected:** confirm both servers are running and the backend is listening on port 8000.
- **Browser reports a CORS error:** the current backend allows only `http://localhost:5173`; use that Vite origin for local development.
- **Frontend install fails:** check the installed Node.js/npm version and use `npm ci` from `frontend/app/`, where the lockfile is located.
