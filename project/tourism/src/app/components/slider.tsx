"use client";

import { useEffect, useRef } from "react";

const images = [
  "/123.jpg",
  "/1.jpg",
  "/1.png",
  "/sdyney.jpg",
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
    const scrollSpeed = 1; // Adjust speed if needed
    const interval = setInterval(() => {
      if (containerRef.current) {
        containerRef.current.scrollLeft += scrollSpeed;
        scrollAmount += scrollSpeed;

        if (scrollAmount >= containerRef.current.scrollWidth / 4) {
          containerRef.current.scrollLeft = 0;
          scrollAmount = 0;
        }
      }
    }, 16);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex items-center justify-center p-1 overflow-hidden mt-3 bg-white">
      <div
        ref={containerRef}
        className="flex space-x-6 max-w-full overflow-x-auto hide-scrollbar"
        style={{ scrollBehavior: "auto", whiteSpace: "nowrap" }}
      >
        {[...images, ...images].map((img, index) => (
          <div key={index} className="overflow-hidden rounded-lg shadow-lg flex-shrink-0">
            <img
              src={img}
              alt={`Image ${index + 1}`}
              className="w-80 h-80 object-cover transition-transform duration-100 hover:scale-105"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
