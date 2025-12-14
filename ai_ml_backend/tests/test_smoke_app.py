import sys
import os
# add workspace root so `ai_ml_backend` package can be imported
workspace_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if workspace_root not in sys.path:
    sys.path.insert(0, workspace_root)

from fastapi.testclient import TestClient
from ai_ml_backend.src.fastapi_app import app

client = TestClient(app)


def test_healthcheck():
    resp = client.get("/")
    assert resp.status_code == 200
    assert resp.json() == {"status": "ok"}


def test_create_article_validation():
    # missing title
    resp = client.post("/articles", json={"title": "", "action": "generate"})
    assert resp.status_code == 400


# Note: full generation will attempt to initialize GenerativeModelHandler which uses Vertex AI.
# We avoid calling the actual model in this smoke test.
