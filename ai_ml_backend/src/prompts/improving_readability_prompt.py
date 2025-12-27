import sys
from ..helpers.exception import NerException
from ..helpers.logger import logging


# Prompt for generating an article from a given title
# Static prompt with a placeholder for the title
class ImprovingReadabilityPrompt:
    STATIC_PROMPT = (
        "Improve the readability of the following article while maintaining its original meaning and key points:\n\n"
        "Article: {}\n\n"
        "Please ensure the revised article is clear, concise, and engaging for readers."
    )

    # Static method to get the prompt with the title inserted
    @staticmethod
    def get_prompt(blog: str) -> str:
        try:
            return ImprovingReadabilityPrompt.STATIC_PROMPT.format(blog)
        except Exception as e:
            logging.error(f"Error in Improving Readability: {e}")
            raise NerException(f"Error generating Readability: {e}", sys)
