"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

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

// const images = [
//   "https://981tvm9u6x.ufs.sh/f/gW8fFvPNxHJ4VJvloAdFhuH25Swg0aMekQyGxnKJCRUF3B96",
//   "https://981tvm9u6x.ufs.sh/f/gW8fFvPNxHJ4qh1i6cpLlZ64EJHNRjkvW7UQnosdKgGxze0C",
//   "https://981tvm9u6x.ufs.sh/f/gW8fFvPNxHJ4wYCNVaq34XDkW0FHn2Ibd9UlyP8ZKQ6sargG",
//   "https://981tvm9u6x.ufs.sh/f/gW8fFvPNxHJ4Ouj1fUviSrmxhUwLPoJuGqXgzRyctbnj1MWT",
//   "https://981tvm9u6x.ufs.sh/f/gW8fFvPNxHJ4VJGGBXNFhuH25Swg0aMekQyGxnKJCRUF3B96",
//   "https://981tvm9u6x.ufs.sh/f/gW8fFvPNxHJ4j2WCItfFucZGBK9qaMhAXk8UPz5f47Hsp620",
//   "https://981tvm9u6x.ufs.sh/f/gW8fFvPNxHJ4FczoTL78qAoGIhisRfV24vPTZ0LWjCF1EMlm",
//   "https://981tvm9u6x.ufs.sh/f/gW8fFvPNxHJ4nUjioK8LdPZtk8rKSvzROaB9IMEs5TVnjoJg",
// ];

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
        {[...images, ...images].map((imgSrc, index) => (
          <div key={index} className="relative w-80 h-80 overflow-hidden rounded-lg shadow-lg flex-shrink-0">
            <Image
              src={imgSrc}
              alt={`Image ${index + 1}`}
              fill
              className="object-cover transition-transform duration-100 hover:scale-105"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
