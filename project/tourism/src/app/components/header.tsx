import { FaSignInAlt } from "react-icons/fa";
import Link from "next/link";

export const Header = () => {
    return (
        <header className="w-full absolute top-0 left-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6 lg:px-12">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow-lg">
                    TravelSage
                </h1>

                {/* Navigation Links */}
                <nav className="hidden md:flex space-x-8 text-lg font-medium text-white">
                    <Link href="/tourism" className="hover:text-yellow-400 transition-all duration-300">
                        Tourism
                    </Link>
                    <Link href="/hotels" className="hover:text-yellow-400 transition-all duration-300">
                        Hotels
                    </Link>
                    <Link href="/travels" className="hover:text-yellow-400 transition-all duration-300">
                        Travels
                    </Link>
                </nav>

                {/* Sign In Button */}
                <button className="flex items-center space-x-2 bg-yellow-500 text-white py-2 px-6 rounded-full text-lg font-semibold shadow-md transition-all duration-300 hover:bg-yellow-600 hover:shadow-lg hover:scale-105">
                    <FaSignInAlt className="text-xl" />
                    <Link href="/signup"><span>Sign In</span></Link>
                </button>
            </div>
        </header>
    );
};

export default Header;
