export default function Footer() {
    return (
      <footer className="bg-gray-900 text-white py-6 mt-10">
        <div className="container mx-auto flex flex-col items-center text-center">
          <p className="text-lg font-semibold">🌍 Explore the World with Us</p>
          <p className="text-sm text-gray-400 mt-2">
            © {new Date().getFullYear()} Tourism Inc. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4">
            <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white">Contact</a>
          </div>
        </div>
      </footer>
    );
  }
  