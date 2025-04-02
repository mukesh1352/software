// src/app/plan-your-trip/page.tsx
'use client';

import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { CalendarIcon, StarIcon, MapPinIcon, UtensilsIcon, ShoppingBagIcon, MoonIcon, SunIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
import { Badge } from '../components/ui/badge';
import { Slider } from '../components/ui/slider';
import { toast } from '../components/ui/use-toast';
import { Skeleton } from '../components/ui/skeleton';

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
        return <SunIcon className="h-4 w-4" />;
      case 'Afternoon':
        return <UtensilsIcon className="h-4 w-4" />;
      case 'Evening':
        return <MoonIcon className="h-4 w-4" />;
      case 'Shopping':
        return <ShoppingBagIcon className="h-4 w-4" />;
      default:
        return <MapPinIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Plan Your Perfect Trip</h1>
      
      {/* Progress Stepper */}
      <div className="flex justify-between mb-8 max-w-2xl mx-auto">
        {[1, 2, 3, 4].map((stepNumber) => (
          <div key={stepNumber} className="flex flex-col items-center">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center 
                ${step >= stepNumber ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}
            >
              {stepNumber}
            </div>
            <span className="text-sm mt-2">
              {stepNumber === 1 && 'Destination'}
              {stepNumber === 2 && 'Dates'}
              {stepNumber === 3 && 'Preferences'}
              {stepNumber === 4 && 'Results'}
            </span>
          </div>
        ))}
      </div>

      <Card className="p-6 max-w-4xl mx-auto">
        {/* Step 1: Destination */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Where do you want to go?</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="destination">Destination *</Label>
                <Input
                  id="destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Search destinations..."
                  required
                />
              </div>
              
              <div className="mt-4">
                <h3 className="font-medium mb-3">Popular Destinations</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {['Hyderabad', 'Goa', 'Kerala', 'Rajasthan', 'Himachal', 'Kashmir'].map((place) => (
                    <Button
                      key={place}
                      variant={destination === place ? 'default' : 'outline'}
                      onClick={() => setDestination(place)}
                      className="h-auto py-2"
                    >
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
          <div>
            <h2 className="text-xl font-semibold mb-6">When are you traveling?</h2>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Travel Dates *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date.from && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
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
                    <PopoverContent className="w-auto p-0" align="start">
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
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="travelers">Number of Travelers *</Label>
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
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Preferences */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Your Travel Preferences</h2>
            <div className="space-y-6">
              <div>
                <Label>Interests (Select at least one)</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {INTERESTS.map((interest) => (
                    <Badge
                      key={interest}
                      variant={selectedInterests.includes(interest) ? 'default' : 'outline'}
                      className="cursor-pointer hover:bg-primary/80"
                      onClick={() => handleInterestToggle(interest)}
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <Label>Daily Budget (per person)</Label>
                <div className="mt-4 space-y-4">
                  <Slider
                    value={budget}
                    onValueChange={(value) => setBudget(value)}
                    min={500}
                    max={10000}
                    step={500}
                    className="w-full"
                  />
                  <div className="text-center">
                    ₹{budget[0].toLocaleString()} - ₹{(budget[0] + 2000).toLocaleString()}
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
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
                <p>Creating your personalized itinerary...</p>
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            ) : recommendations ? (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold">{recommendations.destination} Itinerary</h2>
                  <p className="text-muted-foreground mt-2">{recommendations.description}</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Travel Dates</h4>
                    <p>
                      {date.from ? format(date.from, 'PPP') : 'Not set'} to {date.to ? format(date.to, 'PPP') : 'Not set'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Duration: {calculateDuration()}
                    </p>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Travelers</h4>
                    <p>{travelers} {travelers === 1 ? 'person' : 'people'}</p>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Interests</h4>
                    <p>{selectedInterests.join(', ') || 'None selected'}</p>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Budget</h4>
                    <p>₹{budget[0].toLocaleString()} - ₹{(budget[0] + 2000).toLocaleString()} per day</p>
                  </Card>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Recommended Itinerary</h3>
                  <div className="space-y-6">
                    {recommendations.itinerary.map((day) => (
                      <Card key={day.day} className="p-6">
                        <h4 className="text-lg font-semibold mb-4">Day {day.day}</h4>
                        <div className="space-y-4">
                          {day.activities.map((activity, i) => (
                            <div key={i} className="flex items-start gap-3">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                {getActivityIcon(activity.time)}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <p className="font-medium">{activity.title}</p>
                                  {activity.cost && (
                                    <Badge variant="outline" className="ml-2">
                                      ₹{activity.cost.toLocaleString()}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">{activity.description}</p>
                                {activity.duration && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Duration: {activity.duration}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Recommended Hotels</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {recommendations.hotels.map((hotel, index) => (
                      <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                        <div className="flex gap-4">
                          <div className="flex-shrink-0 w-24 h-24 bg-muted rounded-md overflow-hidden">
                            <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs text-center">Hotel Image</span>
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{hotel.name}</h4>
                            <div className="flex items-center mt-1 mb-2">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <StarIcon
                                  key={i}
                                  className={`h-4 w-4 ${i < hotel.rating ? 'fill-primary' : 'fill-muted'}`}
                                />
                              ))}
                              <span className="text-xs text-muted-foreground ml-2">{hotel.type}</span>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {hotel.description || hotel.amenities.join(' • ')}
                            </p>
                            <p className="text-sm mt-2">
                              <span className="font-medium">₹{hotel.price.toLocaleString()}</span> per night
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Dining Options</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {recommendations.restaurants.map((restaurant, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium">{restaurant.name}</h4>
                            <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
                            <p className="text-sm mt-1">{restaurant.specialty}</p>
                          </div>
                          <Badge variant="outline" className="h-fit">
                            ₹{restaurant.cost.toLocaleString()}
                          </Badge>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <Card className="p-6 bg-primary/5 border-primary/20">
                  <div className="flex flex-col md:flex-row justify-between items-center">
                    <div>
                      <h4 className="font-medium">Estimated Total Cost</h4>
                      <p className="text-sm text-muted-foreground">
                        For {travelers} {travelers === 1 ? 'person' : 'people'} • {calculateDuration()}
                      </p>
                    </div>
                    <p className="text-2xl font-bold mt-2 md:mt-0">
                      ₹{recommendations.totalEstimatedCost.toLocaleString()}
                      <span className="text-sm font-normal text-muted-foreground ml-2">
                        (₹{recommendations.perPersonCost.toLocaleString()} per person)
                      </span>
                    </p>
                  </div>
                </Card>
              </div>
            ) : (
              <div className="text-center py-12">
                <p>No recommendations found. Please try again.</p>
                <Button 
                  onClick={() => setStep(1)} 
                  variant="outline" 
                  className="mt-4"
                >
                  Start Over
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          {step > 1 && step < 4 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
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
              className="ml-auto"
            >
              Next
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
              className="ml-auto"
            >
              {loading ? (
                <>
                  <span className="animate-pulse">Generating</span>
                  <span className="ml-1 animate-bounce">...</span>
                </>
              ) : 'Generate Recommendations'}
            </Button>
          )}
          {step === 4 && !loading && (
            <div className="w-full flex justify-between">
              <Button variant="outline" onClick={() => window.print()}>
                Print Itinerary
              </Button>
              <Button onClick={() => setStep(1)} variant="outline">
                Plan Another Trip
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}