import Image from 'next/image';
import { useState, type ComponentProps } from 'react';

export function ImageWithFallback({
  src,
  alt,
  ...props
}: {
  src: string;
  alt: string;
} & Omit<ComponentProps<typeof Image>, 'src' | 'alt'>) {
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
