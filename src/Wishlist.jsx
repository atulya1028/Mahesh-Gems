import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
        toast.error("Please log in to view your wishlist.");
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
            toast.error("Session expired. Please log in again.");
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
        toast.error(err.message || "Unable to load wishlist.");
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
      toast.error("Please log in to modify your wishlist.");
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
          toast.error("Session expired. Please log in again.");
          localStorage.removeItem("token");
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("user");
          setTimeout(() => navigate("/login"), 2000);
        } else if (response.status === 404) {
          setError(data.message || "Wishlist item not found.");
          toast.error(data.message || "Wishlist item not found.");
        } else {
          throw new Error(data.message || "Failed to remove item");
        }
        return;
      }

      const data = await response.json();
      setWishlistItems(wishlistItems.filter((item) => item._id !== id));
      toast.success(data.message || "Item removed from wishlist!");
      setError(null);
    } catch (err) {
      setError(err.message || "Unable to remove item. Please try again.");
      toast.error(err.message || "Unable to remove item.");
    }
  };

  // Function to clear the entire wishlist
  const handleClearWishlist = async () => {
    if (!window.confirm("Are you sure you want to clear your wishlist?")) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to modify your wishlist.");
      toast.error("Please log in to modify your wishlist.");
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
          toast.error("Session expired. Please log in again.");
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
      toast.success(data.message || "Wishlist cleared successfully!");
      setError(null);
    } catch (err) {
      setError(err.message || "Unable to clear wishlist. Please try again.");
      toast.error(err.message || "Unable to clear wishlist.");
    }
  };

  // Function to simulate adding to cart
  const handleAddToCart = (item) => {
    toast.success(`${item.jewelry?.title || "Item"} added to cart!`);
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
      <div className="flex flex-col items-center justify-center h-screen text-xl text-red-600 font-montserrat">
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
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b">
        <div>
          <h1 className="text-3xl font-bold text-[#0F1111]">Your Wishlist</h1>
          <p className="text-sm text-gray-600">
            {wishlistItems.length} item{wishlistItems.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex space-x-4">
          {wishlistItems.length > 0 && (
            <button
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-[#EDEDED] rounded-md hover:bg-gray-300"
              onClick={handleClearWishlist}
            >
              Clear Wishlist
            </button>
          )}
          <button
            className="text-sm text-blue-600 hover:underline"
            onClick={() => navigate("/jewelry")}
          >
            Continue Shopping
          </button>
        </div>
      </div>

      {/* Wishlist Content */}
      {wishlistItems.length === 0 ? (
        <div className="flex flex-col items-center p-6 text-center bg-white border rounded-lg shadow-sm">
          <div className="w-32 sm:w-48">
            <Lottie animationData={emptyBox} loop autoPlay />
          </div>
          <h2 className="text-xl font-semibold text-[#0F1111] mt-4">Your Wishlist is Empty</h2>
          <p className="mt-2 text-gray-600">Add items you want to shop for later.</p>
          <button
            className="mt-4 px-6 py-2 text-sm font-medium text-[#0F1111] bg-[#F7CA00] rounded-md hover:bg-[#e0b300]"
            onClick={() => navigate("/jewelry")}
          >
            Browse Jewelry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {wishlistItems.map((item) => (
            <div
              key={item._id}
              className="flex items-start p-4 transition-shadow bg-white border rounded-lg shadow-sm hover:shadow-md"
            >
              {/* Image */}
              <img
                src={item.jewelry?.image || "https://via.placeholder.com/150"}
                alt={item.jewelry?.title || "Item"}
                className="object-contain w-32 h-32 mr-4 rounded"
              />
              {/* Item Details */}
              <div className="flex-1">
                <h2
                  className="text-lg font-semibold text-[#0F1111] cursor-pointer hover:text-blue-600"
                  onClick={() => navigate(`/jewelry/${item.jewelry?._id || ""}`)}
                >
                  {item.jewelry?.title || "Unknown Item"}
                </h2>
                <p className="text-sm text-green-600">
                  {item.jewelry?.inStock ? "In Stock" : "Out of Stock"}
                </p>
                <p className="mt-1 text-xl font-bold text-[#0F1111]">
                  ₹{item.jewelry?.price || "N/A"}
                </p>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {item.jewelry?.description || "No description available"}
                </p>
                {/* Actions */}
                <div className="flex mt-3 space-x-3">
                  <button
                    className="px-4 py-2 text-sm font-medium text-[#0F1111] bg-[#F7CA00] rounded-md hover:bg-[#e0b300]"
                    onClick={() => handleAddToCart(item)}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-[#EDEDED] rounded-md hover:bg-gray-300"
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