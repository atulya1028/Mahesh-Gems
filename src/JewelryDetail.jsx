import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import loader from "./assets/loading.json";

const JewelryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jewelry, setJewelry] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`https://mahesh-gems-api.vercel.app/api/jewelry/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Jewelry not found");
        }
        return res.json();
      })
      .then((data) => setJewelry(data))
      .catch((err) => {
        console.error(err);
        setError("Unable to load jewelry details.");
      });
  }, [id]);


  const handleAddToWishlist = async () => {
    if (!jewelry) return;

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
        body: JSON.stringify({ jewelryId: jewelry._id }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Added to wishlist!");
        navigate("/wishlist");
      } else {
        alert(data.message || "Failed to add to wishlist");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding to wishlist");
    }
  };

  if (error) {
    return <div className="flex items-center justify-center h-screen text-xl text-red-500">{error}</div>;
  }

  if (!jewelry) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-96">
          <Lottie animationData={loader} loop={true} autoPlay={true} style={{ backgroundColor: "white" }} />
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
          <div className="mt-2">
            <span className="text-3xl font-semibold text-gray-900">₹{jewelry.price}</span>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-700">Product Description</h3>
            <p className="mt-2 text-gray-600">{jewelry.description}</p>
          </div>
        </div>
        <div className="md:col-span-1">
          <div className="p-6 rounded-lg shadow-md bg-gray-50">
            <div className="mb-4">
              <span className="text-2xl font-semibold text-gray-900">₹{jewelry.price}</span>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600">In stock</p>
            </div>
            <div className="space-y-3">
              <button
                className="w-full px-6 py-3 text-lg font-medium text-white transition rounded-md bg-[rgb(232,217,202)] hover:bg-amber-600"
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
                aria-label="Add to Wishlist"
                title="Add to Wishlist"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleAddToWishlist();
                  }
                }}
              >
                ♥ Add to Wishlist
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JewelryDetail;