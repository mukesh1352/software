"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaSignInAlt } from "react-icons/fa";
import Link from "next/link";

export default function Header() {
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUsername = () => {
      setUsername(localStorage.getItem("username"));
    };

    checkUsername();

    // Listen for storage changes (logout/login from another tab)
    window.addEventListener("storage", checkUsername);
    return () => window.removeEventListener("storage", checkUsername);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername(null);
    router.push("/");
  };

  return (
    <header className="w-full absolute top-0 left-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6 lg:px-12">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow-lg">
          TravelSage
        </h1>

        <nav className="hidden md:flex space-x-8 text-lg font-medium text-white">
          <Link href="/tourism" className="hover:text-yellow-400 transition-all duration-300">Tourism</Link>
          <Link href="/hotels" className="hover:text-yellow-400 transition-all duration-300">Hotels</Link>
          <Link href="/travels" className="hover:text-yellow-400 transition-all duration-300">Travels</Link>
        </nav>

        {username ? (
          <div className="flex items-center space-x-4">
            <span className="text-white font-semibold">Welcome, {username}!</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white py-2 px-4 rounded-full text-lg font-semibold shadow-md transition-all duration-300 hover:bg-red-600 hover:shadow-lg"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => router.push("/signup")}
            className="flex items-center space-x-2 bg-yellow-500 text-white py-2 px-6 rounded-full text-lg font-semibold shadow-md transition-all duration-300 hover:bg-yellow-600 hover:shadow-lg"
          >
            <FaSignInAlt className="text-xl" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
}
