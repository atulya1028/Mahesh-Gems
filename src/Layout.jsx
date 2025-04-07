import { Outlet, Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "./assets/images/mg-logo.png";
import Footer from "./Footer";

const Layout = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col">
      <br /> <br /> <br />
      {/* Navbar */}
      <nav className="fixed top-0 left-0 z-50 w-full bg-white shadow-sm font-montserrat">
        <div className="container flex items-center justify-between p-2 mx-auto">
          {/* Logo */}
          <Link to="/">
            <img 
              src={logo} 
              alt="Mahesh Gems" 
              className="w-[120px] h-[60px] md:w-[200px] md:h-[120px] animate-fade" 
            />
          </Link>

          {/* Mobile Menu Toggle */}
          <button 
            className="block p-1 text-gray-900 md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "" : <Menu size={24} />}
          </button>

          {/* Navigation Links */}
          <ul className={`md:flex md:items-center md:space-x-4 absolute md:static left-0 top-12 w-full bg-white md:w-auto md:bg-transparent shadow-md md:shadow-none transition-all duration-300 ease-in-out ${
            isOpen ? "block" : "hidden md:flex"
          }`}>
            {/* Close Button inside the Sidebar */}
            {isOpen && (
              <button 
                className="absolute p-2 text-gray-900 top-3 right-3 md:hidden"
                onClick={() => setIsOpen(false)}
              >
                <X size={24} className="text-red-600" />
              </button>
            )}

            <li className="border-b md:border-none">
              <Link to="/" className="block p-2 text-base md:p-2 hover:bg-[rgb(212,166,75)] md:text-lg hover:rounded-md hover:text-white" onClick={() => setIsOpen(false)}>Home</Link>
            </li>
            <li className="border-b md:border-none">
              <Link to="/jewelry" className="block p-2 text-base md:p-2 hover:bg-[rgb(212,166,75)] md:text-lg hover:rounded-md hover:text-white" onClick={() => setIsOpen(false)}>Jewelry</Link>
            </li>
            <li className="border-b md:border-none">
              <Link to="/about" className="block p-2 text-base md:p-2 hover:bg-[rgb(212,166,75)] md:text-lg hover:rounded-md hover:text-white" onClick={() => setIsOpen(false)}>About Us</Link>
            </li>
            <li className="border-b md:border-none">
              <Link to="/contact" className="block p-2 text-base md:p-2 hover:bg-[rgb(212,166,75)] md:text-lg hover:rounded-md hover:text-white" onClick={() => setIsOpen(false)}>Contact Us</Link>
            </li>
            <li className="border-b md:border-none">
              <Link to="/location" className="block p-2 text-base md:p-2 hover:bg-[rgb(212,166,75)] md:text-lg hover:rounded-md hover:text-white" onClick={() => setIsOpen(false)}>Location</Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Push content down to avoid navbar overlap */}
      <div className="pt-[80px]">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
