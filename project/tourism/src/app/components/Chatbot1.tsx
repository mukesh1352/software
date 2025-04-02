"use client";
import { useState, useRef, useEffect } from "react";

const Chatbot1 = () => {
  const [query, setQuery] = useState("");
  const [conversation, setConversation] = useState<{ text: string; sender: string; timestamp?: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Initialize session on component mount
  useEffect(() => {
    const storedSessionId = localStorage.getItem("chatbot_session_id");
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      const newSessionId = Math.random().toString(36).substring(2, 15);
      localStorage.setItem("chatbot_session_id", newSessionId);
      setSessionId(newSessionId);
    }
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const handleSendMessage = async () => {
    if (!query.trim()) return;

    const userMessage = { text: query, sender: "user", timestamp: new Date().toLocaleTimeString() };
    setConversation(prev => [...prev, userMessage]);
    setQuery("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          query, 
          session_id: sessionId 
        }),
      });

      const data = await res.json();
      const botMessage = { 
        text: data.response, 
        sender: "bot",
        timestamp: new Date().toLocaleTimeString()
      };
      setConversation(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      const errorMessage = { 
        text: "Sorry, I'm having trouble responding. Please try again later.", 
        sender: "bot",
        timestamp: new Date().toLocaleTimeString()
      };
      setConversation(prev => [...prev, errorMessage]);
    }
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearConversation = () => {
    setConversation([]);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 dark:bg-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-full bg-white/20 backdrop-blur-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Tourism Assistant</h2>
            <p className="text-xs opacity-90">Ask me about travel in India</p>
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="h-80 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-700">
        {conversation.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-300">
            <div className="relative mb-4">
              <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-indigo-500 dark:text-indigo-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-indigo-500 border-2 border-white dark:border-gray-700 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <p className="text-center mb-6">How can I help with your travel plans today?</p>
            <div className="grid gap-2 w-full">
              <button 
                onClick={() => setQuery("Best places to visit in Goa")}
                className="text-sm px-3 py-2 bg-white dark:bg-gray-600 rounded-lg shadow-sm hover:shadow transition-shadow text-left text-blue-600 dark:text-blue-400"
              >
                &quot;Best places to visit in Goa&quot;
              </button>
              <button 
                onClick={() => setQuery("What's the weather in Kerala?")}
                className="text-sm px-3 py-2 bg-white dark:bg-gray-600 rounded-lg shadow-sm hover:shadow transition-shadow text-left text-blue-600 dark:text-blue-400"
              >
                &quot;What&apos;s the weather in Kerala?&quot;
              </button>
              <button 
                onClick={() => setQuery("How to book a hotel?")}
                className="text-sm px-3 py-2 bg-white dark:bg-gray-600 rounded-lg shadow-sm hover:shadow transition-shadow text-left text-blue-600 dark:text-blue-400"
              >
                &quot;How to book a hotel?&quot;
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {conversation.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-br-none"
                      : "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-bl-none"
                  } shadow-sm`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                  <div className={`text-xs mt-1 text-right ${
                    msg.sender === "user" ? "text-blue-100" : "text-gray-500 dark:text-gray-300"
                  }`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
        <div className="flex items-end space-x-2">
          <textarea
            className="flex-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 resize-none transition-all"
            rows={1}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={loading}
            style={{ minHeight: '44px', maxHeight: '120px' }}
          />
          <button
            className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 transition-colors shadow-sm flex-shrink-0"
            onClick={handleSendMessage}
            disabled={loading || !query.trim()}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>
        <div className="flex justify-between mt-3 text-xs text-gray-500 dark:text-gray-400">
          <button
            onClick={handleClearConversation}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center transition-colors"
            disabled={conversation.length === 0}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Clear chat
          </button>
          <div className={`transition-opacity ${conversation.length > 0 ? 'opacity-100' : 'opacity-0'}`}>
            {conversation.length > 0 && `${conversation.length} message${conversation.length !== 1 ? 's' : ''}`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot1;