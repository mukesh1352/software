"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { MapPin, Calendar, Info, Compass, Heart, Star, MapPinned, Plane, Utensils, Camera, Users } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Footer } from "react-day-picker"

// Tourism data for India with expanded locations
const tourismData = {
  Delhi: {
    image: "/images/destinations/delhi.jpg",
    images: [
      "/images/attractions/delhi/red-fort.jpg",
      "/images/attractions/delhi/india-gate.jpg",
      "/images/attractions/delhi/qutub-minar.jpg",
    ],
    description: "India's capital territory, a massive metropolitan area in the country's north.",
    bestTimeToVisit: "October to March",
    rating: 4.5,
    attractions: [
      {
        name: "Red Fort",
        description: "Historic fort that was the main residence of the emperors of the Mughal dynasty.",
        activities: ["Historical tours", "Light and sound show", "Museum visit"],
      },
      {
        name: "Qutub Minar",
        description: "A 73-meter tall minaret built in 1193, a UNESCO World Heritage site.",
        activities: ["Photography", "Guided tours", "Exploring surrounding ruins"],
      },
      {
        name: "India Gate",
        description:
          "A war memorial dedicated to the soldiers of the British Indian Army who died in the First World War.",
        activities: ["Evening visits", "Boating in nearby canals", "Picnics in surrounding gardens"],
      },
    ],
  },
  Rajasthan: {
    image: "/images/destinations/rajasthan.jpg",
    images: [
      "/images/attractions/rajasthan/jaipur.jpg",
      "/images/attractions/rajasthan/udaipur.jpg",
      "/images/attractions/rajasthan/jaisalmer.jpg",
    ],
    description: "Land of kings, known for its majestic palaces, mighty fortresses, and vibrant culture.",
    bestTimeToVisit: "October to March",
    rating: 4.8,
    attractions: [
      {
        name: "Jaipur (Pink City)",
        description: "The capital city of Rajasthan, known for its distinctive pink-colored buildings.",
        activities: ["Visit Hawa Mahal", "Explore City Palace", "Shopping for textiles and jewelry"],
      },
      {
        name: "Udaipur",
        description: "The city of lakes, known for its lavish royal residences and romantic setting.",
        activities: ["Boat rides on Lake Pichola", "Visit City Palace", "Explore old city markets"],
      },
      {
        name: "Jaisalmer",
        description: "The Golden City, famous for its yellow sandstone architecture and desert landscapes.",
        activities: ["Desert safari", "Camel rides", "Visit Jaisalmer Fort"],
      },
    ],
  },
  Kerala: {
    image: "/images/destinations/kerala.jpg",
    images: [
      "/images/attractions/kerala/alleppey.jpg",
      "/images/attractions/kerala/munnar.jpg",
      "/images/attractions/kerala/kovalam.jpg",
    ],
    description: "God's Own Country, famous for its backwaters, beaches, and ayurvedic traditions.",
    bestTimeToVisit: "September to March",
    rating: 4.9,
    attractions: [
      {
        name: "Alleppey",
        description: "Known as the 'Venice of the East' for its network of backwaters and houseboats.",
        activities: ["Houseboat stay", "Backwater cruises", "Village tours"],
      },
      {
        name: "Munnar",
        description: "A hill station known for its tea plantations and cool mountain air.",
        activities: ["Tea plantation tours", "Trekking", "Wildlife spotting"],
      },
      {
        name: "Kovalam",
        description: "A beach town known for its crescent-shaped beaches and ayurvedic resorts.",
        activities: ["Beach relaxation", "Ayurvedic treatments", "Water sports"],
      },
    ],
  },
  Goa: {
    image: "/images/destinations/goa.jpg",
    images: [
      "/images/attractions/goa/calangute.jpg",
      "/images/attractions/goa/old-goa.jpg",
      "/images/attractions/goa/dudhsagar.jpg",
    ],
    description: "India's smallest state, known for its beaches, nightlife, and Portuguese-influenced architecture.",
    bestTimeToVisit: "November to February",
    rating: 4.7,
    attractions: [
      {
        name: "Calangute Beach",
        description: "One of Goa's most popular beaches, known as the 'Queen of Beaches'.",
        activities: ["Sunbathing", "Water sports", "Beach shack dining"],
      },
      {
        name: "Old Goa",
        description: "A historic city with Portuguese colonial architecture and churches.",
        activities: ["Visit Basilica of Bom Jesus", "Historical tours", "Photography"],
      },
      {
        name: "Dudhsagar Falls",
        description: "A four-tiered waterfall located on the Mandovi River, one of India's tallest waterfalls.",
        activities: ["Trekking", "Swimming", "Jeep safaris"],
      },
    ],
  },
  "Himachal Pradesh": {
    image: "/images/destinations/himachal.jpg",
    images: [
      "/images/attractions/himachal/shimla.jpg",
      "/images/attractions/himachal/manali.jpg",
      "/images/attractions/himachal/dharamshala.jpg",
    ],
    description: "Land of snow, known for its mountainous landscapes and adventure activities.",
    bestTimeToVisit: "March to June and October to February",
    rating: 4.6,
    attractions: [
      {
        name: "Shimla",
        description: "The state capital and a popular hill station with colonial architecture.",
        activities: ["Mall Road walks", "Toy train ride", "Skiing in winter"],
      },
      {
        name: "Manali",
        description: "A high-altitude resort town known for adventure sports and scenic beauty.",
        activities: ["River rafting", "Paragliding", "Trekking", "Solang Valley visits"],
      },
      {
        name: "Dharamshala",
        description: "Home to the Dalai Lama and the Tibetan government-in-exile.",
        activities: ["Visit Mcleodganj", "Meditation retreats", "Trekking to Triund"],
      },
    ],
  },
  "Tamil Nadu": {
    image: "/images/destinations/tamil-nadu.jpg",
    images: [
      "/images/attractions/tamil-nadu/chennai.jpg",
      "/images/attractions/tamil-nadu/madurai.jpg",
      "/images/attractions/tamil-nadu/ooty.jpg",
    ],
    description:
      "Land of temples and rich cultural heritage, known for its Dravidian-style temples and classical dance forms.",
    bestTimeToVisit: "October to March",
    rating: 4.5,
    attractions: [
      {
        name: "Chennai",
        description: "The capital city with a blend of modern and traditional elements, known for Marina Beach.",
        activities: ["Visit Marina Beach", "Explore Kapaleeshwarar Temple", "Shopping at T. Nagar"],
      },
      {
        name: "Madurai",
        description: "One of the oldest cities in India, known for the iconic Meenakshi Amman Temple.",
        activities: ["Temple visits", "Cultural performances", "Local cuisine tasting"],
      },
      {
        name: "Ooty",
        description: "A popular hill station with pleasant climate, tea gardens, and colonial architecture.",
        activities: ["Nilgiri Mountain Railway ride", "Boating in Ooty Lake", "Visit Botanical Gardens"],
      },
    ],
  },
  Uttarakhand: {
    image: "/images/destinations/uttarakhand.jpg",
    images: [
      "/images/attractions/uttarakhand/rishikesh.jpg",
      "/images/attractions/uttarakhand/nainital.jpg",
      "/images/attractions/uttarakhand/mussoorie.jpg",
    ],
    description:
      "Known as 'Devbhumi' or Land of Gods, famous for its Himalayan peaks, spiritual sites, and adventure sports.",
    bestTimeToVisit: "March to June and September to November",
    rating: 4.7,
    attractions: [
      {
        name: "Rishikesh",
        description: "The 'Yoga Capital of the World', situated on the banks of the Ganges River.",
        activities: ["Yoga and meditation", "River rafting", "Visit Beatles Ashram", "Evening Ganga Aarti"],
      },
      {
        name: "Nainital",
        description: "A charming hill station built around a uniquely shaped lake.",
        activities: ["Boating in Naini Lake", "Cable car ride to Snow View Point", "Mall Road shopping"],
      },
      {
        name: "Mussoorie",
        description: "A hill station with stunning views of the Doon Valley and Himalayan ranges.",
        activities: ["Visit Kempty Falls", "Camel's Back Road walk", "Lal Tibba viewpoint"],
      },
    ],
  },
  "Andaman & Nicobar": {
    image: "/images/destinations/andaman.jpg",
    images: [
      "/images/attractions/andaman/havelock.jpg",
      "/images/attractions/andaman/neil-island.jpg",
      "/images/attractions/andaman/port-blair.jpg",
    ],
    description: "A union territory comprising 572 islands with pristine beaches, coral reefs, and lush forests.",
    bestTimeToVisit: "November to April",
    rating: 4.9,
    attractions: [
      {
        name: "Havelock Island",
        description: "Home to some of Asia's best beaches like Radhanagar Beach.",
        activities: ["Scuba diving", "Snorkeling", "Beach relaxation", "Kayaking"],
      },
      {
        name: "Neil Island",
        description: "A smaller, less crowded island known for its natural beauty and relaxed atmosphere.",
        activities: ["Exploring natural rock formations", "Cycling around the island", "Snorkeling"],
      },
      {
        name: "Port Blair",
        description: "The capital city and gateway to the islands, known for its historical sites.",
        activities: ["Visit Cellular Jail", "Explore Anthropological Museum", "Water sports at North Bay"],
      },
    ],
  },
  Maharashtra: {
    image: "/images/destinations/maharashtra.jpg",
    images: [
      "/images/attractions/maharashtra/mumbai.jpg",
      "/images/attractions/maharashtra/ajanta-ellora.jpg",
      "/images/attractions/maharashtra/lonavala.jpg",
    ],
    description: "A state that blends modernity with tradition, known for its caves, forts, and vibrant cities.",
    bestTimeToVisit: "October to March",
    rating: 4.6,
    attractions: [
      {
        name: "Mumbai",
        description: "The financial capital of India, a bustling metropolis with colonial architecture.",
        activities: ["Visit Gateway of India", "Marine Drive stroll", "Bollywood tours", "Street food tasting"],
      },
      {
        name: "Ajanta & Ellora Caves",
        description: "UNESCO World Heritage Sites featuring rock-cut cave monuments with intricate carvings.",
        activities: ["Guided archaeological tours", "Photography", "Historical exploration"],
      },
      {
        name: "Lonavala",
        description: "A hill station in the Western Ghats, popular for its chikki (a sweet) and scenic viewpoints.",
        activities: ["Trekking to forts", "Visit Bhushi Dam", "Exploring caves", "Paragliding"],
      },
    ],
  },
  Gujarat: {
    image: "/images/destinations/gujarat.jpg",
    images: [
      "/images/attractions/gujarat/rann-of-kutch.jpg",
      "/images/attractions/gujarat/gir-forest.jpg",
      "/images/attractions/gujarat/statue-of-unity.jpg",
    ],
    description:
      "The land of legends and lions, known for its diverse landscapes, rich culture, and historical significance.",
    bestTimeToVisit: "October to March",
    rating: 4.5,
    attractions: [
      {
        name: "Rann of Kutch",
        description: "One of the largest salt deserts in the world, known for the Rann Utsav festival.",
        activities: ["Rann Utsav festival", "Desert safari", "Cultural performances", "Handicraft shopping"],
      },
      {
        name: "Gir National Park",
        description: "The last abode of the Asiatic Lion, offering unique wildlife experiences.",
        activities: ["Lion safaris", "Bird watching", "Nature walks", "Photography"],
      },
      {
        name: "Statue of Unity",
        description: "The world's tallest statue, dedicated to Sardar Vallabhbhai Patel.",
        activities: ["Viewing gallery visit", "Valley of Flowers tour", "Laser light show", "Boat ride"],
      },
    ],
  },
  Sikkim: {
    image: "/images/destinations/sikkim.jpg",
    images: [
      "/images/attractions/sikkim/gangtok.jpg",
      "/images/attractions/sikkim/tsomgo-lake.jpg",
      "/images/attractions/sikkim/yumthang-valley.jpg",
    ],
    description:
      "A small Himalayan state known for its biodiversity, Buddhist monasteries, and stunning mountain views.",
    bestTimeToVisit: "March to May and October to December",
    rating: 4.8,
    attractions: [
      {
        name: "Gangtok",
        description: "The capital city with panoramic views of Kanchenjunga, the third highest mountain in the world.",
        activities: ["MG Marg exploration", "Monastery visits", "Cable car ride", "Local cuisine tasting"],
      },
      {
        name: "Tsomgo Lake",
        description: "A glacial lake at an altitude of 12,400 ft, considered sacred by locals.",
        activities: ["Yak rides", "Photography", "Snowball fights in winter", "Visiting nearby shrines"],
      },
      {
        name: "Yumthang Valley",
        description: "Known as the 'Valley of Flowers', a nature sanctuary with hot springs and rivers.",
        activities: ["Hot spring baths", "Flower valley tours", "River-side picnics", "Trekking"],
      },
    ],
  },
}

// Testimonials data
const testimonials = [
  {
    name: "Priya Sharma",
    location: "Mumbai",
    comment:
      "The trip to Rajasthan was magical! The palaces and forts were breathtaking, and the local cuisine was delicious.",
    rating: 5,
  },
  {
    name: "Rahul Verma",
    location: "Delhi",
    comment:
      "Kerala's backwaters exceeded my expectations. The houseboat stay was peaceful and the scenery was stunning.",
    rating: 5,
  },
  {
    name: "Sarah Johnson",
    location: "USA",
    comment: "Visiting the Taj Mahal was a dream come true. India's rich history and culture are truly fascinating.",
    rating: 4,
  },
  {
    name: "Akira Tanaka",
    location: "Japan",
    comment:
      "The Andaman Islands have some of the most beautiful beaches I've ever seen. The scuba diving was incredible!",
    rating: 5,
  },
]

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
}

const slideUp = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
}

type LocationKey = keyof typeof tourismData

export function TourismPage() {
  const [selectedLocation, setSelectedLocation] = useState<LocationKey>("Delhi")
  const [selectedAttraction, setSelectedAttraction] = useState(0)
  const heroImages = [
    "/images/hero/taj-mahal.jpg",
    "/images/hero/kerala-backwaters.jpg",
    "/images/hero/himalayas.jpg",
    "/images/hero/rajasthan-palace.jpg",
  ]
  const [currentHeroImage, setCurrentHeroImage] = useState(0)

  // Auto-rotate hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [heroImages.length])

  // Function to render star ratings
  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="h-4 w-4 text-yellow-400" />
          <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>,
      )
    }

    const emptyStars = 5 - stars.length
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />)
    }

    return <div className="flex">{stars}</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-blue-50">
      {/* Header */}
      <header className="relative h-[60vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{
            backgroundImage: `url('${heroImages[currentHeroImage]}')`,
            opacity: 1,
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative h-full flex flex-col justify-center items-center text-center px-4">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-4xl md:text-6xl font-bold text-white mb-4"
          >
            Discover Incredible India
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeIn} className="text-xl text-white max-w-3xl">
            Explore the diverse landscapes, rich culture, and ancient heritage of India
          </motion.p>
          <motion.div initial="hidden" animate="visible" variants={slideUp} className="mt-8">
            {/* <Button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 text-lg">
              Start Your Journey
            </Button> */}
          </motion.div>
        </div>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentHeroImage(index)}
              className={`w-3 h-3 rounded-full ${currentHeroImage === index ? "bg-white" : "bg-white/50"}`}
            />
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Introduction */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">Welcome to the Land of Diversity</h2>
          <p className="max-w-3xl mx-auto text-muted-foreground">
            India is a land of incredible diversity, from the snow-capped Himalayas in the north to the tropical beaches
            in the south. Explore ancient temples, majestic palaces, serene backwaters, and vibrant cities. Experience
            the rich tapestry of cultures, cuisines, and traditions that make India truly unique.
          </p>
        </motion.div>

        {/* Location Selector */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={slideUp}
          className="mb-12"
        >
          <h2 className="text-2xl font-semibold mb-6 text-center">Select Your Dream Destination</h2>
          <div className="max-w-xs mx-auto">
            <Select
              value={selectedLocation}
              onValueChange={(value: string) => setSelectedLocation(value as LocationKey)}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select a location" />
              </SelectTrigger>
              <SelectContent className="bg-white text-black">
                {Object.keys(tourismData).map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Location Information */}
        {selectedLocation && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Location Overview */}
            <Card className="lg:col-span-1 overflow-hidden border-none shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {selectedLocation}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {renderStars(tourismData[selectedLocation].rating)}
                  <span className="text-sm">{tourismData[selectedLocation].rating}/5</span>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="aspect-video overflow-hidden">
                  <Image
                    src={tourismData[selectedLocation].image || "/placeholder.svg"}
                    alt={selectedLocation}
                    className="w-full h-full object-cover"
                    width={500}
                    height={300}
                  />
                </div>
                <div className="p-6">
                  <p className="text-muted-foreground mb-4">{tourismData[selectedLocation].description}</p>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-medium">Best Time to Visit:</span>
                      <span className="text-sm">{tourismData[selectedLocation].bestTimeToVisit}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Plane className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-medium">Major Airport:</span>
                      <span className="text-sm">{selectedLocation} International Airport</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 flex flex-wrap gap-2 justify-center">
                <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 border border-orange-800">
                  <Camera className="h-3 w-3 mr-1" />
                  Photography
                </Badge>
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                  <Utensils className="h-3 w-3 mr-1" />
                  Cuisine
                </Badge>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border border-green-800">
                  <Users className="h-3 w-3 mr-1" />
                  Culture
                </Badge>
              </CardFooter>
            </Card>

            {/* Attractions */}
            <Card className="lg:col-span-2 border-none shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                <CardTitle>Top Attractions</CardTitle>
                <CardDescription className="text-white/80">
                  Discover the must-visit places in {selectedLocation}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs
                  defaultValue="0"
                  value={selectedAttraction.toString()}
                  onValueChange={(value: string) => setSelectedAttraction(Number.parseInt(value))}
                >
                  <TabsList className="grid grid-cols-3 mb-6">
                    {tourismData[selectedLocation].attractions.map((attraction, index) => (
                      <TabsTrigger key={index} value={index.toString()}>
                        {attraction.name.split(" ")[0]}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {tourismData[selectedLocation].attractions.map((attraction, index) => (
                    <TabsContent key={index} value={index.toString()}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <h3 className="text-xl font-semibold">{attraction.name}</h3>
                        <p>{attraction.description}</p>

                        <div className="mt-6">
                          <h4 className="text-lg font-medium mb-3 flex items-center gap-2">
                            <Compass className="h-5 w-5 text-primary" />
                            Things to Do
                          </h4>
                          <ul className="space-y-3">
                            {attraction.activities.map((activity, actIndex) => (
                              <li
                                key={actIndex}
                                className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                              >
                                <span className="bg-primary/10 text-primary p-1.5 rounded-full mt-0.5">
                                  <Heart className="h-4 w-4" />
                                </span>
                                <span>{activity}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Photo Gallery */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={slideUp}
          className="mt-20"
        >
          <h2 className="text-3xl font-bold text-center mb-10">Glimpses of India</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="grid gap-4">
              <div className="overflow-hidden rounded-lg">
                <Image
                  src="/images/gallery/taj-mahal.jpg"
                  alt="Taj Mahal"
                  width={500}
                  height={300}
                  className="h-full w-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="overflow-hidden rounded-lg">
                <Image
                  src="/images/gallery/kerala-backwaters.jpg"
                  alt="Kerala Backwaters"
                  width={500}
                  height={300}
                  className="h-full w-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>
            <div className="grid gap-4">
              <div className="overflow-hidden rounded-lg">
                <Image
                  src="/images/gallery/varanasi.jpg"
                  alt="Varanasi Ghats"
                  width={500}
                  height={300}
                  className="h-full w-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="overflow-hidden rounded-lg">
                <Image
                  src="/images/gallery/rajasthan-fort.jpg"
                  alt="Rajasthan Fort"
                  width={500}
                  height={300}
                  className="h-full w-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="overflow-hidden rounded-lg">
                <Image
                  src="/images/gallery/goa-beaches.jpg"
                  alt="Goa Beaches"
                  width={500}
                  height={300}
                  className="h-full w-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>
            <div className="grid gap-4">
              <div className="overflow-hidden rounded-lg">
                <Image
                  src="/images/gallery/himalayas.jpg"
                  alt="Himalayan Mountains"
                  width={500}
                  height={300}
                  className="h-full w-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="overflow-hidden rounded-lg">
                <Image
                  src="/images/gallery/andaman-islands.jpg"
                  alt="Andaman Islands"
                  width={500}
                  height={300}
                  className="h-full w-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="overflow-hidden rounded-lg">
                <Image
                  src="/images/gallery/delhi-red-fort.jpg"
                  alt="Delhi Red Fort"
                  width={500}
                  height={300}
                  className="h-full w-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>
            <div className="grid gap-4">
              <div className="overflow-hidden rounded-lg">
                <Image
                  src="/images/gallery/mysore-palace.jpg"
                  alt="Mysore Palace"
                  width={500}
                  height={300}
                  className="h-full w-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="overflow-hidden rounded-lg">
                <Image
                  src="/images/gallery/rann-of-kutch.jpg"
                  alt="Rann of Kutch"
                  width={500}
                  height={300}
                  className="h-full w-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="overflow-hidden rounded-lg">
                <Image
                  src="/images/gallery/sikkim-valley.jpg"
                  alt="Sikkim Valley"
                  width={500}
                  height={300}
                  className="h-full w-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Testimonials */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={slideUp}
          className="mt-20"
        >
          <h2 className="text-3xl font-bold text-center mb-10">What Travelers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <MapPinned className="h-3 w-3" />
                        {testimonial.location}
                      </CardDescription>
                    </div>
                    <div className="flex">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground italic">{`"${testimonial.comment}"`}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* Additional Information */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={slideUp}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card className="border-none shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
              <CardTitle>Travel Tips</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="bg-green-100 text-green-800 p-1 rounded-full mt-0.5">
                    <Calendar className="h-4 w-4" />
                  </span>
                  <span>Best time to visit India is from October to March</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-green-100 text-green-800 p-1 rounded-full mt-0.5">
                    <Utensils className="h-4 w-4" />
                  </span>
                  <span>Try local cuisine but be cautious with street food</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-green-100 text-green-800 p-1 rounded-full mt-0.5">
                    <Plane className="h-4 w-4" />
                  </span>
                  <span>Book domestic flights in advance for better rates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-green-100 text-green-800 p-1 rounded-full mt-0.5">
                    <Info className="h-4 w-4" />
                  </span>
                  <span>Respect local customs and dress modestly at religious sites</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
              <CardTitle>Cultural Experiences</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="bg-purple-100 text-purple-800 p-1 rounded-full mt-0.5">
                    <Users className="h-4 w-4" />
                  </span>
                  <span>Attend traditional dance performances like Kathakali</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-purple-100 text-purple-800 p-1 rounded-full mt-0.5">
                    <Utensils className="h-4 w-4" />
                  </span>
                  <span>Take a cooking class to learn authentic Indian recipes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-purple-100 text-purple-800 p-1 rounded-full mt-0.5">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <span>Visit local markets and handicraft centers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-purple-100 text-purple-800 p-1 rounded-full mt-0.5">
                    <Calendar className="h-4 w-4" />
                  </span>
                  <span>Participate in festivals like Holi or Diwali if possible</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
              <CardTitle>Transportation</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="bg-blue-100 text-blue-800 p-1 rounded-full mt-0.5">
                    <Plane className="h-4 w-4" />
                  </span>
                  <span>Major cities are connected by domestic flights</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-blue-100 text-blue-800 p-1 rounded-full mt-0.5">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <span>Trains offer a scenic way to travel between cities</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-blue-100 text-blue-800 p-1 rounded-full mt-0.5">
                    <MapPinned className="h-4 w-4" />
                  </span>
                  <span>Use ride-sharing apps or pre-paid taxis in cities</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-blue-100 text-blue-800 p-1 rounded-full mt-0.5">
                    <Info className="h-4 w-4" />
                  </span>
                  <span>Consider hiring a driver for remote locations</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.section>

        {/* Call to Action */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="mt-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-8 md:p-12 text-white text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Experience India?</h2>
          <p className="max-w-2xl mx-auto mb-8">
            Start planning your journey to discover the incredible diversity, rich culture, and breathtaking landscapes
            of India.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={()=>window.location.href = "/plan-your-trip"} className="bg-white text-orange-600 hover:bg-gray-100">Plan Your Trip</Button>
            <Button onClick={() => window.location.href = "/contact"} className="border border-white text-white hover:bg-white/20">
  Contact a Travel Expert
</Button>

          </div>
        </motion.section>
      </main>
{/* 
      Footer
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold mb-4">Incredible India</h3>
            <p className="text-gray-300">
              Discover the diversity, culture, and heritage of India through our comprehensive travel guide.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Destinations</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#" className="hover:text-white">
                  North India
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  South India
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  East India
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  West India
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Central India
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Travel Resources</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#" className="hover:text-white">
                  Travel Guides
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Visa Information
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Transportation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Accommodation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  FAQs
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2">Subscribe to our newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-3 py-2 bg-gray-800 text-white rounded-l-md focus:outline-none focus:ring-1 focus:ring-orange-500 w-full"
                />
                <Button className="rounded-l-none bg-orange-600 hover:bg-orange-700">Subscribe</Button>
              </div>
            </div>
          </div>
        </div> */}
      <Footer>
        <div className="max-w-7xl mx-auto px-4 pt-8 mt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Incredible India Tourism. All rights reserved.</p>
        </div>
      </Footer>
    </div>
  )
}

