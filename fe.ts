const message = "Aethon"; // Define your message here

(async () => {
  await fetch("https://your-huggingface-backend.onrender.com/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, conversation_history: [] }),
  });
})();

export {};
