from typing import Optional
from ..models.model import GenerativeModelHandler
from ..workflows.workflow import process_title
from ..helpers.logger import logging


class ArticleService:
    """Service layer for article operations."""

    def __init__(self, model_handler: Optional[GenerativeModelHandler] = None):
        self.model_handler = model_handler or GenerativeModelHandler()

    def generate_article(self, title: str) -> dict:
        """Generate article from title."""
        logging.info(f"Generating article for title: {title}")
        return process_title(title, "generate", self.model_handler)

    def improve_readability(self, text: str) -> dict:
        """Improve text readability."""
        logging.info(f"Improving readability for text: {text[:50]}...")
        return process_title(text, "improve", self.model_handler)

    def summarize_text(self, text: str) -> dict:
        """Summarize text."""
        logging.info(f"Summarizing text: {text[:50]}...")
        return process_title(text, "summarize", self.model_handler)

    def process_batch(self, items: list[dict]) -> list[dict]:
        """Process multiple items in batch."""
        results = []
        for item in items:
            try:
                result = process_title(
                    item.get("text", ""),
                    item.get("action", "generate"),
                    self.model_handler
                )
                results.append(result)
            except Exception as e:
                logging.error(f"Batch processing error: {e}")
                results.append({"status": "error", "message": str(e)})
        return results
