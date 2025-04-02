'use client';

import React from "react";
import Link from "next/link"; 
import Header from "./components/header";
import Heading from "./components/mainheading";
import Slider from "./components/slider";
import Footer from "./components/footer";
import ImageGallery1 from "./components/slider1";
import ImageGallery2 from "./components/slider2";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Section */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center text-center">
        <Heading />

        {/* Tourism Section */}
        <section className="py-10 px-6 w-full flex flex-col items-center">
          <h1 className="font-serif text-5xl font-extrabold text-gray-900 tracking-wide drop-shadow-lg mb-4">
            🌍 Tourism
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl leading-relaxed">
            Tourism is something many of us love. Explore the best tourist spots around the 
            world, book your dream destination, and plan an unforgettable journey. Discover, 
            travel, and create memories that last a lifetime! ✈️🏝️
          </p>
        </section>

        {/* Tourism Slider */}
        <Slider />

        {/* Tourism Button */}
        <Link href="/tourism">
          <button className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold text-lg rounded-lg shadow-md hover:bg-blue-700 transition">
            Explore Tourism 🌍
          </button>
        </Link>

        {/* Accommodations Section */}
        <section className="py-10 px-6 w-full flex flex-col items-center">
          <h1 className="font-serif text-5xl font-extrabold text-gray-900 tracking-wide drop-shadow-lg mb-4">
            🏨 Accommodations
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl leading-relaxed">
            Accommodations are one of the most important parts of travel. Find the best hotels, 
            resorts, and stays to make your trip comfortable and memorable!
          </p>
        </section>

        {/* Accommodations Slider */}
        <ImageGallery1 />

        {/* Accommodations Button */}
        <Link href="/hotels">
          <button className="mt-6 px-6 py-3 bg-green-600 text-white font-semibold text-lg rounded-lg shadow-md hover:bg-green-700 transition">
            View Accommodations 🏨
          </button>
        </Link>

        {/* Travels Section */}
        <section className="py-10 px-6 w-full flex flex-col items-center">
          <h1 className="font-serif text-5xl font-extrabold text-gray-900 tracking-wide drop-shadow-lg mb-4">
            ✈️ Travels
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl leading-relaxed">
            Travels are one of the main things required for a vacation to be peaceful 
            and enjoyable. Proper travel arrangements ensure a smooth and hassle-free trip.
          </p>
        </section>

        {/* Travels Slider */}
        <ImageGallery2 />

        {/* Travels Button */}
        <Link href="/travel">
          <button className="mt-6 px-6 py-3 bg-green-600 text-white font-semibold text-lg rounded-lg shadow-md hover:bg-green-700 transition">
            View Travels
          </button>
        </Link>
      </main>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
