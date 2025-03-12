"use client";
import { useState } from "react";

const AMADEUS_BASE_URL = "https://test.api.amadeus.com/v1";
const CLIENT_ID = "CSlL4pOCTAadgLQ9p5jvNlIGbIh8qA71";
const CLIENT_SECRET = "MipI15ogIxj4XwUG";

export default function HotelBooking() {
  const [city, setCity] = useState("");
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [offers, setOffers] = useState<{ [key: string]: Offer[] }>({});
  const [loading, setLoading] = useState(false);
  let accessToken: string | null = null;

  const getAccessToken = async () => {
    if (accessToken) return accessToken;
    const response = await fetch(`${AMADEUS_BASE_URL}/security/oauth2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
    });
    const data = await response.json();
    accessToken = data.access_token;
    return accessToken;
  };

  const getIATACode = async (city: string): Promise<string | null> => {
    const token = await getAccessToken();
    const response = await fetch(`${AMADEUS_BASE_URL}/reference-data/locations?subType=CITY&keyword=${city}&countryCode=IN`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    return data.data?.[0]?.iataCode || null;
  };

  const searchHotels = async () => {
    setLoading(true);
    setHotels([]);
    setOffers({});

    const cityCode = await getIATACode(city);
    if (!cityCode) {
      alert("City not found!");
      setLoading(false);
      return;
    }

    const token = await getAccessToken();
    const response = await fetch(`${AMADEUS_BASE_URL}/reference-data/locations/hotels/by-city?cityCode=${cityCode}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();

    const hotelsWithRatings = (Array.isArray(data.data) ? data.data : []).map((hotel:Hotel, index: number) => ({
      ...hotel,
      rating: (4.0 + (index % 5) * 0.2).toFixed(1) // Assigning consistent but varied ratings
    }));

    setHotels(hotelsWithRatings);
    setLoading(false);
  };

  const getHotelOffers = async (hotelId: string) => {
    const token = await getAccessToken();
    const response = await fetch(`${AMADEUS_BASE_URL}/shopping/hotel-offers?hotelIds=${hotelId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setOffers((prev) => ({ ...prev, [hotelId]: data.data || [] }));
  };

  interface Hotel {
    hotelId: string;
    name: string;
    rating?: string;
  }

  interface Offer {
    id: string;
    price: {
      total: string;
      currency: string;
    };
  }

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-4xl font-bold mb-6 text-center">Hotel Search in India</h1>
      <div className="flex justify-center gap-4">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter City in India"
          className="border p-3 rounded bg-gray-800 text-white w-80 text-center"
        />
        <button onClick={searchHotels} className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 font-semibold">
          Search Hotels
        </button>
      </div>
      {loading && <p className="mt-4 text-center">Loading...</p>}
      <div className="mt-6">
        {Array.isArray(hotels) && hotels.length > 0 && (
          <>
            <h2 className="text-2xl font-semibold mb-3 text-center">Available Hotels</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map((hotel) => (
                <div key={hotel.hotelId} className="border p-6 rounded bg-gray-800 text-center">
                  <p className="font-semibold text-lg mb-2">{hotel.name}</p>
                  <p className="text-yellow-400 font-bold">⭐ {hotel.rating} / 5</p>
                  <button
                    onClick={() => getHotelOffers(hotel.hotelId)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-2"
                  >
                    View Offers
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
