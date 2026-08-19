import requests
import json

api_key = "sk-sTqLrDT8CSV0gTODyVFr1HOZbNfYZlWAM7zBbex0th3AxrE4"
model = "deepseek/deepseek-v4-pro-0813-free"

endpoints = [
    "https://api.tokenrouter.com/v1/chat/completions",
    "https://api.tokenrouter.ai/v1/chat/completions",
    "https://www.tokenrouter.com/api/v1/chat/completions",
    "https://www.tokenrouter.com/v1/chat/completions",
    "https://tokenrouter.com/api/v1/chat/completions",
    "https://api.tokenrouter.com/chat/completions",
    "https://router.tokenrouter.com/v1/chat/completions"
]

payload = {
    "model": model,
    "messages": [
        {"role": "system", "content": "Sei un assistente per la Matrice del Destino."},
        {"role": "user", "content": "Ciao, rispondi con un messaggio di test breve: Connessione riuscita."}
    ],
    "temperature": 0.7,
    "max_tokens": 150
}

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

for ep in endpoints:
    print(f"\n--- Testing endpoint: {ep} ---")
    try:
        resp = requests.post(ep, json=payload, headers=headers, timeout=15)
        print(f"Status Code: {resp.status_code}")
        print(f"Response Headers Content-Type: {resp.headers.get('Content-Type')}")
        print(f"Response Preview: {resp.text[:500]}")
        if resp.status_code == 200:
            print(f">>> SUCCESS ON ENDPOINT: {ep} <<<")
            data = resp.json()
            print("Content:", data.get("choices", [{}])[0].get("message", {}).get("content"))
            break
    except Exception as e:
        print(f"Error: {e}")
