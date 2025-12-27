from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .controllers.controller import router
from .helpers.logger import logging


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown events."""
    logging.info("Starting AI Blog Writer Backend...")
    yield
    logging.info("Shutting down AI Blog Writer Backend...")


app = FastAPI(
    title="AI Blog Writer Backend",
    version="1.0.0",
    description="AI-powered article generation and text processing API",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8000",  # Django backend
        "http://127.0.0.1:8000",
        "http://localhost:5173",  # Frontend (Vite)
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register the controller router
app.include_router(router)


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "AI Blog Writer API",
        "status": "running",
        "version": "1.0.0"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
