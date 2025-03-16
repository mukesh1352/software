"use client";

import { useState } from "react";
import { FaComments } from "react-icons/fa"; // Importing chat bubble icon

// Define the interface for chat messages
interface ChatMessage {
  role: "user" | "model"; // User and model (AI) roles
  text: string;
}

export default function Chatbot() {
  // State hooks for user message, chat history, loading status, and chat window open state
  const [userMessage, setUserMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  // Handle sending the user message and receiving the AI's response
  const handleSendMessage = async () => {
    if (!userMessage.trim()) return; // Don't send empty messages

    // Add user's message to the chat history
    setChatHistory((prev) => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userMessage }),
      });

      const data = await response.json();
      const aiMessage = data.message;

      // Add AI's response to chat history
      setChatHistory((prev) => [...prev, { role: "model", text: aiMessage }]);
    } catch (error) {
      console.error("Error:", error);
      // In case of an error, show an error message from the model
      setChatHistory((prev) => [
        ...prev,
        { role: "model", text: "Sorry, something went wrong. Please try again later." },
      ]);
    } finally {
      setLoading(false);
      setUserMessage(""); // Clear the input field after sending
    }
  };

  return (
    <>
      {/* Chat Icon: Button to open and close chat window */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 bg-blue-500 p-4 rounded-full text-white shadow-lg hover:bg-blue-400 transition-colors duration-300"
      >
        <FaComments size={24} />
      </button>

      {/* Chat Window */}
      {isChatOpen && (
        <div className="fixed bottom-16 right-6 w-[350px] h-[450px] bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <div className="flex flex-col h-full">
            {/* Chat History */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${msg.role === "user" ? "text-right" : "text-left"}`}
                >
                  <div
                    className={`${
                      msg.role === "user"
                        ? "bg-blue-100 text-right"
                        : "bg-gray-100 text-left"
                    } p-3 rounded-lg max-w-[80%] inline-block`}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Box */}
            <div className="p-4 flex items-center space-x-2 border-t border-gray-200">
              <input
                type="text"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={loading}
                className="p-3 rounded-md bg-blue-500 text-white disabled:bg-blue-300 transition-all duration-300 hover:bg-blue-400"
              >
                {loading ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
