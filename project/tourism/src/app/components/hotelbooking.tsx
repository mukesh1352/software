"use client";
import React, { useState, useEffect } from 'react';

export default function HotelBooking() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

interface hotel{
  name: string;
}
  const fetchHotels = async () => {
    if (!query) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/searchDestination?query=${query}`);
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError('Failed to fetch data');
    }
    setLoading(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Hotel Search</h1>
      <input 
        type="text" 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
        placeholder="Enter destination..." 
        className="border p-2 rounded w-full mt-2"
      />
      <button 
        onClick={fetchHotels} 
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
      >
        Search
      </button>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul>
        {results?.map((hotel, index) => (
          <li key={index} className="border-b p-2">{hotel.name}</li>
        ))}
      </ul>
    </div>
  );
}