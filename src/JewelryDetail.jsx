import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import loader from "./assets/loading.json";

const JewelryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jewelry, setJewelry] = useState(null);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    fetch(`https://mahesh-gems-api.vercel.app/api/jewelry/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Jewelry not found");
        return res.json();
      })
      .then((data) => setJewelry(data))
      .catch((err) => {
        console.error(err);
        setError("Unable to load jewelry details.");
      });
  }, [id]);

  const handleAddToWishlist = () => {
    if (!jewelry) return;
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

    if (!wishlist.some((item) => item.id === jewelry.id)) {
      wishlist.push(jewelry);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      alert("Added to wishlist!");
    } else {
      alert("Item already in wishlist!");
    }
    navigate("/wishlist");
  };

  // New: Handle adding multiple items
  const handleAddMultipleToWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

    const updated = [...wishlist];
    selectedItems.forEach((item) => {
      if (!updated.some((existing) => existing.id === item.id)) {
        updated.push(item);
      }
    });

    localStorage.setItem("wishlist", JSON.stringify(updated));
    alert("Selected items added to wishlist!");
    navigate("/wishlist");
  };

  if (error) {
    return <div className="flex items-center justify-center h-screen text-xl text-red-500">{error}</div>;
  }

  if (!jewelry) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-96">
          <Lottie animationData={loader} loop autoPlay style={{ backgroundColor: "white" }} />
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 mx-auto mt-10 font-montserrat">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="flex justify-center md:col-span-1">
          <img
            src={jewelry.image}
            alt={jewelry.title}
            className="object-contain w-full max-w-md rounded-lg shadow-lg"
          />
        </div>

        <div className="md:col-span-1">
          <h1 className="text-2xl font-bold text-gray-800">{jewelry.title}</h1>
          <div className="mt-2 text-3xl font-semibold text-gray-900">₹{jewelry.price}</div>
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-700">Product Description</h3>
            <p className="mt-2 text-gray-600">{jewelry.description}</p>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="p-6 space-y-3 rounded-lg shadow-md bg-gray-50">
            <div className="text-2xl font-semibold text-gray-900">₹{jewelry.price}</div>
            <p className="text-sm text-gray-600">In stock</p>
            <button
              className="w-full px-6 py-3 text-lg font-medium text-white transition rounded-md bg-[rgb(232,217,202)] hover:bg-amber-600"
              onClick={() => alert("Added to cart!")}
            >
              Add to Cart
            </button>
            <button
              className="w-full px-6 py-3 text-lg font-medium text-white transition rounded-md bg-emerald-600 hover:bg-emerald-700"
              onClick={() => alert("Proceeding to buy now!")}
            >
              Buy Now
            </button>
            <span
              className="flex items-center justify-center w-full px-4 py-3 text-lg font-medium cursor-pointer text-rose-400 hover:text-rose-500"
              onClick={handleAddToWishlist}
              role="button"
              tabIndex="0"
              title="Add to Wishlist"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleAddToWishlist();
              }}
            >
              ♥ Add to Wishlist
            </span>
          </div>
        </div>
      </div>

      {/* Optional: simulate adding multiple items (for demo/testing) */}
      <div className="p-6 mt-12 bg-white rounded-md shadow">
        <h2 className="mb-4 text-xl font-bold text-gray-800">Select More Items (Simulated)</h2>
        <button
          className="px-4 py-2 mb-4 text-white bg-blue-600 rounded hover:bg-blue-700"
          onClick={() => {
            setSelectedItems([
              {
                id: "multi1",
                title: "Sample Diamond Earrings",
                price: 3200,
                image: "https://example.com/sample1.jpg",
                description: "Beautiful handcrafted earrings.",
              },
              {
                id: "multi2",
                title: "Emerald Pendant",
                price: 4500,
                image: "https://example.com/sample2.jpg",
                description: "Elegant green pendant with gold.",
              },
            ]);
          }}
        >
          Simulate Selecting 2 Items
        </button>
        <button
          className="px-4 py-2 ml-4 text-white bg-green-600 rounded hover:bg-green-700"
          onClick={handleAddMultipleToWishlist}
        >
          Add Selected Items to Wishlist
        </button>
      </div>
    </div>
  );
};

export default JewelryDetail;
