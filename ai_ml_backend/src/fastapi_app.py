from contextlib import asynccontextmanager
from fastapi import FastAPI
from controllers.controller import router
from helpers.logger import logging


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
    uvicorn.run(app, host="0.0.0.0", port=8000)
