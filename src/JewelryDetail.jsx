import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const JewelryDetail = () => {
  const { id } = useParams(); // Get jewelryId from URL
  const navigate = useNavigate();
  const [jewelry, setJewelry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0); // For carousel
  const [quantity, setQuantity] = useState(1); // For cart quantity

  useEffect(() => {
    const fetchJewelry = async () => {
      try {
        const response = await fetch(`https://mahesh-gems-api.vercel.app/api/jewelry/${id}`);
        const data = await response.json();
        if (response.ok) {
          setJewelry(data);
        } else {
          setError(data.message || "Failed to load jewelry item");
        }
      } catch (err) {
        setError("Error loading jewelry item");
      } finally {
        setLoading(false);
      }
    };

    fetchJewelry();
  }, [id]);

  // Combine images and videos into a single media array for the carousel
  const media = jewelry ? [...(jewelry.images || []), ...(jewelry.videos || [])] : [];

  const handleNextMedia = () => {
    setCurrentMediaIndex((prevIndex) => (prevIndex + 1) % media.length);
  };

  const handlePrevMedia = () => {
    setCurrentMediaIndex((prevIndex) => (prevIndex - 1 + media.length) % media.length);
  };

  const handleAddToWishlist = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to add to wishlist");
        navigate("/login");
        return;
      }

      const response = await fetch("https://mahesh-gems-api.vercel.app/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ jewelryId: id }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Added to wishlist!");
        window.dispatchEvent(new CustomEvent("wishlistUpdated")); // Notify Wishlist.jsx to refresh
      } else {
        alert(data.message || "Failed to add to wishlist");
      }
    } catch (err) {
      alert("Error adding to wishlist");
    }
  };

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to add to cart");
        navigate("/login");
        return;
      }

      // Ensure quantity is a valid integer >= 1
      const parsedQuantity = parseInt(quantity);
      if (isNaN(parsedQuantity) || parsedQuantity < 1) {
        alert("Please select a valid quantity (minimum 1)");
        setQuantity(1); // Reset to default
        return;
      }

      console.log("Adding to cart:", { jewelryId: id, quantity: parsedQuantity }); // Debug

      const response = await fetch("https://mahesh-gems-api.vercel.app/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ jewelryId: id, quantity: parsedQuantity }),
      });

      const data = await response.json();
      console.log("Add to cart response:", data); // Debug

      if (response.ok) {
        window.dispatchEvent(new CustomEvent("cartUpdated"));
        alert("Added to cart!");
        navigate("/cart");
      } else {
        alert(data.message || "Failed to add to cart");
      }
    } catch (err) {
      console.error("Error adding to cart:", err); // Debug
      alert("Error adding to cart: " + err.message);
    }
  };

  const handleBuyNow = async () => {
    if (!localStorage.getItem("token")) {
      alert("Please log in to proceed with Buy Now");
      navigate("/login");
      return;
    }

    // Ensure quantity is a valid integer >= 1
    const parsedQuantity = parseInt(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity < 1) {
      alert("Please select a valid quantity (minimum 1)");
      setQuantity(1); // Reset to default
      return;
    }

    // Add the item to the cart
    try {
      const token = localStorage.getItem("token");
      console.log("Adding to cart for Buy Now:", { jewelryId: id, quantity: parsedQuantity }); // Debug

      const response = await fetch("https://mahesh-gems-api.vercel.app/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ jewelryId: id, quantity: parsedQuantity }),
      });

      const data = await response.json();
      console.log("Buy Now - Add to cart response:", data); // Debug

      if (!response.ok) {
        alert(data.message || "Failed to add to cart for Buy Now");
        return;
      }

      window.dispatchEvent(new CustomEvent("cartUpdated"));
      console.log("Cart updated event dispatched for Buy Now"); // Debug
    } catch (err) {
      console.error("Error adding to cart for Buy Now:", err); // Debug
      alert("Error adding to cart for Buy Now: " + err.message);
      return;
    }

    // Navigate to checkout with the item details
    navigate("/checkout", {
      state: {
        buyNowItem: {
          jewelryId: id,
          title: jewelry.title,
          price: jewelry.price,
          image: jewelry.images[0] || "https://via.placeholder.com/150?text=No+Image",
          description: jewelry.description,
          quantity: parsedQuantity,
        },
      },
    });
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
          onClick={() => navigate("/")}
        >
          Back to Shopping
        </button>
      </div>
    );
  }

  if (!jewelry) {
    return (
      <div className="container px-4 mx-auto mt-6 font-sans">
        <p className="text-gray-600">Jewelry item not found.</p>
        <button
          className="mt-4 text-sm text-blue-600 hover:underline"
          onClick={() => navigate("/")}
        >
          Back to Shopping
        </button>
      </div>
    );
  }

  const currentMedia = media[currentMediaIndex];
  const isVideo = currentMedia && (currentMedia.endsWith(".mp4") || currentMedia.endsWith(".webm") || currentMedia.endsWith(".ogg"));

  return (
    <div className="container px-4 mx-auto mt-6 font-sans">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Media Carousel */}
        <div className="lg:w-1/2">
          <div className="relative">
            {media.length > 0 ? (
              <>
                {isVideo ? (
                  <video
                    src={currentMedia}
                    controls
                    className="object-contain w-full rounded-lg h-96"
                  />
                ) : (
                  <img
                    src={currentMedia}
                    alt={jewelry.title}
                    className="object-contain w-full rounded-lg h-96"
                  />
                )}
                {media.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevMedia}
                      className="absolute p-2 text-white transform -translate-y-1/2 bg-gray-800 rounded-full left-2 top-1/2 hover:bg-gray-700"
                    >
                      ←
                    </button>
                    <button
                      onClick={handleNextMedia}
                      className="absolute p-2 text-white transform -translate-y-1/2 bg-gray-800 rounded-full right-2 top-1/2 hover:bg-gray-700"
                    >
                      →
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center w-full bg-gray-100 rounded-lg h-96">
                <p className="text-gray-500">No media available</p>
              </div>
            )}
          </div>
          {/* Thumbnail Previews */}
          {media.length > 1 && (
            <div className="flex mt-4 space-x-2 overflow-x-auto">
              {media.map((item, index) => {
                const isThumbnailVideo = item.endsWith(".mp4") || item.endsWith(".webm") || item.endsWith(".ogg");
                return (
                  <div
                    key={index}
                    onClick={() => setCurrentMediaIndex(index)}
                    className={`w-20 h-20 flex-shrink-0 rounded-lg cursor-pointer border-2 ${
                      index === currentMediaIndex ? "border-blue-500" : "border-transparent"
                    }`}
                  >
                    {isThumbnailVideo ? (
                      <video
                        src={item}
                        className="object-cover w-full h-full rounded-lg"
                        muted
                      />
                    ) : (
                      <img
                        src={item}
                        alt={`Thumbnail ${index}`}
                        className="object-cover w-full h-full rounded-lg"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Jewelry Details */}
        <div className="lg:w-1/2">
          <h1 className="text-3xl font-bold text-gray-900">{jewelry.title}</h1>
          <p className="mt-2 text-sm text-gray-500">In Stock</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">₹{jewelry.price}</p>
          <p className="mt-4 text-gray-600">{jewelry.description}</p>

          {/* Quantity Selector */}
          <div className="flex items-center mt-6 space-x-4">
            <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
              Quantity:
            </label>
            <input
              type="number"
              id="quantity"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 p-2 text-center border rounded-md"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex mt-6 space-x-4">
            <button
              onClick={handleAddToCart}
              className="px-6 py-2 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="px-6 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600"
            >
              Buy Now
            </button>
            <button
              onClick={handleAddToWishlist}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Add to Wishlist
            </button>
          </div>

          {/* Back to Shopping */}
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-sm text-blue-600 hover:underline"
          >
            Back to Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default JewelryDetail;