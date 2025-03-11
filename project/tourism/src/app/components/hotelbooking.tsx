"use client";
import { useState } from "react";

export default function HotelBooking() {
  const [location, setLocation] = useState("");
  const [results, setResults] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHotels = async () => {
    if (!location.trim()) return;

    setLoading(true);
    setError(null);

    const url = `https://booking-com15.p.rapidapi.com/api/v1/hotels/searchDestination?query=${encodeURIComponent(location)}`;
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": "95d2135e6cmsh35e54f6b9e0d617p142bedjsn17554e09eb01",
        "x-rapidapi-host": "booking-com15.p.rapidapi.com",
      },
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error("Failed to fetch data from Booking.com API");
      }

      const data = await response.json();
      if (!data.data || data.data.length === 0) {
        setError("No destinations found");
        setResults(null);
      } else {
        setResults(data.data.map((place: { dest_id: string }) => place.dest_id));
      }
    } catch (err) {
      setError((err as Error).message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Enter location"
      />
      <button onClick={fetchHotels} disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {results && results.length > 0 ? (
        <ul>
          {results.map((dest_id, index) => (
            <li key={index}>{dest_id}</li>
          ))}
        </ul>
      ) : (
        !error && <p>No results found</p>
      )}
    </div>
  );
}
