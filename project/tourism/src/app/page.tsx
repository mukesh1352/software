import Image from "next/image";
import Header from "./components/header";
import Heading from "./components/mainheading";
import Slider from "./components/slider";

export default function Home() {
  return (
    <div>
      <Header />
      <Heading />
      <Slider />
    </div>
      
  );
}
