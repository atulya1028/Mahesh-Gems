import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Backend API base URL (adjust as needed)
  const API_URL = "https://mahesh-gems-api.vercel.app/api";

  // Get JWT token from localStorage
  const getToken = () => localStorage.getItem("token");

  // Fetch wishlist from backend
  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) {
        throw new Error("Please log in to view your wishlist.");
      }

      const response = await fetch(`${API_URL}/wishlist`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch wishlist.");
      }

      const data = await response.json();
      setWishlist(data.wishlist || []);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch wishlist.");
    } finally {
      setLoading(false);
    }
  };

  // Remove item from wishlist
  const handleRemove = async (jewelryId) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error("Please log in to modify your wishlist.");
      }

      const response = await fetch(`${API_URL}/wishlist/remove/${jewelryId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to remove item from wishlist.");
      }

      // Update wishlist locally
      setWishlist(wishlist.filter((item) => item._id !== jewelryId));
    } catch (err) {
      setError(err.message || "Failed to remove item from wishlist.");
    }
  };

  // Clear entire wishlist
  const handleClearWishlist = async () => {
    if (window.confirm("Are you sure you want to clear your wishlist?")) {
      try {
        const token = getToken();
        if (!token) {
          throw new Error("Please log in to modify your wishlist.");
        }

        const response = await fetch(`${API_URL}/wishlist`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to clear wishlist.");
        }

        setWishlist([]);
      } catch (err) {
        setError(err.message || "Failed to clear wishlist.");
      }
    }
  };

  // Simulate adding to cart (unchanged)
  const handleAddToCart = (item) => {
    alert(`${item.name} added to cart!`);
    // Optionally, implement cart logic here
  };

  // Fetch wishlist on component mount
  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <div className="container px-4 mx-auto mt-6 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Wishlist</h1>
          <p className="text-sm text-gray-600">
            {wishlist.length} item{wishlist.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex space-x-4">
          {wishlist.length > 0 && (
            <button
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              onClick={handleClearWishlist}
            >
              Clear Wishlist
            </button>
          )}
          <button
            className="text-sm text-blue-600 hover:underline"
            onClick={() => navigate(-1)}
          >
            Back to Shopping
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      {/* Wishlist Content */}
      {loading ? (
        <div className="p-6 bg-white border rounded-lg shadow-sm">
          <p className="text-gray-600">Loading wishlist...</p>
        </div>
      ) : wishlist.length === 0 ? (
        <div className="p-6 bg-white border rounded-lg shadow-sm">
          <p className="text-gray-600">Your wishlist is empty.</p>
          <button
            className="mt-4 text-sm text-blue-600 hover:underline"
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {wishlist.map((item) => (
            <div
              key={item._id}
              className="flex items-start p-4 transition-shadow bg-white border rounded-lg shadow-sm hover:shadow-md"
            >
              {/* Image */}
              <img
                src={item.image}
                alt={item.name}
                className="object-contain w-24 h-24 mr-4 rounded"
              />
              {/* Item Details */}
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600">
                  {item.name}
                </h2>
                <p className="text-sm text-gray-500">In Stock</p>
                <p className="mt-1 text-lg font-bold text-gray-900">₹{item.price}</p>
                {/* Actions */}
                <div className="flex mt-2 space-x-2">
                  <button
                    className="px-4 py-1.5 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600"
                    onClick={() => handleAddToCart(item)}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="px-4 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    onClick={() => handleRemove(item._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;