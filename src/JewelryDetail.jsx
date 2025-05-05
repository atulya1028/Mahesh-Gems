import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const JewelryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jewelry, setJewelry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

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
        window.dispatchEvent(new CustomEvent("wishlistUpdated"));
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

      const parsedQuantity = parseInt(quantity);
      if (isNaN(parsedQuantity) || parsedQuantity < 1) {
        alert("Please select a valid quantity (minimum 1)");
        setQuantity(1);
        return;
      }

      const response = await fetch("https://mahesh-gems-api.vercel.app/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ jewelryId: id, quantity: parsedQuantity }),
      });

      const data = await response.json();
      if (response.ok) {
        window.dispatchEvent(new CustomEvent("cartUpdated"));
        alert("Added to cart!");
        navigate("/cart");
      } else {
        alert(data.message || "Failed to add to cart");
      }
    } catch (err) {
      alert("Error adding to cart: " + err.message);
    }
  };

  const handleBuyNow = async () => {
    if (!localStorage.getItem("token")) {
      alert("Please log in to proceed with Buy Now");
      navigate("/login");
      return;
    }

    const parsedQuantity = parseInt(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity < 1) {
      alert("Please select a valid quantity (minimum 1)");
      setQuantity(1);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://mahesh-gems-api.vercel.app/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ jewelryId: id, quantity: parsedQuantity }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Failed to add to cart for Buy Now");
        return;
      }

      window.dispatchEvent(new CustomEvent("cartUpdated"));
    } catch (err) {
      alert("Error adding to cart for Buy Now: " + err.message);
      return;
    }

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
    return (
      <div className="flex items-center justify-center h-screen text-lg text-gray-600">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <p className="text-lg text-red-600">{error}</p>
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
      <div className="container px-4 py-8 mx-auto">
        <p className="text-lg text-gray-600">Jewelry item not found.</p>
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
    <div className="container px-4 py-8 mx-auto font-sans">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Media Carousel */}
        <div className="lg:col-span-1">
          <div className="relative bg-white rounded-lg shadow-sm">
            {media.length > 0 ? (
              <>
                {isVideo ? (
                  <video
                    src={currentMedia}
                    controls
                    className="w-full h-[400px] object-contain rounded-t-lg"
                  />
                ) : (
                  <img
                    src={currentMedia}
                    alt={jewelry.title}
                    className="w-full h-[400px] object-contain rounded-t-lg"
                  />
                )}
                {media.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevMedia}
                      className="absolute p-2 text-white transition transform -translate-y-1/2 bg-gray-800 rounded-full top-1/2 left-2 hover:bg-gray-700"
                    >
                      ←
                    </button>
                    <button
                      onClick={handleNextMedia}
                      className="absolute p-2 text-white transition transform -translate-y-1/2 bg-gray-800 rounded-full top-1/2 right-2 hover:bg-gray-700"
                    >
                      →
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center w-full h-[400px] bg-gray-100 rounded-t-lg">
                <p className="text-gray-500">No media available</p>
              </div>
            )}
            {/* Thumbnail Previews */}
            {media.length > 1 && (
              <div className="flex p-4 space-x-2 overflow-x-auto">
                {media.map((item, index) => {
                  const isThumbnailVideo = item.endsWith(".mp4") || item.endsWith(".webm") || item.endsWith(".ogg");
                  return (
                    <div
                      key={index}
                      onClick={() => setCurrentMediaIndex(index)}
                      className={`w-16 h-16 flex-shrink-0 rounded-md cursor-pointer border-2 ${
                        index === currentMediaIndex ? "border-blue-500" : "border-gray-200"
                      } hover:border-blue-400 transition`}
                    >
                      {isThumbnailVideo ? (
                        <video
                          src={item}
                          className="object-cover w-full h-full rounded-md"
                          muted
                        />
                      ) : (
                        <img
                          src={item}
                          alt={`Thumbnail ${index}`}
                          className="object-cover w-full h-full rounded-md"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Jewelry Details */}
        <div className="lg:col-span-1">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">{jewelry.title}</h1>
          <p className="mb-2 text-sm text-green-600">In Stock</p>
          <p className="mb-4 text-3xl font-bold text-gray-900">₹{jewelry.price}</p>
          <p className="mb-4 text-gray-600">{jewelry.description}</p>

          {/* Quantity Selector */}
          <div className="flex items-center mb-4">
            <label htmlFor="quantity" className="mr-2 text-sm text-gray-700">
              Quantity:
            </label>
            <input
              type="number"
              id="quantity"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 p-2 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Back to Shopping */}
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-blue-600 hover:underline"
          >
            Back to Shopping
          </button>
        </div>

        {/* Action Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky p-6 bg-white border border-gray-200 rounded-lg shadow-sm top-4">
            <p className="mb-4 text-2xl font-bold text-gray-900">₹{jewelry.price}</p>
            <p className="mb-4 text-sm text-gray-600">FREE delivery by Tomorrow</p>

            {/* Quantity Selector (Repeated for Sidebar) */}
            <div className="flex items-center mb-4">
              <label htmlFor="quantity-sidebar" className="mr-2 text-sm text-gray-700">
                Qty:
              </label>
              <input
                type="number"
                id="quantity-sidebar"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 p-2 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Action Buttons */}
            <button
              onClick={handleAddToCart}
              className="w-full py-2 mb-2 font-medium text-gray-900 transition bg-yellow-400 rounded-md hover:bg-yellow-500"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="w-full py-2 mb-2 font-medium text-gray-900 transition bg-yellow-600 rounded-md hover:bg-yellow-700"
            >
              Buy Now
            </button>
            <button
              onClick={handleAddToWishlist}
              className="w-full py-2 font-medium text-gray-700 transition bg-white border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JewelryDetail;