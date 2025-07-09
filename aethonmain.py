from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline, AutoTokenizer, AutoModelForCausalLM
import torch
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Load Hugging Face model (use CPU to stay within free tier limits)
model_name = "mistralai/Mistral-7B-Instruct-v0.1"

print("⏳ Loading model, please wait...")
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype=torch.float32,
    device_map="auto" if torch.cuda.is_available() else None
)

generator = pipeline("text-generation", model=model, tokenizer=tokenizer)

@app.route("/api/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        user_input = data.get("message", "")
        history = data.get("conversation_history", [])

        if not user_input:
            return jsonify({"error": "No input provided"}), 400

        # Combine conversation history into a prompt
        history_text = ""
        for msg in history:
            history_text += f"{msg['role'].capitalize()}: {msg['content']}\n"
        history_text += f"User: {user_input}\nAssistant:"

        # Generate response
        output = generator(
            history_text,
            max_new_tokens=512,
            do_sample=True,
            temperature=0.7,
            top_p=0.9,
            pad_token_id=tokenizer.eos_token_id,
        )

        ai_response = output[0]["generated_text"].split("Assistant:")[-1].strip()

        return jsonify({
            "response": ai_response,
            "timestamp": datetime.utcnow().isoformat(),
            "suggestions": [
                "Do you want help reviewing a paper?",
                "Should I help write the abstract?",
                "Need guidance on methodology design?"
            ],
            "action_items": [
                {
                    "task": "Summarize related literature",
                    "priority": "high",
                    "estimated_time": "20 minutes"
                }
            ]
        })

    except Exception as e:
        print("❌ Error:", e)
        return jsonify({"error": "Aethon AI failed to respond."}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
