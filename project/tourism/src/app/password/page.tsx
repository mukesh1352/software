"use client"; // Ensure this is at the top

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";

export default function Emailsend() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("✅ Password reset email sent! Check your inbox.");
    } catch (error: any) {
      setMessage(` ${error.message || "Error sending password reset email."}`);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url("1.png")' }}>
      <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-50">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm">
          <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Forgot Password</h2>
          <form onSubmit={handlePasswordReset}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-500 text-white p-3 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Send Reset Email
            </button>
          </form>
          {message && <p className="mt-4 text-center text-sm text-red-600">{message}</p>}
        </div>
      </div>
    </div>
  );
}