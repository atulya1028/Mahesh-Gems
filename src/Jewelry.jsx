import Lottie from "lottie-react";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import loader from "./assets/loading.json";

const Jewelry = () => {
  const [jewelries, setJewelry] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://mahesh-gems-api.vercel.app/api/jewelry")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch jewelry");
        }
        return res.json();
      })
      .then((data) => {
        setJewelry(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load jewelry.");
        setLoading(false);
      });
  }, []);

  const filteredJewelry = jewelries.filter((jewelry) => {
    const matchesSearch = jewelry.title
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase());

    const matchesPrice =
      priceFilter === "all"
        ? true
        : priceFilter === "low"
          ? jewelry.price <= 10000
          : priceFilter === "medium"
            ? jewelry.price > 10000 && jewelry.price <= 50000
            : jewelry.price > 50000;

    return matchesSearch && matchesPrice;
  });

  return (
    <div className="font-montserrat">
      {/* Search & Filter Section */}
      <section className="px-4 py-4 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mx-auto max-w-7xl">
          {/* Search Bar - Centered */}
          <div className="flex justify-center flex-1">
            <div className="w-full max-w-[700px]">
              <input
                type="text"
                placeholder="Search Jewelry..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Price Filter - Right aligned */}
          <div className="w-[150px] sm:w-[180px]">
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="all">All Prices</option>
              <option value="low">Below ₹10,000</option>
              <option value="medium">₹10,001 - ₹50,000</option>
              <option value="high">Above ₹50,000</option>
            </select>
          </div>
        </div>
      </section>


      {/* Jewelry Grid Section */}
      <div className="p-6 bg-white">
        <h1 className="mb-6 text-3xl font-semibold text-center text-gray-800 sm:text-4xl">
          Explore Our Exquisite Jewelry Collection
        </h1>

        {/* Loading & Error Handling */}
        {loading && <div className="flex justify-center items-center h-[50vh]">
         <div className="w-96">
         <Lottie animationData={loader} loop={true} autoPlay={true} style={{backgroundColor:"white"}}/>
         </div>
          </div>}
        {error && <p className="text-center text-red-600">{error}</p>}

        {/* Product Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 gap-6 mt-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredJewelry.length > 0 ? (
              filteredJewelry.map((jewelry) => (
                <Link
                  key={jewelry._id}
                  to={`/jewelry/${jewelry._id}`}
                  className="block p-4 transition bg-white border rounded-lg shadow hover:shadow-md"
                >
                  <img
                    src={jewelry.image || "https://via.placeholder.com/300"}
                    alt={jewelry.title}
                    className="object-cover w-full h-48 rounded"
                  />
                  <h3 className="mt-4 mb-2 text-lg font-medium sm:text-xl">{jewelry.title}</h3>
                  <h4 className="font-semibold text-gray-700 text-md sm:text-lg">
                    ₹{jewelry.price}
                  </h4>
                </Link>
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-full">
                No jewelry found.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jewelry;
