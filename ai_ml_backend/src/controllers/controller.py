from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from typing import Optional
from ..services.service import ArticleService
from ..helpers.exception import NerException
from ..helpers.logger import logging

router = APIRouter(prefix="/api/v1", tags=["articles"])
service = ArticleService()


class ArticleRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=5000)
    action: str = Field(..., pattern="^(generate|improve|summarize)$")


class BatchRequest(BaseModel):
    items: list[dict] = Field(..., min_items=1, max_items=10)


class ArticleResponse(BaseModel):
    status: str
    action: str
    result: str


@router.post("/generate", response_model=ArticleResponse, status_code=status.HTTP_200_OK)
async def generate_article(request: ArticleRequest):
    """Generate article from title."""
    try:
        result = service.generate_article(request.title)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except NerException as e:
        logging.error(f"Generation error: {e}")
        raise HTTPException(status_code=500, detail="Article generation failed")


@router.post("/improve", response_model=ArticleResponse)
async def improve_text(request: ArticleRequest):
    """Improve text readability."""
    try:
        result = service.improve_readability(request.title)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except NerException as e:
        raise HTTPException(status_code=500, detail="Text improvement failed")


@router.post("/summarize", response_model=ArticleResponse)
async def summarize_text(request: ArticleRequest):
    """Summarize text."""
    try:
        result = service.summarize_text(request.title)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except NerException as e:
        raise HTTPException(status_code=500, detail="Summarization failed")


@router.post("/batch")
async def process_batch(request: BatchRequest):
    """Process multiple items in batch."""
    results = service.process_batch(request.items)
    return {"status": "completed", "results": results}


@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "article-service"}
