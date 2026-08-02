import sys
import os

# Ensure backend root and workspace root are in sys.path
root_path = os.path.abspath(os.path.dirname(__file__))
sys.path.insert(0, root_path)
sys.path.insert(0, os.path.join(root_path, "backend"))

import uvicorn

# Use absolute import from workspace root to satisfy the IDE's static analyzer
from backend.app.main import app

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
