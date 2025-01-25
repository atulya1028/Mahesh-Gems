import { Outlet, Link } from "react-router-dom";
import logo from './assets/images/mg-logo.png';
import profile_icon from './assets/images/profile.png';
import Footer from "./Footer";

const Layout = () => {
  return (
    <>
      <nav className="bg-white shadow-lg font-montserrat">
        <ul className="flex flex-wrap items-center justify-between p-5">
          {/* Logo */}
          <li>
            <Link to="/">
              <img 
                src={logo} 
                alt="Mahesh Gems" 
                className="w-[150px] h-[75px] md:w-[200px] md:h-[100px] animate-fade" 
              />
            </Link>
          </li>

          {/* Navigation Links */}
          <ul className="flex flex-wrap items-center gap-4 md:gap-10">
            {/* Home */}
            <li>
              <Link 
                to="/" 
                className="p-2 text-sm md:p-3 hover:bg-gray-100 md:text-base"
              >
                Home
              </Link>
            </li>
            {/* Jewelry */}
            <li>
              <Link 
                to="/jewelry" 
                className="p-2 text-sm md:p-3 hover:bg-gray-100 md:text-base"
              >
                Jewelry
              </Link>
            </li>
            {/* About */}
            <li>
              <Link 
                to="/about" 
                className="p-2 text-sm md:p-3 hover:bg-gray-100 md:text-base"
              >
                About Us
              </Link>
            </li>
            {/* Contact */}
            <li>
              <Link 
                to="/contact" 
                className="p-2 text-sm md:p-3 hover:bg-gray-100 md:text-base"
              >
                Contact Us
              </Link>
            </li>
            {/* Location */}
            <li>
              <Link 
                to="/location" 
                className="p-2 text-sm md:p-3 hover:bg-gray-100 md:text-base"
              >
                Location
              </Link>
            </li>
          </ul>

          SignIn/SignUp
          <li className="flex items-center gap-2 animate-fade">
            <Link 
              to="/signin" 
              className="flex items-center gap-2 text-sm text-gray-500 md:text-base"
            >
              <img 
                src={profile_icon} 
                alt="Profile" 
                className="w-[25px] h-[25px] md:w-[30px] md:h-[30px]" 
              />
              <h3>Login In</h3>
            </Link>
          </li>
        </ul>
      </nav>
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
