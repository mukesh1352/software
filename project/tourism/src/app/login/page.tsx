"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth, googleProvider } from "../firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import Image from "next/image";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const API_URL = "http://localhost:8000";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Invalid credentials");
      }

      const { token, username: user } = await response.json();
      localStorage.setItem("token", token);
      localStorage.setItem("username", user);

      router.push("/");
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      await fetch(`${API_URL}/google-auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, email: user.email }),
      });

      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred with Google Sign-In.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="w-full max-w-md p-8 bg-white bg-opacity-10 backdrop-blur-md shadow-2xl rounded-2xl relative z-10">
        <h2 className="text-4xl font-extrabold text-center text-white">Login to Your Account</h2>

        {error && <p className="text-red-500 text-center bg-red-100 py-2 rounded-lg">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-lg bg-gray-200 text-gray-800"
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
              className="w-full px-4 py-2 mt-1 border rounded-lg bg-gray-200 text-gray-800"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-white font-semibold bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="flex items-center justify-center mt-4 space-x-4">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="flex items-center justify-center space-x-2 px-4 py-2 border rounded-lg text-white bg-red-500 shadow-md hover:bg-red-600 hover:scale-105 transition"
          >
            <Image src="/google-icon.svg" alt="Google" width={20} height={20} />
            <span>Login with Google</span>
          </button>
        </div>

        <p className="text-sm text-center text-white mt-4">
          Don&apos;t have an account? <Link href="/signup" className="text-blue-300 hover:underline">Sign up here</Link>
        </p>
      </div>
    </div>
  );
}
