"use client";

import Image from 'next/image';

const destinations = [
  {
    id: 1,
    name: 'North India',
    image: '/images/destinations/north-india.jpg',
    description: 'Experience the grandeur of the Himalayas and rich cultural heritage',
    places: ['Delhi', 'Agra', 'Jaipur', 'Varanasi']
  },
  {
    id: 2,
    name: 'South India',
    image: '/images/destinations/south-india.jpg',
    description: 'Discover ancient temples and pristine coastal beauty',
    places: ['Chennai', 'Bangalore', 'Kerala', 'Hyderabad']
  },
  {
    id: 3,
    name: 'East India',
    image: '/images/destinations/east-india.jpg',
    description: 'Explore tea gardens and diverse cultural traditions',
    places: ['Kolkata', 'Darjeeling', 'Sikkim', 'Assam']
  },
  {
    id: 4,
    name: 'West India',
    image: '/images/destinations/west-india.jpg',
    description: 'Experience vibrant culture and historic architecture',
    places: ['Mumbai', 'Goa', 'Gujarat', 'Rajasthan']
  }
];

export function Destinations() {
  return (
    <section className="py-12 px-4">
      <h2 className="text-3xl font-bold text-center mb-8">Explore India by Region</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {destinations.map((destination) => (
          <div key={destination.id} className="relative group overflow-hidden rounded-xl">
            <Image
              src={destination.image}
              alt={destination.name}
              width={600}
              height={400}
              className="object-cover w-full h-[400px] transition-transform duration-300 group-hover:scale-105"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/40 p-6 flex flex-col justify-end">
              <h3 className="text-white text-2xl font-bold mb-2">{destination.name}</h3>
              <p className="text-white/90 mb-4">{destination.description}</p>
              <div className="flex flex-wrap gap-2">
                {destination.places.map((place) => (
                  <span 
                    key={place}
                    className="bg-white/20 text-white px-3 py-1 rounded-full text-sm"
                  >
                    {place}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}