export const Heading = () => {
    return (
        <div 
            className="h-80 w-full flex items-center justify-center"
            style={{ backgroundImage: 'url(/rome.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', boxShadow: 'inset 0 0 0 1000px rgba(0,0,0,0.3)' }}
        >
            <div className="relative w-1/2 max-w-lg">
                <input 
                    type="text" 
                    placeholder="Search for destinations..." 
                    className="w-full p-4 pl-10 rounded-full bg-white shadow-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <i className="fas fa-search"></i>
                </span>
            </div>
        </div>
    );
};

export default Heading;
