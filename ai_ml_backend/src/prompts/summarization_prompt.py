import sys
from ..helpers.exception import NerException
from ..helpers.logger import logging


# Prompt for generating an article from a given title
# Static prompt with a placeholder for the title
class SummarizationPrompt:
    STATIC_PROMPT = (
        "Summarize the following article into a concise and informative summary:\n\n"
        "Article: {}\n\n"
        "Please ensure the summary captures the main points and essence of the article."
    )

    # Static method to get the prompt with the title inserted
    @staticmethod
    def get_prompt(full_blog: str) -> str:
        try:
            return SummarizationPrompt.STATIC_PROMPT.format(full_blog)
        except Exception as e:
            logging.error(f"Error in summarization: {e}")
            raise NerException(f"Error generating summary: {e}", sys)
