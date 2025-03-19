"use client";

import { useState } from "react";
import { FaComments } from "react-icons/fa";

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

export default function Chatbot() {
  const [userMessage, setUserMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

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

      setChatHistory((prev) => [...prev, { role: "model", text: aiMessage }]);
    } catch (error) {
      console.error("Error:", error);
      setChatHistory((prev) => [
        ...prev,
        { role: "model", text: "Sorry, something went wrong. Please try again later." },
      ]);
    } finally {
      setLoading(false);
      setUserMessage("");
    }
  };

  return (
    <>
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        aria-label="Open chat"
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-full text-white shadow-xl hover:scale-110 transition-transform duration-300 ease-in-out"
      >
        <FaComments size={24} />
      </button>

      {/* Chat Window */}
      {isChatOpen && (
        <div className="fixed bottom-16 right-6 w-[350px] h-[450px] bg-gradient-to-br from-indigo-600 to-blue-700 rounded-lg shadow-2xl overflow-hidden transform transition-all duration-500 ease-in-out">
          <div className="flex flex-col h-full">
            {/* Chat History */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${
                    msg.role === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-blue-500 to-teal-400 text-white"
                        : "bg-gradient-to-r from-gray-800 to-gray-600 text-white"
                    } p-3 rounded-lg max-w-[80%] inline-block shadow-md transform transition-all duration-300 hover:scale-105`}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Box */}
            <div className="p-4 flex items-center space-x-3 border-t border-gray-600">
              <input
                type="text"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full p-3 rounded-xl border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-800 text-white placeholder-gray-400 text-sm shadow-lg transform transition-all duration-300"
              />
              <button
                onClick={handleSendMessage}
                disabled={loading || !userMessage.trim()}
                className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-teal-400 text-white disabled:bg-gray-500 transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-600 hover:to-teal-500"
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
