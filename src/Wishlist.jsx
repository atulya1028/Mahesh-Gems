import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For back navigation

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState(JSON.parse(localStorage.getItem("wishlist") || "[]"));

  // Function to remove an item from the wishlist
  const handleRemove = (id) => {
    const updatedWishlist = wishlist.filter((item) => item.id !== id);
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  // Function to clear the entire wishlist
  const handleClearWishlist = () => {
    if (window.confirm("Are you sure you want to clear your wishlist?")) {
      setWishlist([]);
      localStorage.removeItem("wishlist");
    }
  };

  // Function to simulate adding to cart
  const handleAddToCart = (item) => {
    alert(`${item.title} added to cart!`);
    // Optionally, implement cart logic here (e.g., save to localStorage or API)
  };

  return (
    <div className="container px-4 mx-auto mt-6 font-sans">
      {/* Header */}
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
            >
              Clear Wishlist
            </button>
          )}
          <button
            className="text-sm text-blue-600 hover:underline"
            onClick={() => navigate(-1)} // Go back to previous page
          >
            Back to Shopping
          </button>
        </div>
      </div>

      {/* Wishlist Content */}
      {wishlist.length === 0 ? (
        <div className="p-6 bg-white border rounded-lg shadow-sm">
          <p className="text-gray-600">Your wishlist is empty.</p>
          <button
            className="mt-4 text-sm text-blue-600 hover:underline"
            onClick={() => navigate("/")} // Adjust to your homepage route
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="flex items-start p-4 transition-shadow bg-white border rounded-lg shadow-sm hover:shadow-md"
            >
              {/* Image */}
              <img
                src={item.image}
                alt={item.title}
                className="object-contain w-24 h-24 mr-4 rounded"
              />
              {/* Item Details */}
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600">
                  {item.title}
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
                    onClick={() => handleRemove(item.id)}
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