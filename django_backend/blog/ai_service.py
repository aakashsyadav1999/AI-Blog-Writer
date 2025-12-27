"""
AI Service integration for connecting Django backend with FastAPI AI/ML backend
"""
import httpx
from django.conf import settings
from typing import Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)

# AI/ML Backend URL - can be configured in settings
AI_BACKEND_URL = getattr(settings, 'AI_BACKEND_URL', 'http://localhost:8001')


class AIServiceClient:
    """Client for communicating with the AI/ML backend service"""

    def __init__(self, base_url: str = AI_BACKEND_URL):
        self.base_url = base_url.rstrip('/')
        self.timeout = 120.0  # 2 minutes timeout for AI operations

    async def generate_article(self, title: str) -> Dict[str, Any]:
        """
        Generate article content from a title

        Args:
            title: The article title

        Returns:
            Dict containing status, action, and result
        """
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    f"{self.base_url}/api/v1/generate",
                    json={"title": title, "action": "generate"}
                )
                response.raise_for_status()
                return response.json()
        except httpx.HTTPError as e:
            logger.error(f"Error generating article: {e}")
            raise Exception(f"Failed to generate article: {str(e)}")

    async def improve_text(self, text: str) -> Dict[str, Any]:
        """
        Improve text readability

        Args:
            text: The text to improve

        Returns:
            Dict containing status, action, and result
        """
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    f"{self.base_url}/api/v1/improve",
                    json={"title": text, "action": "improve"}
                )
                response.raise_for_status()
                return response.json()
        except httpx.HTTPError as e:
            logger.error(f"Error improving text: {e}")
            raise Exception(f"Failed to improve text: {str(e)}")

    async def summarize_text(self, text: str) -> Dict[str, Any]:
        """
        Summarize text

        Args:
            text: The text to summarize

        Returns:
            Dict containing status, action, and result
        """
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    f"{self.base_url}/api/v1/summarize",
                    json={"title": text, "action": "summarize"}
                )
                response.raise_for_status()
                return response.json()
        except httpx.HTTPError as e:
            logger.error(f"Error summarizing text: {e}")
            raise Exception(f"Failed to summarize text: {str(e)}")

    async def process_batch(self, items: list) -> Dict[str, Any]:
        """
        Process multiple items in batch

        Args:
            items: List of items to process

        Returns:
            Dict containing status and results
        """
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    f"{self.base_url}/api/v1/batch",
                    json={"items": items}
                )
                response.raise_for_status()
                return response.json()
        except httpx.HTTPError as e:
            logger.error(f"Error processing batch: {e}")
            raise Exception(f"Failed to process batch: {str(e)}")

    async def health_check(self) -> Dict[str, Any]:
        """
        Check if AI service is healthy

        Returns:
            Dict containing health status
        """
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(f"{self.base_url}/api/v1/health")
                response.raise_for_status()
                return response.json()
        except httpx.HTTPError as e:
            logger.error(f"AI service health check failed: {e}")
            return {"status": "unhealthy", "error": str(e)}


# Global instance
ai_service_client = AIServiceClient()

