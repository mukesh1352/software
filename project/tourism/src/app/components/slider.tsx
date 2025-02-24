"use client";

import { useEffect, useRef } from "react";

const images = [
  "/123.jpg",
  "/1.jpg",
  "/1.png",
  "sdyney.jpg",
  "/collosum.jpg",
  "/gate.jpg",
  "/kerala.jpg",
  "/rome.jpg",
  "/taj.jpg",
];

export default function ImageGallery() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let scrollAmount = 0;
    const scrollSpeed = 1.5; // Adjust for smoother flow
    const interval = setInterval(() => {
      if (containerRef.current) {
        containerRef.current.scrollLeft += scrollSpeed;
        scrollAmount += scrollSpeed;
        if (scrollAmount >= containerRef.current.scrollWidth / 2) {
          containerRef.current.scrollLeft = 0;
          scrollAmount = 0;
        }
      }
    }, 16); // ~60fps smooth animation
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-gray-900 flex items-center justify-center p-10 overflow-hidden mt-10">
      <div
        ref={containerRef}
        className="flex space-x-6 max-w-full overflow-x-auto scrollbar-hide"
        style={{ scrollBehavior: "auto", whiteSpace: "nowrap" }}
      >
        {[...images, ...images].map((img, index) => (
          <div key={index} className="overflow-hidden rounded-lg shadow-lg flex-shrink-0">
            <img
              src={img}
              alt={`Image ${index + 1}`}
              className="w-80 h-80 object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
