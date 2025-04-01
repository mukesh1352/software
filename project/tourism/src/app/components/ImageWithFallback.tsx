import Image from 'next/image';
import { useState } from 'react';

export function ImageWithFallback({
  src,
  alt,
  ...props
}: {
  src: string;
  alt: string;
  [key: string]: any;
}) {
  const [error, setError] = useState(false);

  return (
    <Image
      {...props}
      src={error ? '/images/placeholder.jpg' : src}
      alt={alt}
      onError={() => setError(true)}
    />
  );
}