# Technical Stack

## Current technologies

| Technology | Where it is used | Why it is present |
|---|---|---|
| JavaScript | `frontend/app/src/` | Implements the browser UI and its HTTP request. |
| React | `frontend/app/` | Builds the page from reusable UI components; the current app has one `App` component. |
| Vite | `frontend/app/` | Runs the frontend development server and builds frontend assets. |
| npm | `frontend/app/package.json` and `package-lock.json` | Installs frontend dependencies and runs project scripts. |
| Python | `backend/app/` | Implements the API server. |
| FastAPI | `backend/app/main.py` | Defines the REST-style HTTP routes and API metadata. |
| CORSMiddleware | `backend/app/main.py` | Allows the local browser frontend to make cross-origin requests to the API. |

The project owner's environment notes Python 3.12 and Node.js/npm as installed. The repository itself does not pin those runtime versions.

## Frontend dependencies and scripts

The active frontend manifest is `frontend/app/package.json`. It declares React and React DOM as runtime dependencies, and Vite, the React Vite plugin, and ESLint-related packages as development dependencies.

Available scripts:

- `npm run dev` — starts the Vite development server.
- `npm run build` — builds the frontend for production.
- `npm run preview` — previews a built frontend locally.
- `npm run lint` — runs ESLint.

## Backend dependency gap

`backend/app/main.py` imports `fastapi`. To serve the app with the command in the setup guide, `uvicorn` is also needed. No `requirements.txt`, `pyproject.toml`, or other backend dependency declaration is present in the inspected repository. As a result, backend installation is currently manual and does not provide a reproducible, pinned dependency set.

## Communication

React uses the browser's built-in `fetch` API to request the backend's root URL. The request returns JSON, which the page displays. The backend enables CORS for `http://localhost:5173`, the usual Vite development origin. The frontend currently hard-codes `http://127.0.0.1:8000/`.

## Planned technologies are not current integrations

The root README mentions PyMuPDF and an LLM API as technology choices. No corresponding integration, dependency, API key configuration, or document-processing code was found in the current implementation. Database, authentication, and deployment technologies have not been selected.

Choose future dependencies only when a feature requires them. For any external API, keep credentials on the backend, outside source control, and document the required environment variables without publishing their values.
