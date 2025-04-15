import { Outlet, Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Menu, X, User } from "lucide-react";
import logo from "./assets/images/mg-logo.png";
import Footer from "./Footer";

const Layout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  // Handles logout
  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUser(null);
    setDropdownOpen(false);
    navigate("/");
  };

  // Checks and updates login state from localStorage
  const updateLoginState = () => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const userData = JSON.parse(localStorage.getItem("user"));
    setIsLoggedIn(loggedIn);
    setUser(userData);
  };

  // Check on first render
  useEffect(() => {
    updateLoginState();

    // Listen for custom event from Login.jsx
    const handleLoginEvent = () => {
      updateLoginState();
    };

    window.addEventListener("loginSuccess", handleLoginEvent);

    return () => {
      window.removeEventListener("loginSuccess", handleLoginEvent);
    };
  }, []);

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col">
      <br /> <br /> <br />
      <nav className="fixed top-0 left-0 z-50 w-full bg-white shadow-sm font-montserrat">
        <div className="container flex items-center justify-between p-2 mx-auto">
          <Link to="/">
            <img
              src={logo}
              alt="Mahesh Gems"
              className="w-[150px] h-[130px] sm:w-[200px] sm:h-[120px] md:w-[180px] md:h-[150px] animate-fade"
            />
          </Link>

          <button
            className="block p-1 text-gray-900 md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "" : <Menu size={24} />}
          </button>

          <div className="flex items-center space-x-4">
            <ul
              className={`md:flex md:items-center md:space-x-4 absolute md:static left-0 top-12 w-full bg-white md:w-auto md:bg-transparent shadow-md md:shadow-none transition-all duration-300 ease-in-out ${
                isOpen ? "block" : "hidden md:flex"
              }`}
            >
              {isOpen && (
                <button
                  className="absolute p-2 text-gray-900 top-3 right-3 md:hidden"
                  onClick={() => setIsOpen(false)}
                >
                  <X size={24} className="text-red-600" />
                </button>
              )}

              {["/", "/jewelry", "/about", "/contact", "/location"].map((path, idx) => {
                const names = ["Home", "Jewelry", "About Us", "Contact Us", "Location"];
                return (
                  <li key={path} className="border-b md:border-none">
                    <Link
                      to={path}
                      className="block p-2 text-base md:p-2 hover:bg-[rgb(212,166,75)] md:text-lg hover:rounded-md hover:text-white"
                      onClick={() => setIsOpen(false)}
                    >
                      {names[idx]}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Account Menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center p-2 space-x-1 text-sm font-medium text-gray-700 transition-colors rounded-md md:text-base hover:bg-gray-100"
              >
                <User size={20} className="text-gray-600" />
                <span>{isLoggedIn ? `Hi, ${user?.name}` : "My Account"}</span>
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown content */}
              {dropdownOpen && (
                <div className="absolute right-0 z-10 w-56 mt-2 bg-white border border-gray-200 rounded-md shadow-lg">
                  {isLoggedIn ? (
                    <div className="py-2">
                      <p className="px-4 py-2 text-sm text-gray-600 border-b border-gray-200">
                        Welcome, <span className="font-semibold">{user?.name}</span>
                      </p>
                      <Link
                        to="/account"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        My Account
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        My Orders
                      </Link>
                      <Link
                        to="/wishlist"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Wishlist
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="py-2">
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-[80px]">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
