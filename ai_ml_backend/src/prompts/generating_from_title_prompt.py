import sys
from helpers.exception import NerException
from helpers.logger import logging

# Prompt for generating an article from a given title
# Static prompt with a placeholder for the title
class GeneratingFromTitlePrompt:
    STATIC_PROMPT = (
        "Generate a detailed and engaging article based on the following title:\n\n"
        "Title: {}\n\n"
        "Please ensure the article is well-structured, informative, and captivating for readers."
    )

    # Static method to get the prompt with the title inserted
    @staticmethod
    def get_prompt(title: str) -> str:
        try:
            return GeneratingFromTitlePrompt.STATIC_PROMPT.format(title)
        except Exception as e:
            logging.error(f"Error in GeneratingFromTitlePrompt.get_prompt: {e}")
            raise NerException(f"Error generating prompt from title: {e}", sys)
