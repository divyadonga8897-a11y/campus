import urllib.request
import json

url = "http://127.0.0.1:8000/api/chat"
headers = {"Content-Type": "application/json"}
payload = {
    "message": "What are the fees for B.Tech CSE?",
    "history": []
}

print("=== VERIFYING AI CHAT ASSISTANT ENDPOINT ===")
req = urllib.request.Request(
    url, 
    data=json.dumps(payload).encode("utf-8"), 
    headers=headers,
    method="POST"
)

try:
    response = urllib.request.urlopen(req)
    res_data = json.loads(response.read().decode())
    print("[OK] POST /api/chat - SUCCESS")
    print(f"  Response Preview: {res_data['data'][:120]}...")
except Exception as e:
    print(f"[FAIL] POST /api/chat - FAILED: {str(e)}")

print("=== VERIFICATION COMPLETED ===")
