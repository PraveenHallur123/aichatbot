const API_KEY = "AIzaSyDhAeCowgJXikjO40LqLNMTiY78fD2fXik"; // ✅ Replace with your actual API key
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

async function sendMessage() {
  const userInput = document.getElementById("user-input");
  const message = userInput.value.trim();

  if (!message) return;

  displayMessage(message, "user");
  userInput.value = "";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.candidates && data.candidates.length > 0) {
      const botMessage = data.candidates[0]?.content?.parts[0]?.text || "Sorry, I couldn't process that. Try again!";
      displayMessage(botMessage, "bot");
    } else {
      displayMessage("Sorry, I couldn't process that. Try again!", "bot");
    }
  } catch (error) {
    console.error("Error:", error.message);
    displayMessage("❌ Error: Unable to reach Gemini API", "bot");
  }
}

function displayMessage(message, sender) {
  const chatBox = document.getElementById("chat-box");
  const messageElement = document.createElement("div");
  messageElement.classList.add(sender === "user" ? "user-message" : "bot-message");
  messageElement.innerText = message;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}

document.getElementById("user-input").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});
