import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import loader from "./assets/loading.json";
import emptyBox from "./assets/empty_box.json";

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch wishlist on mount
  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem("token");
      console.log("Wishlist: Token:", token); // Debug: Log token
      if (!token) {
        setError("Please log in to view your wishlist.");
        setLoading(false);
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      try {
        const response = await fetch("https://mahesh-gems-api.vercel.app/api/wishlist", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Wishlist: Response Status:", response.status); // Debug: Log status
        const data = await response.json();
        console.log("Wishlist: Response Data:", JSON.stringify(data, null, 2)); // Debug: Log full response

        if (!response.ok) {
          if (response.status === 401) {
            setError("Session expired. Please log in again.");
            localStorage.removeItem("token");
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("user");
            setTimeout(() => navigate("/login"), 2000);
          } else {
            throw new Error(data.message || "Failed to fetch wishlist");
          }
          return;
        }

        // Ensure wishlistItems is an array
        const items = Array.isArray(data.wishlistItems) ? data.wishlistItems : [];
        console.log("Wishlist: Processed Items:", items); // Debug: Log processed items
        setWishlistItems(items);
        setLoading(false);
      } catch (err) {
        console.error("Wishlist: Fetch Error:", err); // Debug: Log error
        setError(err.message || "Unable to load wishlist. Please try again.");
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [navigate]);

  // Function to remove an item from the wishlist
  const handleRemove = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to modify your wishlist.");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    try {
      const response = await fetch(`https://mahesh-gems-api.vercel.app/api/wishlist/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        if (response.status === 401) {
          setError("Session expired. Please log in again.");
          localStorage.removeItem("token");
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("user");
          setTimeout(() => navigate("/login"), 2000);
        } else if (response.status === 404) {
          setError(data.message || "Wishlist item not found.");
        } else {
          throw new Error(data.message || "Failed to remove item");
        }
        return;
      }

      const data = await response.json();
      setWishlistItems(wishlistItems.filter((item) => item._id !== id));
      alert(data.message || "Item removed from wishlist!");
      setError(null); // Clear errors
    } catch (err) {
      setError(err.message || "Unable to remove item. Please try again.");
    }
  };

  // Function to clear the entire wishlist
  const handleClearWishlist = async () => {
    if (!window.confirm("Are you sure you want to clear your wishlist?")) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to modify your wishlist.");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    try {
      const response = await fetch("https://mahesh-gems-api.vercel.app/api/wishlist", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        if (response.status === 401) {
          setError("Session expired. Please log in again.");
          localStorage.removeItem("token");
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("user");
          setTimeout(() => navigate("/login"), 2000);
        } else {
          throw new Error(data.message || "Failed to clear wishlist");
        }
        return;
      }

      const data = await response.json();
      setWishlistItems([]);
      alert(data.message || "Wishlist cleared successfully!");
      setError(null);
    } catch (err) {
      setError(err.message || "Unable to clear wishlist. Please try again.");
    }
  };

  // Function to simulate adding to cart
  const handleAddToCart = (item) => {
    alert(`${item.jewelry?.title || "Item"} added to cart!`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-96">
          <Lottie animationData={loader} loop autoPlay style={{ backgroundColor: "white" }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-xl text-red-500">
        <p>{error}</p>
        <button
          className="mt-4 text-sm text-blue-600 hover:underline"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container px-4 mx-auto mt-6 font-montserrat">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Wishlist</h1>
          <p className="text-sm text-gray-600">
            {wishlistItems.length} item{wishlistItems.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex space-x-4">
          {wishlistItems.length > 0 && (
            <button
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              onClick={handleClearWishlist}
            >
              Clear Wishlist
            </button>
          )}
          <button
            className="text-sm text-blue-600 hover:underline"
            onClick={() => navigate("/jewelry")}
          >
            Back to Shopping
          </button>
        </div>
      </div>

      {/* Wishlist Content */}
      {wishlistItems.length === 0 ? (
        <div className="flex flex-col items-center p-6 text-center bg-white border rounded-lg shadow-sm">
          <div className="w-50 sm:w-100">
            <Lottie animationData={emptyBox} loop autoPlay />
          </div>
          <p className="text-lg text-gray-600">Your wishlist is empty.</p>
          <button
            className="mt-4 text-sm text-blue-600 hover:underline"
            onClick={() => navigate("/jewelry")}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {wishlistItems.map((item) => (
            <div
              key={item._id}
              className="flex items-start p-4 transition-shadow bg-white border rounded-lg shadow-sm hover:shadow-md"
            >
              {/* Image */}
              <img
                src={item.jewelry?.image || "https://via.placeholder.com/150"}
                alt={item.jewelry?.title || "Item"}
                className="object-contain w-24 h-24 mr-4 rounded"
              />
              {/* Item Details */}
              <div className="flex-1">
                <h2
                  className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600"
                  onClick={() => navigate(`/jewelry/${item.jewelry?._id || ""}`)}
                >
                  {item.jewelry?.title || "Unknown Item"}
                </h2>
                <p className="text-sm text-gray-500">In Stock</p>
                <p className="mt-1 text-lg font-bold text-gray-900">
                  ₹{item.jewelry?.price || "N/A"}
                </p>
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