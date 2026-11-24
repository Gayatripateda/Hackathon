from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.ai import router as ai_router

app = FastAPI(
    title="Hackathon Starter Kit",
    description="Reusable backend for hackathon projects",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ai_router)

@app.get("/")
def home():
    return {
        "message": "Hackathon backend is running!",
        "status": "success"
    }

@app.get("/health")
def health():
    return {"status": "healthy"}