import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch wishlist on mount
  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem("token");
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

        if (!response.ok) {
          if (response.status === 401) {
            setError("Session expired. Please log in again.");
            localStorage.removeItem("token");
            setTimeout(() => navigate("/login"), 2000);
          } else {
            throw new Error("Failed to fetch wishlist");
          }
          return;
        }

        const data = await response.json();
        setWishlistItems(data.wishlistItems);
        setLoading(false);
      } catch (err) {
        setError("Unable to load wishlist. Please try again.");
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
        if (response.status === 401) {
          setError("Session expired. Please log in again.");
          localStorage.removeItem("token");
          setTimeout(() => navigate("/login"), 2000);
        } else if (response.status === 404) {
          setError("Wishlist item not found.");
        } else {
          throw new Error("Failed to remove item");
        }
        return;
      }

      const data = await response.json();
      setWishlistItems(wishlistItems.filter((item) => item._id !== id));
      alert(data.message || "Item removed from wishlist!");
    } catch (err) {
      setError("Unable to remove item. Please try again.");
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
        if (response.status === 401) {
          setError("Session expired. Please log in again.");
          localStorage.removeItem("token");
          setTimeout(() => navigate("/login"), 2000);
        } else {
          throw new Error("Failed to clear wishlist");
        }
        return;
      }

      const data = await response.json();
      setWishlistItems([]);
      alert(data.message || "Wishlist cleared successfully!");
    } catch (err) {
      setError("Unable to clear wishlist. Please try again.");
    }
  };

  // Function to simulate adding to cart
  const handleAddToCart = (item) => {
    alert(`${item.jewelry.title} added to cart!`);
    // Optionally, implement cart logic here (e.g., API call)
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-xl text-red-500">{error}</div>;
  }

  return (
    <div className="container px-4 mx-auto mt-6 font-sans">
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
            onClick={() => navigate(-1)}
          >
            Back to Shopping
          </button>
        </div>
      </div>

      {/* Wishlist Content */}
      {wishlistItems.length === 0 ? (
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
          {wishlistItems.map((item) => (
            <div
              key={item._id}
              className="flex items-start p-4 transition-shadow bg-white border rounded-lg shadow-sm hover:shadow-md"
            >
              {/* Image */}
              <img
                src={item.jewelry.image}
                alt={item.jewelry.title}
                className="object-contain w-24 h-24 mr-4 rounded"
              />
              {/* Item Details */}
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600">
                  {item.jewelry.title}
                </h2>
                <p className="text-sm text-gray-500">In Stock</p>
                <p className="mt-1 text-lg font-bold text-gray-900">₹{item.jewelry.price}</p>
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