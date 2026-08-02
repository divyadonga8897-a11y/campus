import sys
import os

# Ensure backend root and workspace root are in sys.path
root_path = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, root_path)
sys.path.insert(0, os.path.join(root_path, "backend"))

# Use absolute import from workspace root to satisfy the IDE's static analyzer
from backend.app.main import app
