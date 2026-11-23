# System Architecture

## Current architecture

The application has two running parts during local development:

1. A Vite development server serves the React application from `frontend/app/`.
2. A FastAPI server provides HTTP API routes from `backend/app/main.py`.

The browser runs the React code. On page load, React sends a request to the backend's root route. The backend returns JSON; React uses the response to update the page.

```mermaid
flowchart LR
    U[User's browser] -->|loads page| V[Vite dev server :5173]
    V --> R[React app]
    R -->|GET http://127.0.0.1:8000/| API[FastAPI :8000]
    API -->|JSON message and status| R
    R -->|renders connection state| U
    U -. optional API check .->|GET /health| API
```

The health endpoint is available for a direct check; the current React page does not call it.

## Request and response

`frontend/app/src/App.jsx` runs a `fetch` request to `http://127.0.0.1:8000/` when the component mounts. It checks the HTTP response, reads JSON, and displays `data.message`. If the request fails, it displays a generic disconnected message.

The root endpoint returns an object shaped like:

```json
{
  "message": "Hackathon backend is running!",
  "status": "success"
}
```

The `/health` endpoint returns:

```json
{
  "status": "healthy"
}
```

FastAPI also provides interactive API documentation at `/docs` when the backend is running locally.

## Current directory map

```text
Hackathon/
├── README.md                         Existing root project description
├── assets/                           Empty in the inspected workspace
├── backend/
│   └── app/
│       ├── main.py                   FastAPI app, CORS, and two routes
│       ├── api/                      Empty placeholder for future API modules
│       └── services/                 Empty placeholder for future services
├── docs/
│   ├── architecture/                 Architecture and stack documentation
│   └── presentations/                Empty in the inspected workspace
├── frontend/
│   ├── app/                          Active React + Vite application
│   │   ├── package.json              Dependencies and npm scripts
│   │   ├── package-lock.json         Locked frontend dependency tree
│   │   ├── vite.config.js             Vite configuration
│   │   ├── eslint.config.js           ESLint configuration
│   │   ├── index.html                 Browser entry HTML
│   │   ├── public/                    Public SVG icons
│   │   └── src/
│   │       ├── main.jsx               React entry point
│   │       ├── App.jsx                Backend connection demo
│   │       ├── App.css                Component styling
│   │       ├── index.css              Global styling
│   │       └── assets/                Starter-template image and SVGs
│   └── src/
│       ├── components/                Empty placeholder
│       └── pages/                     Empty placeholder
└── templates/                         Empty in the inspected workspace
```

The `frontend/app/` directory is the active app because it contains `package.json`, the Vite configuration, and the React entry point. The separate `frontend/src/components/` and `frontend/src/pages/` folders make the intended frontend layout unclear. Before adding components, choose one structure and move or remove placeholders deliberately; do not assume Vite currently uses `frontend/src/`.

Empty folders may not be retained when Git clones the repository, because Git tracks files rather than empty directories.

## Boundaries and future structure

The current backend routes and frontend are in small, single-purpose files. The `api/` and `services/` directories are empty; no route/service separation is implemented yet. Future modules can be added there when actual features justify them. Avoid adding layers solely for the sake of a larger-looking architecture.
