import { NextResponse } from 'next/server';

// Type Definitions
interface Attraction {
  name: string;
  type: string;
  description: string;
  cost: number;
  duration: string;
  bestTime?: string;
  location?: string;
  tags?: string[];
  image?: string;
}

interface Hotel {
  name: string;
  rating: number;
  price: number;
  type: string;
  amenities: string[];
  description?: string;
  location?: string;
  image?: string;
}

interface Restaurant {
  name: string;
  type: string;
  cuisine: string;
  cost: number;
  specialty: string;
  bestFor?: string;
  location?: string;
  image?: string;
}

interface DestinationData {
  description: string;
  attractions: Attraction[];
  hotels: Hotel[];
  restaurants: Restaurant[];
  tips?: string[];
  climate?: string;
  bestSeason?: string;
}

interface Activity {
  time: string;
  title: string;
  description: string;
  cost: number;
  duration: string;
  icon: string;
}

interface CostBreakdown {
  activities: number;
  accommodation: number;
  transportation: number;
  miscellaneous: number;
}

// Supported Destinations Type
type ValidDestination = 'hyderabad' | 'goa' | 'kerala' | 'rajasthan' | 'himachal' | 'kashmir';

// Destination Data
const DESTINATION_DATA: Record<ValidDestination, DestinationData> = {
  hyderabad: {
    description: "Hyderabad, the City of Pearls, blends ancient heritage with modern development. Known for its biryani, historic monuments, and thriving IT sector.",
    climate: "Warm most of the year, hot summers (Apr-Jun), mild winters",
    bestSeason: "October to March",
    attractions: [
      {
        name: "Charminar",
        type: "Historical",
        description: "Iconic 16th-century monument with four grand arches.",
        cost: 100,
        duration: "1-2 hours",
        tags: ["Landmark", "Photography"],
        image: "/hyderabad-charminar.jpg"
      },
      {
        name: "Golconda Fort",
        type: "Historical",
        description: "Majestic 13th-century fort known for its acoustic architecture.",
        cost: 200,
        duration: "3-4 hours",
        tags: ["Fort", "History"]
      },
      {
        name: "Ramoji Film City",
        type: "Entertainment",
        description: "World's largest integrated film studio complex.",
        cost: 1200,
        duration: "Full day",
        tags: ["Family", "Theme Park"]
      }
    ],
    hotels: [
      {
        name: "Taj Falaknuma Palace",
        rating: 5,
        price: 25000,
        type: "Luxury Heritage",
        amenities: ["Pool", "Spa", "Fine Dining"],
        image: "/hyderabad-taj.jpg"
      },
      {
        name: "ITC Kakatiya",
        rating: 5,
        price: 12000,
        type: "Luxury Business",
        amenities: ["Spa", "Multiple Restaurants"]
      }
    ],
    restaurants: [
      {
        name: "Paradise Biryani",
        type: "Casual",
        cuisine: "Hyderabadi",
        cost: 500,
        specialty: "Hyderabadi Dum Biryani"
      },
      {
        name: "Ohri's Jiva Imperia",
        type: "Fine Dining",
        cuisine: "Multi-cuisine",
        cost: 1200,
        specialty: "Sunday Brunch Buffet"
      }
    ],
    tips: [
      "Try Irani chai with Osmania biscuits",
      "Visit Laad Bazaar for pearls",
      "Bargain at markets for best prices"
    ]
  },
  goa: {
    description: "India's beach paradise with Portuguese heritage, vibrant nightlife, and water sports.",
    climate: "Tropical, hot and humid",
    bestSeason: "November to February",
    attractions: [
      {
        name: "Baga Beach",
        type: "Beach",
        description: "Popular beach with water sports and nightlife.",
        cost: 0,
        duration: "Flexible",
        tags: ["Water Sports", "Nightlife"],
        image: "/goa-beach.jpg"
      },
      {
        name: "Old Goa Churches",
        type: "Historical",
        description: "UNESCO World Heritage churches from Portuguese era.",
        cost: 100,
        duration: "2-3 hours",
        tags: ["Architecture", "History"]
      }
    ],
    hotels: [
      {
        name: "The Leela Goa",
        rating: 5,
        price: 20000,
        type: "Luxury",
        amenities: ["Pool", "Spa", "Beachfront"],
        image: "/goa-leela.jpg"
      },
      {
        name: "Taj Exotica Resort",
        rating: 5,
        price: 18000,
        type: "Luxury",
        amenities: ["Private Beach", "Multiple Pools"]
      }
    ],
    restaurants: [
      {
        name: "Martin's Corner",
        type: "Casual",
        cuisine: "Goan",
        cost: 1500,
        specialty: "Seafood"
      },
      {
        name: "Fisherman's Wharf",
        type: "Goan Cuisine",
        cuisine: "Goan",
        cost: 600,
        specialty: "Goan fish curry"
      }
    ]
  },
  kerala: {
    description: "God's Own Country with backwaters, lush greenery, and Ayurvedic treatments.",
    climate: "Tropical, monsoons (Jun-Aug)",
    bestSeason: "September to March",
    attractions: [
      {
        name: "Alleppey Backwaters",
        type: "Nature",
        description: "Serene network of lagoons best experienced by houseboat.",
        cost: 5000,
        duration: "Overnight",
        tags: ["Houseboat", "Relaxing"],
        image: "/kerala-backwaters.jpg"
      },
      {
        name: "Munnar Tea Gardens",
        type: "Nature",
        description: "Rolling hills covered with tea plantations.",
        cost: 200,
        duration: "Half day",
        tags: ["Scenic", "Photography"]
      }
    ],
    hotels: [
      {
        name: "Kumarakom Lake Resort",
        rating: 5,
        price: 15000,
        type: "Luxury",
        amenities: ["Pool", "Spa", "Backwater View"],
        image: "/kerala-kumarakom.jpg"
      },
      {
        name: "Taj Bekal Resort",
        rating: 5,
        price: 18000,
        type: "Luxury",
        amenities: ["Ayurveda", "Private Pool Villas"]
      }
    ],
    restaurants: [
      {
        name: "Malabar Junction",
        type: "Fine Dining",
        cuisine: "Kerala",
        cost: 2000,
        specialty: "Seafood and traditional Kerala dishes"
      }
    ]
  },
  rajasthan: {
    description: "Land of Kings with majestic forts, palaces, and desert landscapes.",
    climate: "Hot days, cool nights (Oct-Mar), extreme summers",
    bestSeason: "October to March",
    attractions: [
      {
        name: "Amber Fort",
        type: "Historical",
        description: "Magnificent fort-palace with intricate carvings.",
        cost: 500,
        duration: "3-4 hours",
        tags: ["Architecture", "History"],
        image: "/rajasthan-fort.jpg"
      },
      {
        name: "City Palace, Udaipur",
        type: "Historical",
        description: "Stunning palace complex on Lake Pichola.",
        cost: 300,
        duration: "2-3 hours",
        tags: ["Palace", "Lake View"]
      }
    ],
    hotels: [
      {
        name: "Umaid Bhawan Palace",
        rating: 5,
        price: 30000,
        type: "Luxury Heritage",
        amenities: ["Pool", "Spa", "Fine Dining"],
        image: "/rajasthan-umaid.jpg"
      },
      {
        name: "Taj Lake Palace",
        rating: 5,
        price: 35000,
        type: "Luxury",
        amenities: ["Lake Views", "Boat Transfer"]
      }
    ],
    restaurants: [
      {
        name: "Chokhi Dhani",
        type: "Traditional",
        cuisine: "Rajasthani",
        cost: 2000,
        specialty: "Authentic Rajasthani Thali"
      }
    ]
  },
  himachal: {
    description: "Mountainous state with hill stations, trekking routes, and snow-capped peaks.",
    climate: "Cool summers, cold winters (snow Dec-Feb)",
    bestSeason: "March to June, September to November",
    attractions: [
      {
        name: "Shimla Mall Road",
        type: "Hill Station",
        description: "Popular walking street with colonial architecture.",
        cost: 0,
        duration: "2-3 hours",
        tags: ["Shopping", "Views"],
        image: "/himachal-shimla.jpg"
      },
      {
        name: "Manali Solang Valley",
        type: "Adventure",
        description: "Popular for skiing and adventure sports.",
        cost: 500,
        duration: "Half day",
        tags: ["Skiing", "Paragliding"]
      }
    ],
    hotels: [
      {
        name: "Wildflower Hall",
        rating: 5,
        price: 20000,
        type: "Luxury",
        amenities: ["Spa", "Mountain View", "Pool"],
        image: "/himachal-wildflower.jpg"
      },
      {
        name: "The Oberoi Cecil",
        rating: 5,
        price: 18000,
        type: "Luxury",
        amenities: ["Historic", "Central Location"]
      }
    ],
    restaurants: [
      {
        name: "Cafe Simla Times",
        type: "Casual",
        cuisine: "Continental",
        cost: 1200,
        specialty: "Wood-fired Pizza"
      }
    ]
  },
  kashmir: {
    description: "Paradise on Earth with stunning valleys, lakes, and Mughal gardens.",
    climate: "Temperate summers, cold winters (snow Nov-Mar)",
    bestSeason: "April to October",
    attractions: [
      {
        name: "Dal Lake",
        type: "Nature",
        description: "Iconic lake with houseboats and shikara rides.",
        cost: 1000,
        duration: "2-3 hours",
        tags: ["Boat Ride", "Photography"],
        image: "/kashmir-dal.jpg"
      },
      {
        name: "Gulmarg Gondola",
        type: "Adventure",
        description: "One of the highest cable cars in the world.",
        cost: 1500,
        duration: "Half day",
        tags: ["Skiing", "Mountain Views"]
      }
    ],
    hotels: [
      {
        name: "The Lalit Grand Palace",
        rating: 5,
        price: 25000,
        type: "Luxury",
        amenities: ["Spa", "Garden View", "Fine Dining"],
        image: "/kashmir-lalit.jpg"
      },
      {
        name: "Khyber Himalayan Resort",
        rating: 5,
        price: 22000,
        type: "Luxury",
        amenities: ["Mountain Views", "Ski-in/Ski-out"]
      }
    ],
    restaurants: [
      {
        name: "Ahdoos",
        type: "Casual",
        cuisine: "Kashmiri",
        cost: 1500,
        specialty: "Rogan Josh and Wazwan"
      }
    ]
  }
};

// Helper Functions
const isValidDestination = (dest: string): dest is ValidDestination => {
  return Object.keys(DESTINATION_DATA).includes(dest);
};

const getFirstImage = (attractions: Attraction[]): string => {
  return attractions.find(a => a.image)?.image || '/default-destination.jpg';
};

const filterByInterests = (attractions: Attraction[], interests: string[]): Attraction[] => {
  return attractions
    .map(attr => ({
      ...attr,
      score: interests.reduce((sum, interest) => 
        sum + (attr.tags?.includes(interest) || 
               attr.type.toLowerCase().includes(interest.toLowerCase()) ? 1 : 0), 0)
    }))
    .filter(attr => interests.length === 0 || attr.score > 0)
    .sort((a, b) => b.score - a.score);
};

const filterHotelsByBudget = (hotels: Hotel[], dailyBudget: number): Hotel[] => {
  return hotels
    .filter(hotel => hotel.price <= dailyBudget * 1.5)
    .sort((a, b) => a.price - b.price);
};

const getTransportationCost = (
  destination: ValidDestination,
  travelers: number,
  days: number,
  budget: number
): number => {
  const baseCosts = {
    hyderabad: { flight: 5000, train: 2000, bus: 1000 },
    goa: { flight: 7000, train: 2500, bus: 1500 },
    kerala: { flight: 8000, train: 3000, bus: 1800 },
    rajasthan: { flight: 9000, train: 3500, bus: 2000 },
    himachal: { flight: 6000, train: 2000, bus: 1200 },
    kashmir: { flight: 10000, train: 4000, bus: 2500 }
  };

  const localTransport = {
    hyderabad: 300,
    goa: 400,
    kerala: 500,
    rajasthan: 400,
    himachal: 600,
    kashmir: 700
  };

  // Select transportation mode based on budget
  let mode: 'flight' | 'train' | 'bus' = 'bus';
  if (budget > 5000) mode = 'flight';
  else if (budget > 3000) mode = 'train';

  const intercityCost = baseCosts[destination][mode] * travelers;
  const intracityCost = localTransport[destination] * travelers * days;
  
  return Math.round((intercityCost + intracityCost) * 1.2); // 20% buffer
};

const generateItinerary = (
  attractions: Attraction[],
  restaurants: Restaurant[],
  travelers: number,
  days: number
): { day: number; activities: Activity[] }[] => {
  const itinerary: { day: number; activities: Activity[] }[] = [];
  const usedAttractions = new Set<number>();

  for (let dayNum = 1; dayNum <= days; dayNum++) {
    const dayActivities: Activity[] = [];
    let attractionAdded = false;

    // Morning Activity
    for (let i = 0; i < attractions.length && !attractionAdded; i++) {
      if (!usedAttractions.has(i)) {
        const attr = attractions[i];
        dayActivities.push({
          time: "Morning",
          title: attr.name,
          description: attr.description,
          cost: attr.cost * travelers,
          duration: attr.duration,
          icon: "sightseeing"
        });
        usedAttractions.add(i);
        attractionAdded = true;
      }
    }

    // Afternoon Activity (always add restaurant)
    if (restaurants.length > 0) {
      const restaurant = restaurants[(dayNum - 1) % restaurants.length];
      dayActivities.push({
        time: "Afternoon",
        title: `Dine at ${restaurant.name}`,
        description: `${restaurant.cuisine} - ${restaurant.specialty}`,
        cost: restaurant.cost * travelers,
        duration: "1-2 hours",
        icon: "dining"
      });
    }

    // Evening Activity (every other day)
    if (dayNum % 2 === 0 && attractions.length > 1) {
      for (let i = 0; i < attractions.length; i++) {
        if (!usedAttractions.has(i)) {
          const attr = attractions[i];
          dayActivities.push({
            time: "Evening",
            title: attr.name,
            description: attr.description,
            cost: attr.cost * travelers,
            duration: attr.duration,
            icon: "leisure"
          });
          usedAttractions.add(i);
          break;
        }
      }
    }

    itinerary.push({ day: dayNum, activities: dayActivities });
  }

  return itinerary;
};

const calculateTotalCost = (
  itinerary: { day: number; activities: Activity[] }[],
  hotels: Hotel[],
  travelers: number,
  days: number,
  destination: ValidDestination,
  budget: number
): { totalEstimatedCost: number; perPersonCost: number; breakdown: CostBreakdown } => {
  // Activity costs
  const activityCost = itinerary.reduce(
    (sum, day) => sum + day.activities.reduce((daySum, act) => daySum + act.cost, 0),
    0
  );

  // Hotel costs (select mid-range hotel)
  const selectedHotel = hotels.length > 0
    ? hotels[Math.min(1, hotels.length - 1)] // Select 2nd hotel or last if < 2
    : { price: budget * travelers * 0.6 }; // Fallback estimation
  
  const hotelCost = selectedHotel.price * days;

  // Transportation costs
  const transportCost = getTransportationCost(destination, travelers, days, budget);

  // 15% buffer for miscellaneous expenses
  const miscCost = (activityCost + hotelCost + transportCost) * 0.15;
  const total = activityCost + hotelCost + transportCost + miscCost;

  return {
    totalEstimatedCost: Math.round(total),
    perPersonCost: Math.round(total / travelers),
    breakdown: {
      activities: Math.round(activityCost),
      accommodation: Math.round(hotelCost),
      transportation: Math.round(transportCost),
      miscellaneous: Math.round(miscCost)
    }
  };
};

// Main API Handler
export async function POST(request: Request) {
  try {
    const { destination, interests = [], budget = 2000, travelers = 1, duration } = await request.json();

    // Validate input
    if (!destination) {
      return NextResponse.json(
        { error: "Destination is required" },
        { status: 400 }
      );
    }

    if (travelers < 1 || travelers > 20) {
      return NextResponse.json(
        { error: "Number of travelers must be between 1 and 20" },
        { status: 400 }
      );
    }

    if (budget < 500 || budget > 10000) {
      return NextResponse.json(
        { error: "Daily budget must be between ₹500 and ₹10,000 per person" },
        { status: 400 }
      );
    }

    const normalizedDestination = destination.toLowerCase();
    if (!isValidDestination(normalizedDestination)) {
      return NextResponse.json(
        { error: "Destination not supported. Try: Hyderabad, Goa, Kerala, Rajasthan, Himachal, or Kashmir" },
        { status: 404 }
      );
    }

    const data = DESTINATION_DATA[normalizedDestination];
    const days = duration ? Math.max(1, Math.min(duration, 21)) : 3;

    // Filter data based on inputs
    const filteredAttractions = filterByInterests(data.attractions, interests);
    const filteredHotels = filterHotelsByBudget(data.hotels, budget * travelers);

    // Generate itinerary and calculate costs
    const itinerary = generateItinerary(filteredAttractions, data.restaurants, travelers, days);
    const { totalEstimatedCost, perPersonCost, breakdown } = calculateTotalCost(
      itinerary,
      filteredHotels,
      travelers,
      days,
      normalizedDestination,
      budget
    );

    return NextResponse.json({
      destination: destination.charAt(0).toUpperCase() + destination.slice(1),
      description: data.description,
      climate: data.climate,
      bestSeason: data.bestSeason,
      itinerary,
      hotels: filteredHotels.slice(0, 3),
      restaurants: data.restaurants,
      totalEstimatedCost,
      perPersonCost,
      costBreakdown: breakdown,
      tips: data.tips || [],
      image: getFirstImage(data.attractions)
    });

  } catch (error) {
    console.error("Recommendation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}