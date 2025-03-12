"use client";
import { useState } from "react";

export default function HotelBooking() {
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [geoId, setGeoId] = useState("");
  const [hotels, setHotels] = useState([]);

  // Fetch geoId from the first API
  async function fetchGeoId() {
    if (!location) {
      alert("Please enter a location.");
      return;
    }

    try {
      const response = await fetch(
        `https://tripadvisor16.p.rapidapi.com/api/v1/hotels/searchLocation?query=${encodeURIComponent(location)}&lang=en`,
        {
          method: "GET",
          headers: {
            "x-rapidapi-key": "95d2135e6cmsh35e54f6b9e0d617p142bedjsn17554e09eb01", // Replace with your actual API key
            "x-rapidapi-host": "tripadvisor16.p.rapidapi.com",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch geoId: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (data.data && data.data.length > 0) {
        const fetchedGeoId = data.data[0].geoId; // Extract first geoId
        setGeoId(fetchedGeoId);
        fetchHotels(fetchedGeoId); // Fetch hotels using this geoId
      } else {
        alert("No location found.");
      }
    } catch (error) {
      console.error("Error fetching geoId:", error);
      alert("Error fetching location details.");
    }
  }

  // Fetch hotels using geoId
  async function fetchHotels(geoId: string) {
    if (!geoId || !checkIn || !checkOut) {
      alert("Please enter check-in and check-out dates.");
      return;
    }

    try {
      const response = await fetch(
        `https://tripadvisor16.p.rapidapi.com/api/v1/hotels/searchHotels?pageNumber=1&geoId=${geoId}&checkIn=${checkIn}&checkOut=${checkOut}&currencyCode=USD`,
        {
          method: "GET",
          headers: {
            "x-rapidapi-key": "95d2135e6cmsh35e54f6b9e0d617p142bedjsn17554e09eb01", // Replace with your actual API key
            "x-rapidapi-host": "tripadvisor16.p.rapidapi.com",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch hotels: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setHotels(data.data); // Save hotel listings
    } catch (error) {
      console.error("Error fetching hotels:", error);
      alert("Error fetching hotels.");
    }
  }

  return (
    <div>
      <h1>Hotel Booking</h1>

      {/* Location Input */}
      <input
        type="text"
        placeholder="Enter location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      {/* Check-in & Check-out Inputs */}
      <input
        type="date"
        value={checkIn}
        onChange={(e) => setCheckIn(e.target.value)}
      />
      <input
        type="date"
        value={checkOut}
        onChange={(e) => setCheckOut(e.target.value)}
      />

      {/* Fetch Hotels Button */}
      <button onClick={fetchGeoId}>Search Hotels</button>

      {/* Show Geo ID */}
      {geoId && <p>Geo ID: {geoId}</p>}

      {/* Show Hotel Listings */}
      {hotels.length > 0 && (
        <div>
          <h2>Available Hotels</h2>
          <ul>
            {hotels.map((hotel: any, index) => (
              <li key={index}>
                <strong>{hotel.name}</strong> - {hotel.price} USD
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
