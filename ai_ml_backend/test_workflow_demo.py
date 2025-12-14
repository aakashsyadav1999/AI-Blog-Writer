#!/usr/bin/env python3
"""Demo script to test the workflow without requiring GCP credentials."""

import sys
import os

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from workflows.workflow import process_title

# Mock model handler for testing without GCP
class MockGenerativeModelHandler:
    def generate(self, prompt: str, **kwargs):
        """Mock generate method that returns a sample article."""
        return f"""# Sample Generated Article

This is a mock article generated based on the prompt:
"{prompt[:100]}..."

## Introduction
This article demonstrates the workflow system working correctly.

## Main Content
The workflow successfully:
1. Validated the input title
2. Selected the correct executor method
3. Generated the prompt
4. Called the model handler (mocked)
5. Returned structured response

## Conclusion
The workflow is functioning as expected!
"""

# Test the workflow with different actions
print("=" * 80)
print("WORKFLOW DEMO - Testing all three actions")
print("=" * 80)

mock_handler = MockGenerativeModelHandler()

# Test 1: Generate action
print("\n1. Testing 'generate' action:")
print("-" * 80)
result = process_title(
    title="Python testing best practices",
    action="generate",
    model_handler=mock_handler
)
print(f"Status: {result['status']}")
print(f"Action: {result['action']}")
print(f"Result:\n{result['result']}")

# Test 2: Improve action
print("\n" + "=" * 80)
print("2. Testing 'improve' action:")
print("-" * 80)
result = process_title(
    title="Make this article better",
    action="improve",
    model_handler=mock_handler
)
print(f"Status: {result['status']}")
print(f"Action: {result['action']}")
print(f"Result:\n{result['result']}")

# Test 3: Summarize action
print("\n" + "=" * 80)
print("3. Testing 'summarize' action:")
print("-" * 80)
result = process_title(
    title="Long article to summarize",
    action="summarize",
    model_handler=mock_handler
)
print(f"Status: {result['status']}")
print(f"Action: {result['action']}")
print(f"Result:\n{result['result']}")

print("\n" + "=" * 80)
print("All workflow tests completed successfully!")
print("=" * 80)

