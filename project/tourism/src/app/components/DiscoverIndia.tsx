import Image from 'next/image';

const regions = [
  {
    name: 'North India',
    image: '/images/destinations/north/delhi.jpg',
    destinations: ['Delhi', 'Agra', 'Jaipur']
  },
  {
    name: 'South India',
    image: '/images/destinations/south/chennai.jpg',
    destinations: ['Chennai', 'Bangalore', 'Hyderabad']
  },
  {
    name: 'East India',
    image: '/images/destinations/east/kolkata.jpg',
    destinations: ['Kolkata', 'Darjeeling', 'Gangtok']
  },
  {
    name: 'West India',
    image: '/images/destinations/west/mumbai.jpg',
    destinations: ['Mumbai', 'Goa', 'Ahmedabad']
  }
];

export function DiscoverIndia() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {regions.map((region) => (
        <div key={region.name} className="relative overflow-hidden rounded-xl">
          <Image
            src={region.image}
            alt={region.name}
            width={600}
            height={400}
            className="object-cover w-full h-[400px]"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6">
            <h3 className="text-white text-2xl font-bold mb-2">{region.name}</h3>
            <div className="flex flex-wrap gap-2">
              {region.destinations.map((destination) => (
                <span 
                  key={destination}
                  className="bg-white/20 text-white px-3 py-1 rounded-full text-sm"
                >
                  {destination}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}