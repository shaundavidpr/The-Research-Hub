from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os
import requests

load_dotenv()
HF_API_KEY = os.getenv("HF_API_KEY")

app = Flask(__name__)

@app.route("/ask", methods=["POST"])
def ask():
    data = request.get_json()
    question = data.get("question")

    if not question:
        return jsonify({"error": "Please provide a question."}), 400

    headers = {
        "Authorization": f"Bearer {HF_API_KEY}"
    }

    payload = {
        "inputs": f"question: {question} answer:",
        "parameters": {
            "max_new_tokens": 200,
            "temperature": 0.7
        }
    }

    try:
        response = requests.post(
            "https://api-inference.huggingface.co/models/google/flan-t5-large",
            headers=headers,
            json=payload
        )

        if response.status_code != 200:
            return jsonify({"error": f"Error from Hugging Face: {response.text}"}), 500

        output = response.json()
        print("Raw model output:", output)

        if isinstance(output, list) and "generated_text" in output[0]:
            answer = output[0]["generated_text"].split("answer:")[-1].strip()
        else:
            answer = "Model did not return expected format."

        return jsonify({"response": answer})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
