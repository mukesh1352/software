import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <Image
        src="/images/landscape.jpg"
        alt="landscape"
        width={1920}
        height={1080}
      />
    </div>
      
  );
}
