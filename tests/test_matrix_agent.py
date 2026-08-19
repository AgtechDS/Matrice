import requests
import json

with open("prompt2analisi.md", "r", encoding="utf-8") as f:
    system_prompt = f.read()

api_key = "sk-sTqLrDT8CSV0gTODyVFr1HOZbNfYZlWAM7zBbex0th3AxrE4"
model = "deepseek/deepseek-v4-pro-0813-free"
endpoint = "https://api.tokenrouter.com/v1/chat/completions"

messages = [
    {"role": "system", "content": system_prompt},
    {"role": "user", "content": "Ciao, vorrei fare la mia analisi numerologica della matrice del destino."}
]

payload = {
    "model": model,
    "messages": messages,
    "temperature": 0.7
}

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

print("Testing conversation start with prompt2analisi.md...")
resp = requests.post(endpoint, json=payload, headers=headers, timeout=30)
print(f"Status Code: {resp.status_code}")
if resp.status_code == 200:
    data = resp.json()
    msg = data.get("choices", [{}])[0].get("message", {})
    print("\n--- Assistant Response ---")
    print(msg.get("content"))
    if "reasoning_content" in msg and msg["reasoning_content"]:
        print("\n--- Reasoning Preview ---")
        print(msg["reasoning_content"][:200] + "...")
else:
    print("Error:", resp.text)
