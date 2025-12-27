import sys
from ..helpers.exception import NerException
from ..helpers.logger import logging
from ..models.model import GenerativeModelHandler
from ..prompts.generating_from_title_prompt import GeneratingFromTitlePrompt
from ..prompts.improving_readability_prompt import ImprovingReadabilityPrompt
from ..prompts.summarization_prompt import SummarizationPrompt

# Executor for generating articles from titles
class ArticleExecutor:
    def __init__(self, model_handler: GenerativeModelHandler):
        self.model_handler = model_handler

    def execute_generating_from_title(self, title: str) -> str:
        try:
            prompt = GeneratingFromTitlePrompt.get_prompt(title)
            article = self.model_handler.generate(prompt)
            return article
        except Exception as e:
            logging.error(f"Error in execute_generating_from_title.execute: {e}")
            raise NerException(f"Error generating article from title: {e}", sys)

    def execute_improving_readability(self, title: str) -> str:
        try:
            prompt = ImprovingReadabilityPrompt.get_prompt(title)
            article = self.model_handler.generate(prompt)
            return article
        except Exception as e:
            logging.error(f"Error in ImprovingReadabilityPrompt.execute: {e}")
            raise NerException(f"Error generating ImprovingReadabilityPrompt: {e}", sys)

    def execute_summarization(self, title: str) -> str:
        try:
            prompt = SummarizationPrompt.get_prompt(title)
            article = self.model_handler.generate(prompt)
            return article
        except Exception as e:
            logging.error(f"Error in SummarizationPrompt.execute: {e}")
            raise NerException(f"Error generating SummarizationPrompt: {e}", sys)
