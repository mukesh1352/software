"use client";
import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function HotelDetails() {
  return (
    <Suspense fallback={<div className="p-8 min-h-screen flex items-center justify-center text-white">Loading hotel details...</div>}>
      <HotelDetailsContent />
    </Suspense>
  );
}

function HotelDetailsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const hotelName = searchParams.get("name") || "Unknown Hotel";
  const hotelCost = searchParams.get("cost") || "N/A";

  // State for form inputs and total cost
  const [userName, setUserName] = useState("");
  const [numRooms, setNumRooms] = useState(1);
  const [numAdults, setNumAdults] = useState(1);
  const [numChildren, setNumChildren] = useState(0);
  const [totalCost, setTotalCost] = useState<number>(0);

  // Function to calculate total cost based on inputs
  const calculateTotalCost = () => {
    const roomCost = parseFloat(hotelCost) || 0;
    const total = roomCost * numRooms * (numAdults + numChildren * 0.5); // Assuming children pay half the price
    setTotalCost(total);
  };

  // Function to handle booking
  const handleBooking = async () => {
    if (!userName || totalCost <= 0) {
      alert("Please fill in all fields and calculate the total cost.");
      return;
    }

    const bookingData = {
      hotel_name: hotelName,
      number_of_rooms: numRooms,
      number_of_adults: numAdults,
      number_of_children: numChildren,
      cost_per_room: parseFloat(hotelCost), // Adding cost_per_room to the request body
      user_id: 1, // This should be dynamically set based on the logged-in user (e.g., from a session or auth state)
    };

    try {
      const response = await fetch("http://localhost:8000/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Booking successful! Total cost: ₹${data.total_cost.toFixed(2)}`);
        router.push("/"); // Redirect after successful booking
      } else {
        const errorData = await response.json();
        alert(`Booking failed: ${errorData.detail || "Please try again."}`);
      }
    } catch (error) {
      console.error("Error booking hotel:", error);
      alert("Error booking hotel. Please try again.");
    }
  };

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-4xl font-bold text-center">{hotelName}</h1>
      <p className="text-center mt-4">Please provide your details to book the hotel.</p>

      <div className="mt-6">
        <div className="flex flex-col gap-4">
          <label className="text-lg">Your Name</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your name"
            className="border p-3 rounded bg-gray-800 text-white"
          />
          
          <label className="text-lg">Number of Rooms</label>
          <input
            type="number"
            value={numRooms}
            onChange={(e) => setNumRooms(Number(e.target.value))}
            min="1"
            className="border p-3 rounded bg-gray-800 text-white"
          />
          
          <label className="text-lg">Number of Adults</label>
          <input
            type="number"
            value={numAdults}
            onChange={(e) => setNumAdults(Number(e.target.value))}
            min="1"
            className="border p-3 rounded bg-gray-800 text-white"
          />
          
          <label className="text-lg">Number of Children</label>
          <input
            type="number"
            value={numChildren}
            onChange={(e) => setNumChildren(Number(e.target.value))}
            min="0"
            className="border p-3 rounded bg-gray-800 text-white"
          />
          
          <div className="mt-4 text-center">
            <button
              onClick={calculateTotalCost}
              className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
            >
              Calculate Total Cost
            </button>
          </div>

          {totalCost > 0 && (
            <div className="mt-4 text-center">
              <p className="text-xl font-semibold">Total Cost: ₹{totalCost.toFixed(2)}</p>
            </div>
          )}

          {totalCost > 0 && (
            <div className="mt-4 text-center">
              <button
                onClick={handleBooking}
                className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600"
              >
                Book Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
