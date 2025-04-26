import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Package, Heart, LogOut, Settings } from "lucide-react";

const MyAccount = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status and fetch user data
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const userData = JSON.parse(localStorage.getItem("user"));
    if (loggedIn && userData) {
      setIsLoggedIn(true);
      setUser(userData);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUser(null);
    navigate("/login");
    window.dispatchEvent(new CustomEvent("loginSuccess"));
  };

  // Define account sections (excluding Cart)
  const accountSections = [
    {
      title: "Your Orders",
      icon: <Package size={24} />,
      description: "Track, return, or buy things again",
      path: "/orders",
      ariaLabel: "View your orders",
    },
    {
      title: "Your Wishlist",
      icon: <Heart size={24} />,
      description: "View or edit your wishlist",
      path: "/wishlist",
      ariaLabel: "View your wishlist",
    },
    {
      title: "Account Settings",
      icon: <Settings size={24} />,
      description: "Update your profile and password",
      path: "/account/settings",
      ariaLabel: "Edit account settings",
    },
    {
      title: "Logout",
      icon: <LogOut size={24} />,
      description: "Sign out of your account",
      action: handleLogout,
      ariaLabel: "Log out of your account",
    },
  ];

  if (!isLoggedIn || !user) {
    return (
      <div className="container px-4 mx-auto mt-6 font-montserrat">
        <p className="text-red-500">Please log in to view your account.</p>
        <button
          className="mt-4 text-sm text-blue-600 hover:underline"
          onClick={() => navigate("/login")}
          aria-label="Go to login page"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="container min-h-screen px-4 mx-auto mt-6 font-montserrat">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Your Account</h1>

      {/* User Info Section */}
      <div className="p-6 mb-8 bg-white rounded-lg shadow-sm">
        <div className="flex items-center space-x-4">
          <User size={48} className="text-gray-600" aria-hidden="true" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
            <p className="text-sm text-gray-600">{user.email}</p>
            <button
              className="mt-2 text-sm text-blue-600 hover:underline"
              onClick={() => navigate("/account/settings")}
              aria-label={`Edit profile for ${user.name}`}
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Account Sections Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {accountSections.map((section, index) => (
          <button
            key={index}
            className="p-6 text-left transition-shadow bg-white border rounded-lg shadow-sm cursor-pointer hover:shadow-md"
            onClick={section.action ? section.action : () => navigate(section.path)}
            aria-label={section.ariaLabel}
          >
            <div className="flex items-center space-x-4">
              <div className="text-yellow-500">{section.icon}</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {section.title}
                </h3>
                <p className="text-sm text-gray-600">{section.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MyAccount;   