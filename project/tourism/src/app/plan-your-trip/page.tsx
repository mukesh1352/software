// src/app/plan-your-trip/page.tsx
'use client';

import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { CalendarIcon, StarIcon, MapPinIcon, UtensilsIcon, ShoppingBagIcon, MoonIcon, SunIcon, HotelIcon, PlaneIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
import { Badge } from '../components/ui/badge';
import { Slider } from '../components/ui/slider';
import { toast } from '../components/ui/use-toast';
// import { Skeleton } from '../components/ui/skeleton';

const INTERESTS = [
  'Beaches', 'Mountains', 'City Tours', 'Historical Sites',
  'Adventure', 'Food & Dining', 'Shopping', 'Nightlife',
  'Family Friendly', 'Romantic', 'Wildlife', 'Wellness'
] as const;

type Interest = typeof INTERESTS[number];

interface Activity {
  time: string;
  title: string;
  description: string;
  cost?: number;
  duration?: string;
  icon?: string;
}

interface Hotel {
  name: string;
  rating: number;
  price: number;
  type: string;
  amenities: string[];
  description?: string;
}

interface Restaurant {
  name: string;
  type: string;
  cuisine: string;
  cost: number;
  specialty: string;
}

interface Recommendation {
  destination: string;
  description: string;
  itinerary: {
    day: number;
    activities: Activity[];
  }[];
  hotels: Hotel[];
  restaurants: Restaurant[];
  totalEstimatedCost: number;
  perPersonCost: number;
}

export default function PlanYourTrip() {
  const [step, setStep] = useState(1);
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState<{ from?: Date; to?: Date }>({});
  const [travelers, setTravelers] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);
  const [budget, setBudget] = useState([2000]);
  const [recommendations, setRecommendations] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInterestToggle = (interest: Interest) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(item => item !== interest)
        : [...prev, interest]
    );
  };

  const fetchRecommendations = async () => {
    if (!destination || !date.from || !date.to) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destination,
          interests: selectedInterests,
          budget: budget[0],
          travelers,
          duration: date.from && date.to ? 
            Math.ceil((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24)) + 1 : 
            3 // Default to 3 days
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to get recommendations: ${response.statusText}`);
      }

      const data = await response.json();
      setRecommendations(data);
      setStep(4);
      toast({
        title: "Success!",
        description: "Your personalized itinerary is ready.",
      });
    } catch (error) {
      console.error('Recommendation error:', error);
      toast({
        title: "Error",
        description: error instanceof Error 
          ? error.message 
          : "Failed to generate recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateDuration = () => {
    if (!date.from || !date.to) return 'Not specified';
    const days = Math.ceil((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return `${days} day${days > 1 ? 's' : ''}`;
  };

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case 'Morning':
        return <SunIcon className="h-5 w-5 text-amber-500" />;
      case 'Afternoon':
        return <UtensilsIcon className="h-5 w-5 text-emerald-500" />;
      case 'Evening':
        return <MoonIcon className="h-5 w-5 text-indigo-500" />;
      case 'Shopping':
        return <ShoppingBagIcon className="h-5 w-5 text-rose-500" />;
      default:
        return <MapPinIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-7xl">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-primary rounded-full px-6 py-2 mb-6">
          <PlaneIcon className="h-5 w-5 text-white mr-2" />
          <span className="text-white text-sm font-medium">Travel Planner</span>
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-4">
          Craft Your Dream Vacation
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Personalized travel itineraries tailored to your unique preferences and style
        </p>
      </div>
      
      {/* Progress Stepper */}
      <div className="flex justify-between mb-16 max-w-3xl mx-auto relative">
        <div className="absolute top-5 left-0 right-0 h-2 bg-muted/30 -z-10 mx-12 rounded-full">
          <div 
            className="h-full bg-gradient-to-r from-primary to-blue-600 transition-all duration-500 ease-in-out rounded-full" 
            style={{ width: `${(step - 1) * 33.33}%` }}
          ></div>
        </div>
        {[1, 2, 3, 4].map((stepNumber) => (
          <div key={stepNumber} className="flex flex-col items-center z-10">
            <div 
              className={`w-14 h-14 rounded-full flex items-center justify-center border-4 transition-all duration-300 shadow-md
                ${step >= stepNumber ? 'border-primary/20 bg-background text-primary' : 'border-muted/30 bg-background text-muted-foreground'}
                ${step === stepNumber ? 'scale-110 shadow-lg ring-4 ring-primary/20' : ''}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                ${step >= stepNumber ? 'bg-gradient-to-br from-primary to-blue-600 text-white' : 'bg-muted text-muted-foreground'}`}>
                {stepNumber}
              </div>
            </div>
            <span className={`text-sm mt-3 font-medium ${step === stepNumber ? 'text-primary' : 'text-muted-foreground'}`}>
              {stepNumber === 1 && 'Destination'}
              {stepNumber === 2 && 'Dates'}
              {stepNumber === 3 && 'Preferences'}
              {stepNumber === 4 && 'Itinerary'}
            </span>
          </div>
        ))}
      </div>

      {/* Main Card */}
      <Card className="p-8 mx-auto shadow-xl rounded-2xl border-0 bg-gradient-to-br from-background to-muted/10">
        {/* Step 1: Destination */}
        {step === 1 && (
          <div className="space-y-10">
            <div>
              <h2 className="text-3xl font-bold mb-3">Where does your dream take you?</h2>
              <p className="text-lg text-muted-foreground">Discover your perfect destination</p>
            </div>
            
            <div className="space-y-8">
              <div>
                <Label htmlFor="destination" className="mb-3 block font-medium text-lg">Destination *</Label>
                <div className="relative">
                  <Input
                    id="destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Search destinations..."
                    className="h-14 text-lg pl-12 rounded-xl border-2 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    required
                  />
                  <MapPinIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-4 text-muted-foreground text-lg">Popular Destinations</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {['Hyderabad', 'Goa', 'Kerala', 'Rajasthan', 'Himachal', 'Kashmir'].map((place) => (
                    <Button
                      key={place}
                      variant={destination === place ? 'default' : 'outline'}
                      onClick={() => setDestination(place)}
                      className={`h-16 text-lg transition-all rounded-xl ${destination === place ? 'shadow-md' : 'hover:bg-accent/50'}`}
                    >
                      {destination === place && <MapPinIcon className="h-5 w-5 mr-2" />}
                      {place}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Dates */}
        {step === 2 && (
          <div className="space-y-10">
            <div>
              <h2 className="text-3xl font-bold mb-3">When will your adventure begin?</h2>
              <p className="text-lg text-muted-foreground">Select your travel dates and companions</p>
            </div>
            
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <Label className="mb-3 block font-medium text-lg">Travel Dates *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full h-14 justify-start text-left font-normal text-lg rounded-xl border-2 pl-12",
                          !date.from && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="absolute left-4 h-6 w-6" />
                        {date.from ? (
                          date.to ? (
                            <>
                              {format(date.from, "LLL dd, y")} -{" "}
                              {format(date.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(date.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick a date range</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-2xl shadow-xl" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date.from}
                        selected={{
                          from: date.from,
                          to: date.to
                        }}
                        onSelect={(range) => {
                          if (range?.from && range?.to) {
                            setDate({ from: range.from, to: range.to });
                          } else if (range?.from) {
                            setDate({ from: range.from });
                          } else {
                            setDate({});
                          }
                        }}
                        numberOfMonths={2}
                        disabled={{ before: new Date() }}
                        className="rounded-2xl"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="travelers" className="mb-3 block font-medium text-lg">Number of Travelers *</Label>
                  <div className="relative">
                    <Input
                      id="travelers"
                      type="number"
                      min="1"
                      max="20"
                      value={travelers}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        setTravelers(isNaN(value) ? 1 : Math.max(1, Math.min(20, value)));
                      }}
                      className="h-14 text-lg pl-12 rounded-xl border-2"
                      required
                    />
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground text-lg">👥</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Preferences */}
        {step === 3 && (
          <div className="space-y-10">
            <div>
              <h2 className="text-3xl font-bold mb-3">What makes your heart race?</h2>
              <p className="text-lg text-muted-foreground">Tell us about your travel preferences</p>
            </div>
            
            <div className="space-y-10">
              <div>
                <Label className="mb-4 block font-medium text-lg">Your Interests *</Label>
                <div className="flex flex-wrap gap-3">
                  {INTERESTS.map((interest) => (
                    <Button
                      key={interest}
                      variant={selectedInterests.includes(interest) ? 'default' : 'outline'}
                      onClick={() => handleInterestToggle(interest)}
                      className={`rounded-xl px-5 py-3 text-base transition-all ${
                        selectedInterests.includes(interest) 
                          ? 'shadow-md' 
                          : 'hover:bg-accent/50 hover:shadow-sm'
                      }`}
                    >
                      {interest}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="mb-4 block font-medium text-lg">Daily Budget (per person)</Label>
                <div className="space-y-8">
                  <Slider
                    value={budget}
                    onValueChange={(value) => setBudget(value)}
                    min={500}
                    max={10000}
                    step={500}
                    className="w-full [&>div>div]:h-2 [&>div>div]:bg-primary/20 [&>div>div>div]:bg-gradient-to-r from-primary to-blue-600"
                  />
                  <div className="flex justify-between items-center px-2">
                    <span className="text-lg font-medium text-muted-foreground">Budget Range:</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                      ₹{budget[0].toLocaleString()} - ₹{(budget[0] + 2000).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Results */}
        {step === 4 && (
          <div>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary/10 to-blue-100 flex items-center justify-center">
                    <PlaneIcon className="h-10 w-10 text-primary animate-bounce" />
                  </div>
                  <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
                </div>
                <h3 className="text-2xl font-bold">Crafting Your Journey</h3>
                <p className="text-muted-foreground text-lg">We&#39;re creating your perfect itinerary</p>
              </div>
            ) : recommendations ? (
              <div className="space-y-14">
                {/* Header */}
                <div className="text-center">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-4">
                    {recommendations.destination} Adventure
                  </h2>
                  <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    {recommendations.description}
                  </p>
                </div>
                
                {/* Summary Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                  <Card className="p-5 hover:shadow-lg transition-shadow bg-gradient-to-br from-background to-primary/5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-primary/10 text-primary p-2 rounded-lg">
                        <CalendarIcon className="h-6 w-6" />
                      </div>
                      <h4 className="font-medium text-lg text-muted-foreground">Travel Dates</h4>
                    </div>
                    <p className="text-xl font-semibold">
                      {date.from ? format(date.from, 'PP') : 'Not set'} - {date.to ? format(date.to, 'PP') : 'Not set'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Duration: {calculateDuration()}
                    </p>
                  </Card>
                  
                  <Card className="p-5 hover:shadow-lg transition-shadow bg-gradient-to-br from-background to-blue-50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                        <span className="text-lg">👥</span>
                      </div>
                      <h4 className="font-medium text-lg text-muted-foreground">Travelers</h4>
                    </div>
                    <p className="text-xl font-semibold">
                      {travelers} {travelers === 1 ? 'person' : 'people'}
                    </p>
                  </Card>
                  
                  <Card className="p-5 hover:shadow-lg transition-shadow bg-gradient-to-br from-background to-emerald-50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-emerald-100 text-emerald-600 p-2 rounded-lg">
                        <StarIcon className="h-6 w-6" />
                      </div>
                      <h4 className="font-medium text-lg text-muted-foreground">Interests</h4>
                    </div>
                    <p className="text-xl font-semibold line-clamp-2">
                      {selectedInterests.join(', ') || 'None selected'}
                    </p>
                  </Card>
                  
                  <Card className="p-5 hover:shadow-lg transition-shadow bg-gradient-to-br from-background to-amber-50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-amber-100 text-amber-600 p-2 rounded-lg">
                        <span className="text-lg">💰</span>
                      </div>
                      <h4 className="font-medium text-lg text-muted-foreground">Budget</h4>
                    </div>
                    <p className="text-xl font-semibold">
                      ₹{budget[0].toLocaleString()}/day
                    </p>
                  </Card>
                </div>

                {/* Itinerary */}
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-3xl font-bold">Your Journey</h3>
                    <Badge variant="secondary" className="px-4 py-2 text-base">
                      {recommendations.itinerary.length} day itinerary
                    </Badge>
                  </div>
                  <div className="space-y-6">
                    {recommendations.itinerary.map((day) => (
                      <Card key={day.day} className="p-6 hover:shadow-xl transition-shadow border-0 bg-gradient-to-br from-background to-muted/10">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="bg-gradient-to-br from-primary to-blue-600 text-white h-12 w-12 rounded-full flex items-center justify-center font-bold text-lg">
                            {day.day}
                          </div>
                          <h4 className="text-2xl font-semibold">Day {day.day}</h4>
                        </div>
                        <div className="space-y-6">
                          {day.activities.map((activity, i) => (
                            <div key={i} className="flex items-start gap-5">
                              <div className="flex-shrink-0 h-14 w-14 rounded-xl bg-gradient-to-br from-primary/10 to-blue-100 flex items-center justify-center mt-1">
                                {getActivityIcon(activity.time)}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <p className="font-medium text-xl">{activity.title}</p>
                                  {activity.cost && (
                                    <Badge variant="outline" className="ml-2 px-3 py-1 text-base">
                                      ₹{activity.cost.toLocaleString()}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-muted-foreground mt-2">{activity.description}</p>
                                {activity.duration && (
                                  <div className="flex items-center gap-3 mt-3">
                                    <span className="text-sm px-3 py-1 bg-accent rounded-full flex items-center gap-1">
                                      <span className="w-2 h-2 rounded-full bg-primary"></span>
                                      {activity.duration}
                                    </span>
                                    <span className="text-sm px-3 py-1 bg-accent rounded-full flex items-center gap-1">
                                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                      {activity.time}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Hotels */}
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <HotelIcon className="h-8 w-8 text-primary" />
                    <h3 className="text-3xl font-bold">Recommended Stays</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {recommendations.hotels.map((hotel, index) => (
                      <Card key={index} className="p-6 hover:shadow-xl transition-shadow group border-0 bg-gradient-to-br from-background to-muted/5">
                        <div className="flex gap-6">
                          <div className="flex-shrink-0 w-32 h-32 bg-muted rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-all">
                            <div className="w-full h-full bg-gradient-to-br from-primary/10 to-blue-100 flex items-center justify-center">
                              <HotelIcon className="h-10 w-10 text-primary/50" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-xl">{hotel.name}</h4>
                            <div className="flex items-center mt-2 mb-3">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <StarIcon
                                  key={i}
                                  className={`h-5 w-5 ${i < hotel.rating ? 'fill-primary text-primary' : 'fill-muted text-muted-foreground'}`}
                                />
                              ))}
                              <span className="text-sm text-muted-foreground ml-2">{hotel.type}</span>
                            </div>
                            <p className="text-muted-foreground line-clamp-2 mb-4">
                              {hotel.description || hotel.amenities.join(' • ')}
                            </p>
                            <div className="flex justify-between items-center">
                              <p className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                                ₹{hotel.price.toLocaleString()}
                                <span className="text-sm font-normal text-muted-foreground ml-2">/night</span>
                              </p>
                              <Button variant="outline" size="sm" className="rounded-lg">
                                View
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Restaurants */}
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <UtensilsIcon className="h-8 w-8 text-rose-500" />
                    <h3 className="text-3xl font-bold">Dining Experiences</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-5">
                    {recommendations.restaurants.map((restaurant, index) => (
                      <Card key={index} className="p-6 hover:shadow-lg transition-shadow border-0 bg-gradient-to-br from-background to-rose-50/20">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-xl">{restaurant.name}</h4>
                            <div className="flex gap-2 mt-2 mb-3">
                              <Badge variant="secondary" className="px-3 py-1 rounded-lg">
                                {restaurant.type}
                              </Badge>
                              <Badge variant="secondary" className="px-3 py-1 rounded-lg">
                                {restaurant.cuisine}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground">{restaurant.specialty}</p>
                          </div>
                          <Badge variant="outline" className="px-4 py-2 text-lg font-medium rounded-xl">
                            ₹{restaurant.cost.toLocaleString()}
                          </Badge>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Cost Summary */}
                <Card className="p-8 bg-gradient-to-br from-primary/5 to-blue-50/50 hover:shadow-xl transition-shadow border-0">
                  <div className="flex flex-col md:flex-row justify-between items-center">
                    <div>
                      <h4 className="font-medium text-2xl mb-2">Estimated Total Cost</h4>
                      <p className="text-muted-foreground text-lg">
                        For {travelers} {travelers === 1 ? 'person' : 'people'} • {calculateDuration()}
                      </p>
                    </div>
                    <div className="text-center md:text-right mt-6 md:mt-0">
                      <p className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                        ₹{recommendations.totalEstimatedCost.toLocaleString()}
                      </p>
                      <p className="text-lg text-muted-foreground">
                        (₹{recommendations.perPersonCost.toLocaleString()} per person)
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="mx-auto w-32 h-32 bg-gradient-to-br from-muted/10 to-muted/30 rounded-full flex items-center justify-center mb-8">
                  <MapPinIcon className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-3">No Recommendations Found</h3>
                <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                  We couldn&#39;t find the perfect itinerary for your selected preferences. Try adjusting your criteria.
                </p>
                <Button 
                  onClick={() => setStep(1)} 
                  variant="default" 
                  className="px-10 py-4 text-lg rounded-xl"
                >
                  Start Over
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-14 flex justify-between">
          {step > 1 && step < 4 && (
            <Button 
              variant="outline" 
              onClick={() => setStep(step - 1)}
              className="px-8 py-4 text-lg rounded-xl"
            >
              Back
            </Button>
          )}
          {step < 3 && (
            <Button 
              onClick={() => {
                if (step === 1 && !destination) {
                  toast({
                    title: "Destination required",
                    description: "Please select a destination",
                    variant: "destructive",
                  });
                  return;
                }
                if (step === 2 && (!date.from || !date.to)) {
                  toast({
                    title: "Dates required",
                    description: "Please select travel dates",
                    variant: "destructive",
                  });
                  return;
                }
                setStep(step + 1);
              }}
              className="ml-auto px-10 py-4 text-lg rounded-xl"
            >
              Continue
            </Button>
          )}
          {step === 3 && (
            <Button 
              onClick={() => {
                if (selectedInterests.length === 0) {
                  toast({
                    title: "No interests selected",
                    description: "Please select at least one interest",
                    variant: "destructive",
                  });
                  return;
                }
                fetchRecommendations();
              }}
              disabled={loading}
              className="ml-auto px-10 py-4 text-lg rounded-xl"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-pulse">Creating</span>
                  <span className="flex gap-1">
                    <span className="animate-bounce">.</span>
                    <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                    <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
                  </span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Generate Itinerary
                  <PlaneIcon className="h-5 w-5" />
                </span>
              )}
            </Button>
          )}
          {step === 4 && !loading && (
            <div className="w-full flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => window.print()}
                className="px-8 py-4 text-lg rounded-xl"
              >
                Print Itinerary
              </Button>
              <Button 
                onClick={() => setStep(1)} 
                variant="default"
                className="px-10 py-4 text-lg rounded-xl"
              >
                Plan New Trip
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Footer */}
      <div className="text-center mt-16 text-muted-foreground">
        <p>Need help planning your trip? Contact our travel experts</p>
      </div>
    </div>
  );
}