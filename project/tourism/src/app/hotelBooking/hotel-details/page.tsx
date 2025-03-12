"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

export default function HotelDetails() {
  return (
    <Suspense fallback={<div className="p-8 min-h-screen flex items-center justify-center text-white">Loading hotel details...</div>}>
      <HotelDetailsContent />
    </Suspense>
  );
}

function HotelDetailsContent() {
  const searchParams = useSearchParams();
  const hotelName = searchParams.get("name") || "Unknown Hotel";

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-4xl font-bold text-center">{hotelName}</h1>
      <p className="text-center mt-4">More details about {hotelName} coming soon...</p>
    </div>
  );
}
