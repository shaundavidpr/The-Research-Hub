import requests

url = "http://127.0.0.1:5000/ask"
question = {"question": "How can AI help in disaster management?"}

response = requests.post(url, json=question)

# Debugging: Print the full response
print("\nFull API response:")
print(response.status_code)
print(response.json())
