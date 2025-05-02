import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import loader from "./assets/loading.json";
import { Heart, ShoppingCart } from "lucide-react";

const JewelryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jewelry, setJewelry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    const fetchJewelry = async () => {
      try {
        const response = await fetch(`https://mahesh-gems-api.vercel.app/api/jewelry/${id}`);
        const data = await response.json();
        if (response.ok) {
          setJewelry(data);
          // Check if in wishlist
          const token = localStorage.getItem("token");
          if (token) {
            const wishlistResponse = await fetch("https://mahesh-gems-api.vercel.app/api/wishlist", {
              headers: { Authorization: `Bearer ${token}` },
            });
            const wishlistData = await wishlistResponse.json();
            if (wishlistResponse.ok) {
              setIsInWishlist(wishlistData.items.some((item) => item.jewelryId.toString() === id));
            }
          }
        } else {
          setError(data.message || "Failed to load jewelry");
        }
      } catch (err) {
        setError("Error loading jewelry");
      } finally {
        setLoading(false);
      }
    };

    fetchJewelry();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("https://mahesh-gems-api.vercel.app/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          jewelryId: id,
          quantity,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Added to cart");
        window.dispatchEvent(new CustomEvent("cartUpdated"));
      } else {
        alert(data.message || "Failed to add to cart");
      }
    } catch (err) {
      alert("Error adding to cart");
    }
  };

  const handleToggleWishlist = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const method = isInWishlist ? "DELETE" : "POST";
      const response = await fetch("https://mahesh-gems-api.vercel.app/api/wishlist", {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ jewelryId: id }),
      });

      const data = await response.json();
      if (response.ok) {
        setIsInWishlist(!isInWishlist);
        alert(isInWishlist ? "Removed from wishlist" : "Added to wishlist");
      } else {
        alert(data.message || "Failed to update wishlist");
      }
    } catch (err) {
      alert("Error updating wishlist");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-96">
          <Lottie animationData={loader} loop autoPlay />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container px-4 mx-auto mt-6 font-montserrat">
        <p className="text-red-500">{error}</p>
        <button
          className="mt-4 text-sm text-blue-600 hover:underline"
          onClick={() => navigate("/jewelry")}
        >
          Back to Jewelry
        </button>
      </div>
    );
  }

  return (
    <div className="container px-4 mx-auto mt-6 font-montserrat">
      <h1 className="text-2xl font-bold text-gray-900">{jewelry.title}</h1>
      <div className="flex flex-col gap-6 mt-6 lg:flex-row">
        <div className="flex-1">
          <div className="relative">
            {jewelry.media && jewelry.media.length > 0 ? (
              <>
                {jewelry.media[selectedMedia].type === "image" ? (
                  <img
                    src={jewelry.media[selectedMedia].url}
                    alt={jewelry.title}
                    className="object-contain w-full h-[400px] rounded-lg"
                  />
                ) : (
                  <video
                    src={jewelry.media[selectedMedia].url}
                    controls
                    className="object-contain w-full h-[400px] rounded-lg"
                  />
                )}
              </>
            ) : (
              <div className="w-full h-[400px] bg-gray-200 flex items-center justify-center rounded-lg">
                <p>No media available</p>
              </div>
            )}
          </div>
          <div className="flex mt-4 space-x-2 overflow-x-auto">
            {jewelry.media.map((media, index) => (
              <div
                key={index}
                className={`cursor-pointer border-2 rounded-lg ${
                  selectedMedia === index ? "border-yellow-500" : "border-gray-200"
                }`}
                onClick={() => setSelectedMedia(index)}
              >
                {media.type === "image" ? (
                  <img
                    src={media.url}
                    alt={`Thumbnail ${index}`}
                    className="object-contain w-20 h-20 rounded"
                  />
                ) : (
                  <div className="relative w-20 h-20">
                    <video
                      src={media.url}
                      className="object-contain w-full h-full rounded"
                      muted
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white opacity-75"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="lg:w-80">
          <p className="text-lg font-semibold">₹{jewelry.price.toFixed(2)}</p>
          <p className="mt-2 text-gray-600">{jewelry.description}</p>
          <p className="mt-2 text-gray-600">Category: {jewelry.category}</p>
          <p className="mt-2 text-gray-600">
            Stock: {jewelry.stock > 0 ? `${jewelry.stock} available` : "Out of stock"}
          </p>
          {jewelry.stock > 0 && (
            <div className="mt-4">
              <label className="block text-sm font-medium">Quantity</label>
              <input
                type="number"
                min="1"
                max={jewelry.stock}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(jewelry.stock, e.target.value)))}
                className="w-20 p-2 mt-1 border rounded"
              />
            </div>
          )}
          <div className="flex mt-4 space-x-4">
            <button
              onClick={handleAddToCart}
              disabled={jewelry.stock === 0}
              className={`flex items-center px-4 py-2 text-white rounded ${
                jewelry.stock === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600"
              }`}
            >
              <ShoppingCart size={20} className="mr-2" />
              Add to Cart
            </button>
            <button
              onClick={handleToggleWishlist}
              className={`flex items-center px-4 py-2 rounded ${
                isInWishlist ? "bg-red-500 text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              <Heart size={20} className="mr-2" />
              {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JewelryDetail;