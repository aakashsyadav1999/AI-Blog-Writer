import os
from google import genai
from google.genai import types
from typing import Any


class GenerativeModelHandler:
    def __init__(self, model_name: str = "gemini-2.0-flash-lite-001", project: str = "blog-ai-writer-481113", location: str = "us-central1"):
        project = project or os.getenv("GCP_PROJECT") or os.getenv("GOOGLE_CLOUD_PROJECT")
        if not project:
            raise ValueError("GCP project id required (pass project or set GCP_PROJECT/GOOGLE_CLOUD_PROJECT env)")
        self.client = genai.Client(vertexai=True, project=project, location=location)
        self.model_name = model_name

    def generate(self, prompt: str, max_output_tokens: int = 512, temperature: float = 0.2, **kwargs: Any) -> str:
        """
        Generate content for `prompt` and return the text result.
        Additional generate_content kwargs can be passed via `kwargs`.
        """
        generation_config = types.GenerateContentConfig(
            max_output_tokens=max_output_tokens,
            temperature=temperature
        )
        response = self.client.models.generate_content(
            model=self.model_name,
            contents=prompt,
            config=generation_config,
            **kwargs
        )
        # Return the text from the response
        if hasattr(response, "text") and response.text:
            return response.text
        # Fallback to string representation
        return str(response)
