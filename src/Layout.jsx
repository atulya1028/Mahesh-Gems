import { Outlet, Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Menu, X, User, ShoppingCart } from "lucide-react";
import logo from "./assets/images/mg-logo.png";
import Footer from "./Footer";

const Layout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUser(null);
    setDropdownOpen(false);
    setCartCount(0);
    navigate("/");
  };

  const updateLoginState = () => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const userData = JSON.parse(localStorage.getItem("user"));
    setIsLoggedIn(loggedIn);
    setUser(userData);
  };

  // Fetch cart item count
  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setCartCount(0);
        return;
      }

      const response = await fetch("https://mahesh-gems-api.vercel.app/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        const count = data.items ? data.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
        setCartCount(count);
      } else {
        setCartCount(0);
      }
    } catch (err) {
      console.error("Error fetching cart count:", err);
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateLoginState();
    fetchCartCount();
    const handleLoginEvent = () => {
      updateLoginState();
      fetchCartCount();
    };
    window.addEventListener("loginSuccess", handleLoginEvent);
    window.addEventListener("cartUpdated", fetchCartCount);
    return () => {
      window.removeEventListener("loginSuccess", handleLoginEvent);
      window.removeEventListener("cartUpdated", fetchCartCount);
    };
  }, []);

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
      <nav className="fixed top-0 left-0 z-50 w-full bg-white shadow-sm font-montserrat">
        <div className="container flex items-center justify-between p-2 mx-auto md:justify-between">
          <div className="mr-2 md:hidden">
            <button onClick={() => setIsOpen(true)}>
              <Menu size={24} className="text-gray-900" />
            </button>
          </div>

          <Link to="/" className="flex-grow md:flex-grow-0">
            <img
              src={logo}
              alt="Mahesh Gems"
              className="w-[150px] h-[130px] sm:w-[200px] sm:h-[120px] md:w-[180px] md:h-[150px] animate-fade"
            />
          </Link>

          <div className="flex items-center space-x-4">
            <ul
              className={`md:flex md:items-center md:space-x-4 absolute md:static left-0 top-16 w-full bg-white md:w-auto md:bg-transparent shadow-md md:shadow-none transition-all duration-300 ease-in-out z-40 ${
                isOpen ? "block" : "hidden md:flex"
              }`}
            >
              {isOpen && (
                <div className="flex justify-end p-4 md:hidden">
                  <button onClick={() => setIsOpen(false)}>
                    <X size={28} className="text-gray-700 hover:text-red-500" />
                  </button>
                </div>
              )}

              {["/", "/jewelry", "/about", "/contact", "/location"].map((path, idx) => {
                const names = ["Home", "Jewelry", "About Us", "Contact Us", "Location"];
                return (
                  <li key={path} className="border-b md:border-none">
                    <Link
                      to={path}
                      className="block px-6 py-3 text-base text-gray-700 hover:bg-[rgb(212,166,75)] md:p-2 md:text-lg hover:rounded-md hover:text-white transition-all duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      {names[idx]}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Cart Icon with Badge */}
            <Link to="/cart" className="relative">
              <ShoppingCart size={24} className="text-gray-600 hover:text-gray-900" />
              {cartCount > 0 && (
                <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-yellow-500 rounded-full -top-2 -right-2">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center p-2 space-x-1 text-sm font-medium text-gray-700 transition-colors rounded-md md:text-base hover:bg-gray-100"
              >
                <User size={20} className="text-gray-600" />
                <span>{isLoggedIn && user?.name ? `Hi, ${user.name.split(" ")[0]}` : "My Account"}</span>
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

              {dropdownOpen && (
                <div className="absolute right-0 z-10 w-56 mt-2 bg-white border border-gray-200 rounded-md shadow-lg">
                  {isLoggedIn ? (
                    <div className="py-2">
                      <p className="px-4 py-2 text-sm text-gray-600 border-b border-gray-200">
                        Welcome, <span className="font-semibold">{user?.name.split(" ")[0]}</span>
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

      <div className="pt-[150px]">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;