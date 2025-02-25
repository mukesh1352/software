"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, googleProvider } from "../firebaseConfig"; // Adjust path if needed
import { signInWithPopup } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";

export default function Signup() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Both fields are required.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Signup failed");

      setUsername("");
      setPassword("");
      router.push("/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In
  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      await fetch("http://localhost:8000/google-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, email: user.email }),
      });

      router.push("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600"
      style={{ backgroundImage: 'url(/4873.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="w-full max-w-md p-8 space-y-6 bg-white bg-opacity-10 backdrop-blur-md shadow-2xl rounded-2xl relative z-10">
        <h2 className="text-4xl font-extrabold text-center text-white">Create an Account</h2>

        {error && <p className="text-sm text-red-500 text-center bg-red-100 py-2 rounded-lg">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white">Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none bg-gray-200 text-gray-800"
              placeholder="Enter your username" 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none bg-gray-200 text-gray-800"
              placeholder="Enter your password" 
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full px-4 py-2 text-white font-semibold bg-blue-600 rounded-lg transition duration-300 ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700 hover:scale-105"
            }`}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <div className="flex items-center justify-center mt-4 space-x-4">
          <button 
            onClick={handleGoogleSignIn} 
            disabled={loading}
            className="flex items-center justify-center space-x-2 px-4 py-2 border rounded-lg text-white bg-red-500 shadow-md hover:bg-red-600 hover:scale-105 transition"
          >
            <Image src="/google-icon.svg" alt="Google" width={20} height={20} />
            <span>Sign up with Google</span>
          </button>
        </div>

        <p className="text-sm text-center text-white mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-300 hover:underline">Login here</Link>
        </p>

        <p className="text-sm text-center text-white mt-4">
          <Link href="/password" className="text-blue-300 hover:underline">Forgot Password?</Link>
        </p>
      </div>
    </div>
  );
}
