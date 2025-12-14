import os

list_of_files = [

    "src/",
    "src/__init__.py",
    "src/models/",
    "src/models/__init__.py",
    "src/models/model.py",
    "src/controllers/",
    "src/controllers/__init__.py",
    "src/controllers/controller.py",
    "src/services/",
    "src/services/__init__.py",
    "src/services/service.py",
    "src/utils/",
    "src/utils/__init__.py",
    "src/utils/helpers.py",
    "src/prompts/",
    "src/prompts/__init__.py",
    "src/prompts/generating_from_title_prompt.py",
    "src/prompts/improving_readability_prompt.py",
    "src/prompts/summarization_prompt.py",
    "src/node/",
    "src/node/__init__.py",
    "src/executors/",
    "src/executors/__init__.py",
    "src/executors/executor.py",
    "src/workflows/",
    "src/workflows/__init__.py",
    "src/workflows/workflow.py",
    "src/fastapi_app.py",
    "Dockerfile",
    "requirements.txt"


]

# Function to create the directory and file structure
def create_template_structure(base_path="."):
    for file_path in list_of_files:
        full_path = os.path.join(base_path, file_path)
        dir_name = os.path.dirname(full_path)
        if not os.path.exists(dir_name):
            os.makedirs(dir_name)
        if not os.path.exists(full_path):
            with open(full_path, 'w') as f:
                pass

    print(f"Template structure created at {os.path.abspath(base_path)}")
if __name__ == "__main__":
    create_template_structure()