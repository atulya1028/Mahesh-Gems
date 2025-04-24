import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Lottie from "lottie-react";
import loader from "./assets/loading.json";

const JewelryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jewelry, setJewelry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlistError, setWishlistError] = useState(null);

  useEffect(() => {
    const fetchJewelry = async () => {
      try {
        const response = await fetch(`https://mahesh-gems-api.vercel.app/api/jewelry/${id}`);
        if (!response.ok) throw new Error("Failed to fetch jewelry");
        const data = await response.json();
        setJewelry(data);
        setLoading(false);
      } catch (err) {
        console.error("JewelryDetail: Fetch Error:", err);
        setError(err.message || "Unable to load jewelry.");
        toast.error(err.message || "Unable to load jewelry.");
        setLoading(false);
      }
    };
    fetchJewelry();
  }, [id]);

  const handleAddToWishlist = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setWishlistError("Please log in to add items to your wishlist.");
      toast.error("Please log in to add items to your wishlist.");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    try {
      const response = await fetch("https://mahesh-gems-api.vercel.app/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ jewelryId: id }),
      });

      const data = await response.json();
      console.log("JewelryDetail: Add to Wishlist Response:", JSON.stringify(data, null, 2)); // Debug: Log response

      if (!response.ok) {
        if (response.status === 401) {
          setWishlistError("Session expired. Please log in again.");
          toast.error("Session expired. Please log in again.");
          localStorage.removeItem("token");
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("user");
          setTimeout(() => navigate("/login"), 2000);
        } else if (response.status === 400) {
          setWishlistError(data.message || "Item already in wishlist.");
          toast.error(data.message || "Item already in wishlist.");
        } else {
          throw new Error(data.message || "Failed to add to wishlist.");
        }
        return;
      }

      toast.success(data.message || "Added to wishlist!");
      navigate("/wishlist");
    } catch (err) {
      console.error("JewelryDetail: Wishlist Error:", err);
      setWishlistError(err.message || "Unable to add to wishlist. Please try again.");
      toast.error(err.message || "Unable to add to wishlist.");
    }
  };

  const handleAddToCart = () => {
    toast.success(`${jewelry?.title || "Item"} added to cart!`);
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
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Image */}
        <div className="md:w-1/3">
          <img
            src={jewelry.image || "https://via.placeholder.com/300"}
            alt={jewelry.title}
            className="object-contain w-full border rounded-lg h-96"
          />
        </div>
        {/* Details */}
        <div className="md:w-1/3">
          <h1 className="text-2xl font-bold text-[#0F1111]">{jewelry.title}</h1>
          <p className="mt-2 text-sm text-green-600">
            {jewelry.inStock ? "In Stock" : "Out of Stock"}
          </p>
          <p className="text-xl font-bold text-[#0F1111] mt-2">₹{jewelry.price}</p>
          <p className="mt-4 text-gray-600">{jewelry.description}</p>
        </div>
        {/* Actions */}
        <div className="p-4 bg-white border rounded-lg shadow-sm md:w-1/3">
          <p className="text-xl font-bold text-[#0F1111] mb-4">₹{jewelry.price}</p>
          <p className="mb-4 text-sm text-gray-600">
            FREE delivery by <span className="font-semibold">April 30, 2025</span>
          </p>
          <button
            className="w-full px-4 py-2 text-sm font-medium text-[#0F1111] bg-[#F7CA00] rounded-md hover:bg-[#e0b300] mb-2"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
          <button
            className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-[#EDEDED] rounded-md hover:bg-gray-300"
            onClick={handleAddToWishlist}
          >
            Add to Wishlist
          </button>
          {wishlistError && (
            <p className="mt-4 text-sm text-red-600">{wishlistError}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default JewelryDetail;