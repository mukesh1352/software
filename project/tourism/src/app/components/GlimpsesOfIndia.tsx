"use client";

import Image from 'next/image';

const landmarks = [
  {
    name: 'Taj Mahal',
    location: 'Agra',
    image: '/images/gallery/taj-mahal.jpg'
  },
  {
    name: 'Varanasi Ghats',
    location: 'Varanasi',
    image: '/images/gallery/varanasi-ghats.jpg'
  },
  {
    name: 'Himalayan Mountains',
    location: 'Himalayas',
    image: '/images/gallery/himalayan-mountains.jpg'
  },
  {
    name: 'Mysore Palace',
    location: 'Karnataka',
    image: '/images/gallery/mysore-palace.jpg'
  },
  {
    name: 'Kerala Backwaters',
    location: 'Kerala',
    image: '/images/gallery/kerala-backwaters.jpg'
  },
  {
    name: 'Rajasthan Fort',
    location: 'Rajasthan',
    image: '/images/gallery/rajasthan-fort.jpg'
  },
  {
    name: 'Goa Beaches',
    location: 'Goa',
    image: '/images/gallery/goa-beaches.jpg'
  },
  {
    name: 'Delhi Red Fort',
    location: 'Delhi',
    image: '/images/gallery/delhi-red-fort.jpg'
  },
  {
    name: 'Andaman Islands',
    location: 'Andaman',
    image: '/images/gallery/andaman-islands.jpg'
  },
  {
    name: 'Rann of Kutch',
    location: 'Gujarat',
    image: '/images/gallery/kutch-ruins.jpg'  // Updated to match your file name
  },
  {
    name: 'Sikkim Valley',
    location: 'Sikkim',
    image: '/images/gallery/sikkim-valley.jpg'
  }
];

export function GlimpsesOfIndia() {
  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8">Glimpses of India</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
        {landmarks.map((landmark) => (
          <div key={landmark.name} className="relative group overflow-hidden rounded-lg">
            <div className="aspect-w-4 aspect-h-3">
              <Image
                src={landmark.image}
                alt={landmark.name}
                width={400}
                height={300}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                priority
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
              <h3 className="text-white text-lg font-semibold">{landmark.name}</h3>
              <p className="text-white/80 text-sm">{landmark.location}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}