"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const CLIENT_ID = "CSlL4pOCTAadgLQ9p5jvNlIGbIh8qA71"; // Replace with your actual API key
const CLIENT_SECRET = "MipI15ogIxj4XwUG"; // Replace with your actual API secret
const AUTH_URL = "https://test.api.amadeus.com/v1/security/oauth2/token";
const API_URL = "https://test.api.amadeus.com/v3/shopping/hotel-offers";

async function getAccessToken() {
  try {
    const response = await fetch(AUTH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
    });

    const data = await response.json();
    if (data.access_token) {
      return data.access_token;
    } else {
      console.error("Failed to get access token:", data);
      return null;
    }
  } catch (error) {
    console.error("Error fetching access token:", error);
    return null;
  }
}

export default function HotelBooking() {
  const [hotels, setHotels] = useState<any[]>([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [bookingMessage, setBookingMessage] = useState("");

  useEffect(() => {
    async function fetchHotels() {
      const token = await getAccessToken();
      if (!token) return;

      try {
        const response = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setHotels(data.data || []);
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    }

    fetchHotels();
  }, []);

  const handleBooking = () => {
    if (!selectedHotel || !checkIn || !checkOut) {
      setBookingMessage("Please fill all details.");
      return;
    }
    const hotel = hotels.find((h) => h.hotel.id === selectedHotel);
    setBookingMessage(
      `Booking confirmed for ${hotel?.hotel.name} from ${checkIn} to ${checkOut} for ${guests} guests.`
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">Recommended Hotels</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {hotels.map((hotel) => (
          <div
            key={hotel.hotel.id}
            className={`p-4 border rounded-lg shadow-md cursor-pointer transition transform hover:scale-105 ${
              selectedHotel === hotel.hotel.id ? "border-blue-500" : "border-gray-300"
            }`}
            onClick={() => setSelectedHotel(hotel.hotel.id)}
          >
            <Image
              src={hotel.hotel.media?.[0]?.uri || "/placeholder.jpg"}
              alt={hotel.hotel.name}
              width={300}
              height={200}
              className="rounded-lg w-full h-40 object-cover"
            />
            <h3 className="text-xl font-semibold mt-2">{hotel.hotel.name}</h3>
            <p className="text-gray-600">{hotel.hotel.address.cityName}</p>
            <p className="text-blue-600 font-bold">${hotel.offers[0]?.price.total}/night</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-semibold mb-4">Book Your Stay</h2>
      <div className="flex flex-col gap-3">
        <input
          type="date"
          className="p-3 border rounded"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
        />
        <input
          type="date"
          className="p-3 border rounded"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
        />
        <input
          type="number"
          className="p-3 border rounded"
          min="1"
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleBooking}
        >
          Book Now
        </button>
      </div>
      {bookingMessage && <p className="mt-4 text-green-600 font-semibold">{bookingMessage}</p>}
    </div>
  );
}
