import { FaSignInAlt } from 'react-icons/fa';

export const Header = () => {
    return (
        <div className="bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 text-white py-6 px-8 flex justify-between items-center shadow-2xl ">
            <div className="text-4xl font-extrabold tracking-tight">
                TravelExplorer
            </div>
            <div className="flex items-center space-x-6">
                <button className="bg-yellow-500 text-white py-2 px-6 rounded-full text-lg font-semibold hover:bg-yellow-600 transition-all duration-300 flex items-center space-x-2">
                    <FaSignInAlt className="text-lg" />
                    <span>Sign In</span>
                </button>
            </div>
        </div>
    );
};

export default Header;
