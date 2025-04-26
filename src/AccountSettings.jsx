import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";

const AccountSettings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Check login status and fetch user data
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const userData = JSON.parse(localStorage.getItem("user"));
    if (loggedIn && userData) {
      setIsLoggedIn(true);
      setUser(userData);
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        password: "",
        confirmPassword: "",
      });
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (!formData.name || !formData.email) {
      setError("Name and email are required.");
      setIsLoading(false);
      return;
    }
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in again.");
        navigate("/login");
        setIsLoading(false);
        return;
      }

      const updateData = {
        name: formData.name,
        email: formData.email,
      };
      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await fetch("https://mahesh-gems-api.vercel.app/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        setFormData({
          name: data.user.name,
          email: data.user.email,
          password: "",
          confirmPassword: "",
        });
        setSuccess("Profile updated successfully.");
        window.dispatchEvent(new CustomEvent("loginSuccess"));
      } else {
        setError(data.message || "Failed to update profile.");
        console.error("API Error:", data);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoggedIn || !user) {
    return (
      <div className="container px-4 mx-auto mt-6 font-montserrat">
        <p className="text-red-500">Please log in to manage your account settings.</p>
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
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Account Settings</h1>

      <div className="max-w-lg p-6 mx-auto bg-white rounded-lg shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Update Your Profile</h2>

        {error && (
          <div className="mb-4 text-sm text-red-500" aria-live="assertive">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 text-sm text-green-500" aria-live="assertive">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} aria-label="Update profile form">
          <div className="mb-4">
            <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">
              Full Name
            </label>
            <div className="relative">
              <User
                size={20}
                className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2"
                aria-hidden="true"
              />
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                aria-label="Full name"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <Mail
                size={20}
                className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2"
                aria-hidden="true"
              />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                aria-label="Email address"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
              New Password (optional)
            </label>
            <div className="relative">
              <Lock
                size={20}
                className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2"
                aria-hidden="true"
              />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                aria-label="New password"
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block mb-1 text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock
                size={20}
                className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2"
                aria-hidden="true"
              />
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                aria-label="Confirm new password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full p-2 text-white bg-yellow-600 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={isLoading}
            aria-label="Save profile changes"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccountSettings;