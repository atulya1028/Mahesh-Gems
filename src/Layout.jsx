import { Outlet, Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "./assets/images/mg-logo.png";
import Footer from "./Footer";

const Layout = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 z-50 w-full bg-white shadow-lg font-montserrat">
        <div className="container flex items-center justify-between p-5 mx-auto">
          {/* Logo */}
          <Link to="/">
            <img 
              src={logo} 
              alt="Mahesh Gems" 
              className="w-[150px] h-[75px] md:w-[200px] md:h-[100px] animate-fade" 
            />
          </Link>

          {/* Mobile Menu Toggle */}
          <button 
            className="block p-2 text-gray-900 md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={30} /> : <Menu size={30} />}
          </button>

          {/* Navigation Links */}
          <ul className={`md:flex md:items-center md:space-x-6 absolute md:static left-0 top-16 w-full bg-white md:w-auto md:bg-transparent shadow-md md:shadow-none transition-all duration-300 ease-in-out ${
            isOpen ? "block" : "hidden md:flex"
          }`}>
            <li className="border-b md:border-none">
              <Link to="/" className="block p-4 text-sm md:p-3 hover:text-indigo-600 md:text-base">Home</Link>
            </li>
            <li className="border-b md:border-none">
              <Link to="/jewelry" className="block p-4 text-sm md:p-3 hover:text-indigo-600 md:text-base">Jewelry</Link>
            </li>
            <li className="border-b md:border-none">
              <Link to="/about" className="block p-4 text-sm md:p-3 hover:text-indigo-600 md:text-base">About Us</Link>
            </li>
            <li className="border-b md:border-none">
              <Link to="/contact" className="block p-4 text-sm md:p-3 hover:text-indigo-600 md:text-base">Contact Us</Link>
            </li>
            <li className="border-b md:border-none">
              <Link to="/location" className="block p-4 text-sm md:p-3 hover:text-indigo-600 md:text-base">Location</Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Push content down to avoid navbar overlap */}
      <div className="pt-[100px]">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
