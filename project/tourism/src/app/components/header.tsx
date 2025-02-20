export const Header = () => {
    return (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 flex justify-between items-center shadow-lg">
            <div className="text-3xl font-semibold tracking-wide">
                TravelExplorer
            </div>
            <button className="bg-green-500 text-white py-2 px-5 rounded-lg hover:bg-green-700 transition duration-300">
                Sign In
            </button>
        </div>
    );
};

export default Header;
