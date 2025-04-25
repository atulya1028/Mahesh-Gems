import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to view your wishlist");
          setLoading(false);
          return;
        }

        const response = await fetch("https://mahesh-gems-api.vercel.app/api/wishlist", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setWishlist(data.items || []);
        } else {
          setError(data.message || "Failed to load wishlist");
        }
      } catch (err) {
        setError("Error loading wishlist");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const handleRemove = async (jewelryId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://mahesh-gems-api.vercel.app/api/wishlist/${jewelryId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setWishlist(data.wishlist.items || []);
        alert("Removed from wishlist!");
      } else {
        alert(data.message || "Failed to remove from wishlist");
      }
    } catch (err) {
      alert("Error removing from wishlist");
    }
  };

  const handleClearWishlist = async () => {
    if (!window.confirm("Are you sure you want to clear your wishlist?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://mahesh-gems-api.vercel.app/api/wishlist", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setWishlist([]);
        alert("Wishlist cleared!");
      } else {
        alert(data.message || "Failed to clear wishlist");
      }
    } catch (err) {
      alert("Error clearing wishlist");
    }
  };


  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container px-4 mx-auto mt-6 font-sans">
        <p className="text-red-500">{error}</p>
        <button
          className="mt-4 text-sm text-blue-600 hover:underline"
          onClick={() => navigate("/login")}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="container px-4 mx-auto mt-6 font-sans">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Wishlist</h1>
          <p className="text-sm text-gray-600">{wishlist.length} item{wishlist.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex space-x-4">
          {wishlist.length > 0 && (
            <button
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              onClick={handleClearWishlist}
              disabled={loading}
            >
              {loading ? "Clearing..." : "Clear Wishlist"}
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
      {wishlist.length === 0 ? (
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
              key={item.jewelryId._id || item.jewelryId}
              className="flex items-start p-4 transition-shadow bg-white border rounded-lg shadow-sm hover:shadow-md"
            >
              <img
                src={item.image}
                alt={item.title}
                className="object-contain w-24 h-24 mr-4 rounded"
              />
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600">
                  {item.title}
                </h2>
                <p className="text-sm text-gray-500">In Stock</p>
                <p className="mt-1 text-lg font-bold text-gray-900">₹{item.price}</p>
                <div className="flex mt-2 space-x-2">
                  <button
                    className="px-4 py-1.5 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600"
                  >
                    Add to Cart
                  </button>
                  <button
                    className="px-4 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    onClick={() => handleRemove(item.jewelryId._id || item.jewelryId)}
                    disabled={loading}
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
