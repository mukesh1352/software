"use client";
import { useState } from "react";
import Image from "next/image";

const AMADEUS_BASE_URL = "https://test.api.amadeus.com/v1";
const CLIENT_ID = "CSlL4pOCTAadgLQ9p5jvNlIGbIh8qA71";
const CLIENT_SECRET = "MipI15ogIxj4XwUG";

export default function HotelBooking() {
  const [city, setCity] = useState("");
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [offers, setOffers] = useState<{ [key: string]: Offer[] }>({});
  const [privileges, setPrivileges] = useState<{ [key: string]: string[] }>({});
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

  interface IATACodeResponse {
    data: { iataCode: string }[];
  }

  const getIATACode = async (city: string): Promise<string | null> => {
    const token = await getAccessToken();
    const response = await fetch(`${AMADEUS_BASE_URL}/reference-data/locations?subType=CITY&keyword=${city}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data: IATACodeResponse = await response.json();
    return data.data?.[0]?.iataCode || null;
  };

  const searchHotels = async () => {
    setLoading(true);
    setHotels([]);
    setOffers({});
    setPrivileges({});
    
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
    
    const hotelsWithImages: Hotel[] = data.data.map((hotel: Hotel) => ({
      ...hotel,
      imageUrl: `https://source.unsplash.com/400x300/?hotel,${hotel.name}`,
    }));
    
    setHotels(hotelsWithImages);
    setLoading(false);
  };

  const getHotelOffers = async (hotelId: string) => {
    const token = await getAccessToken();
    const response = await fetch(`${AMADEUS_BASE_URL}/shopping/hotel-offers?hotelIds=${hotelId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    
    setOffers((prevOffers) => ({
      ...prevOffers,
      [hotelId]: data.data || [],
    }));
  };

  interface Hotel {
    hotelId: string;
    name: string;
    imageUrl?: string;
  }

  interface Offer {
    id: string;
    price: {
      total: string;
      currency: string;
    };
  }

  interface PrivilegesResponse {
    privileges: string[];
  }

  const getPrivileges = async (hotelId: string) => {
    const token = await getAccessToken();
    const response = await fetch(`${AMADEUS_BASE_URL}/accommodations/details?hotelId=${hotelId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data: PrivilegesResponse = await response.json();
    
    setPrivileges((prev) => ({
      ...prev,
      [hotelId]: data.privileges || [],
    }));
  };

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-4xl font-bold mb-6">Hotel Search & Booking</h1>
      <div className="flex gap-4">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter City"
          className="border p-3 rounded bg-gray-800 text-white"
        />
        <button onClick={searchHotels} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Search Hotels
        </button>
      </div>
      
      {loading && <p className="mt-4">Loading...</p>}

      <div className="mt-6">
        {hotels.length > 0 && (
          <>
            <h2 className="text-2xl font-semibold mb-3">Available Hotels</h2>
            {hotels.map((hotel) => (
              <div key={hotel.hotelId} className="border p-4 mb-4 rounded bg-gray-800 flex">
                <Image src={hotel.imageUrl || "/default-hotel.jpg"} alt={hotel.name} className="w-40 h-32 rounded mr-4"/>
                <div>
                  <p className="font-semibold text-lg">{hotel.name}</p>
                  <div className="flex gap-3 mt-2">
                    <button
                      onClick={() => getHotelOffers(hotel.hotelId)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      View Offers
                    </button>
                    <button
                      onClick={() => getPrivileges(hotel.hotelId)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Check Privileges
                    </button>
                  </div>
                  {offers[hotel.hotelId] && offers[hotel.hotelId].length > 0 && (
                    <div className="mt-2 border-t pt-2">
                      {offers[hotel.hotelId].map((offer) => (
                        <p key={offer.id}>
                          💰 Price: <strong>{offer.price.total} {offer.price.currency}</strong>
                        </p>
                      ))}
                    </div>
                  )}
                  {privileges[hotel.hotelId] && privileges[hotel.hotelId].length > 0 && (
                    <div className="mt-2 border-t pt-2">
                      <h3 className="font-semibold">Privileges:</h3>
                      <ul>
                        {privileges[hotel.hotelId].map((priv, index) => (
                          <li key={index}>✅ {priv}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
