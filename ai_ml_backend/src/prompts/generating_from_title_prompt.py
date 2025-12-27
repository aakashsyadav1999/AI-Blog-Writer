import sys
from ..helpers.exception import NerException
from ..helpers.logger import logging

# Prompt for generating an article from a given title
# Static prompt with a placeholder for the title
class GeneratingFromTitlePrompt:
    STATIC_PROMPT = (
        "You are an expert technical writer and educator. Generate a comprehensive, detailed, and engaging blog article based on the following title:\n\n"
        "Title: {}\n\n"
        "Requirements:\n"
        "1. Start with a clear introduction that hooks the reader and explains what they'll learn\n"
        "2. Break down complex concepts into easy-to-understand sections with clear headings\n"
        "3. Include practical examples, use cases, and real-world applications where relevant\n"
        "4. For technical topics: explain fundamentals, architecture, working principles, advantages, and limitations\n"
        "5. Use analogies and comparisons to make difficult concepts accessible\n"
        "6. Include code examples, diagrams descriptions, or step-by-step explanations when appropriate\n"
        "7. End with a conclusion that summarizes key takeaways and suggests next steps\n"
        "8. Make it informative, accurate, and engaging for readers who want to truly understand the topic\n\n"
        "Write a detailed article (at least 1500-2000 words) that thoroughly covers this topic."
    )

    # Static method to get the prompt with the title inserted
    @staticmethod
    def get_prompt(title: str) -> str:
        try:
            return GeneratingFromTitlePrompt.STATIC_PROMPT.format(title)
        except Exception as e:
            logging.error(f"Error in GeneratingFromTitlePrompt.get_prompt: {e}")
            raise NerException(f"Error generating prompt from title: {e}", sys)
