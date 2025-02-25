"use client"; // Ensure this is at the top

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPassword() { // ✅ Default Export
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password: newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/login"); // Redirect on success
      } else {
        setMessage(data.detail || "Error resetting password.");
      }
    } catch {
      setMessage("Network error");
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url("1.png")' }}>
      <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-50">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm">
          <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Forgot Password</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-500 text-white p-3 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Reset Password
            </button>
          </form>
          {message && <p className="mt-4 text-center text-sm text-red-600">{message}</p>}
        </div>
      </div>
    </div>
  );
}
