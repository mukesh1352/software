"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const AMADEUS_BASE_URL = "https://test.api.amadeus.com/v1";
const CLIENT_ID = "0NPR1IEBBmUNFfWR254x2KCGJ94R1tEd";
const CLIENT_SECRET = "PAcdZJQFarJo94dp";

export default function HotelBooking() {
  const [city, setCity] = useState("");
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [selectedSortOptions, setSelectedSortOptions] = useState<string[]>([]); // Multiple sort criteria state
  const router = useRouter();

  const getAccessToken = async () => {
    if (accessToken) return accessToken;

    try {
      const response = await fetch(`${AMADEUS_BASE_URL}/security/oauth2/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
        }),
      });

      if (!response.ok) {
        console.warn("Failed to fetch access token. Status:", response.status);
        return null;
      }

      const data = await response.json();
      setAccessToken(data.access_token);
      return data.access_token;
    } catch (error) {
      console.warn("Error fetching access token:", error);
      return null;
    }
  };

  const getIATACode = async (city: string): Promise<string | null> => {
    const token = await getAccessToken();
    if (!token) return null;

    try {
      const response = await fetch(
        `${AMADEUS_BASE_URL}/reference-data/locations?subType=CITY&keyword=${city}&countryCode=IN`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.ok) {
        console.warn("Failed to fetch IATA code. Response:", response);
        return null;
      }

      const data = await response.json();
      return data?.data?.[0]?.iataCode || null;
    } catch (error) {
      console.warn("Error fetching IATA code:", error);
      return null;
    }
  };

  const searchHotels = async () => {
    setLoading(true);
    setHotels([]);

    const cityCode = await getIATACode(city);
    if (!cityCode) {
      alert("City not found!");
      setLoading(false);
      return;
    }

    const token = await getAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${AMADEUS_BASE_URL}/reference-data/locations/hotels/by-city?cityCode=${cityCode}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.ok) {
        console.warn("Failed to fetch hotels. Response:", response);
        setLoading(false);
        return;
      }

      const data = await response.json();
      const hotelsWithRatings = (Array.isArray(data.data) ? data.data : []).map((hotel: Hotel, index: number) => ({
        ...hotel,
        rating: (4.0 + (index % 5) * 0.2).toFixed(1),
        cost: 1000 + (index % 5) * 100,
      }));

      setHotels(hotelsWithRatings);
    } catch (error) {
      console.warn("Error fetching hotels:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = () => {
    let sortedHotels = [...hotels];

    // Sort hotels based on selected criteria
    if (selectedSortOptions.includes("alphabetical-asc")) {
      sortedHotels.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (selectedSortOptions.includes("alphabetical-desc")) {
      sortedHotels.sort((a, b) => b.name.localeCompare(a.name));
    }

    if (selectedSortOptions.includes("cost-low-high")) {
      sortedHotels.sort((a, b) => (a.cost ?? 0) - (b.cost ?? 0));
    }

    if (selectedSortOptions.includes("cost-high-low")) {
      sortedHotels.sort((a, b) => (b.cost ?? 0) - (a.cost ?? 0));
    }

    setHotels(sortedHotels);
  };

  interface Hotel {
    hotelId: string;
    name: string;
    rating?: string;
    cost?: number;
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

      {hotels.length > 0 && (
        <div className="mt-6 text-center">
          <label className="text-lg mr-3">Sort By:</label>
          <div className="flex justify-center gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                value="alphabetical-asc"
                onChange={(e) => {
                  const updatedSortOptions = e.target.checked
                    ? [...selectedSortOptions, "alphabetical-asc"]
                    : selectedSortOptions.filter((option) => option !== "alphabetical-asc");
                  setSelectedSortOptions(updatedSortOptions);
                }}
              />
              Alphabetical (A-Z)
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                value="alphabetical-desc"
                onChange={(e) => {
                  const updatedSortOptions = e.target.checked
                    ? [...selectedSortOptions, "alphabetical-desc"]
                    : selectedSortOptions.filter((option) => option !== "alphabetical-desc");
                  setSelectedSortOptions(updatedSortOptions);
                }}
              />
              Alphabetical (Z-A)
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                value="cost-low-high"
                onChange={(e) => {
                  const updatedSortOptions = e.target.checked
                    ? [...selectedSortOptions, "cost-low-high"]
                    : selectedSortOptions.filter((option) => option !== "cost-low-high");
                  setSelectedSortOptions(updatedSortOptions);
                }}
              />
              Cost (Low to High)
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                value="cost-high-low"
                onChange={(e) => {
                  const updatedSortOptions = e.target.checked
                    ? [...selectedSortOptions, "cost-high-low"]
                    : selectedSortOptions.filter((option) => option !== "cost-high-low");
                  setSelectedSortOptions(updatedSortOptions);
                }}
              />
              Cost (High to Low)
            </label>
          </div>
          <button onClick={handleSort} className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 mt-2">
            Apply Sorting
          </button>
        </div>
      )}

      {loading && <p className="mt-4 text-center">Loading...</p>}

      <div className="mt-6">
        {hotels.length > 0 && (
          <>
            <h2 className="text-2xl font-semibold mb-3 text-center">Available Hotels</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map((hotel) => (
                <div
                  key={hotel.hotelId}
                  className="border p-6 rounded bg-gray-800 text-center cursor-pointer"
                  onClick={() => router.push(`/hotelBooking/hotel-details?name=${encodeURIComponent(hotel.name)}&cost=${hotel.cost}`)}
                >
                  <p className="font-semibold text-lg mb-2">{hotel.name}</p>
                  <p className="text-yellow-400 font-bold">⭐ {hotel.rating} / 5</p>
                  <p className="text-lg mt-2">Cost: ₹{hotel.cost}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); 
                      router.push(`/hotelBooking/hotel-details?name=${encodeURIComponent(hotel.name)}&cost=${hotel.cost}`);
                    }}
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
