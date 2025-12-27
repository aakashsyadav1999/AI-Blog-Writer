from typing import Optional
import sys
from ..executors.executor import ArticleExecutor
from ..models.model import GenerativeModelHandler
from ..helpers.exception import NerException
from ..helpers.logger import logging

ALLOWED_ACTIONS = {
    "generate": "execute_generating_from_title",
    "improve": "execute_improving_readability",
    "summarize": "execute_summarization",
}


def process_title(title: str, action: str, model_handler: Optional[GenerativeModelHandler] = None) -> dict:
    """Process a title using the executor.

    Args:
        title: The input title / text to operate on. Must be non-empty.
        action: One of 'generate', 'improve', 'summarize'.
        model_handler: Optional GenerativeModelHandler instance (injected for tests).

    Returns:
        A dict: {"status": "success", "action": action, "result": "...generated text..."}

    Raises:
        ValueError: for invalid inputs.
        NerException: for underlying generation errors.
    """
    if not title or not isinstance(title, str) or not title.strip():
        raise ValueError("title must be a non-empty string")

    if not action or not isinstance(action, str):
        raise ValueError("action must be a non-empty string")

    action_key = action.lower()
    if action_key not in ALLOWED_ACTIONS:
        raise ValueError(f"action must be one of {list(ALLOWED_ACTIONS.keys())}")

    try:
        # create model handler lazily to avoid heavy imports at module import time
        if model_handler is None:
            model_handler = GenerativeModelHandler()

        executor = ArticleExecutor(model_handler)
        method_name = ALLOWED_ACTIONS[action_key]
        method = getattr(executor, method_name)
        result = method(title)

        return {"status": "success", "action": action_key, "result": result}

    except ValueError:
        # re-raise validation errors unchanged
        raise
    except NerException:
        logging.error("NerException raised during workflow processing")
        # propagate existing NerException
        raise
    except Exception as e:
        logging.error(f"Unexpected error in process_title: {e}")
        # Wrap unknown exceptions in NerException (exception helper expects (message, error_detail_module))
        raise NerException(str(e), sys)
