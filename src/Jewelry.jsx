import Lottie from "lottie-react";
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import loader from "./assets/loading.json";
import emptyBox from "./assets/empty_box.json";
import { FunnelIcon } from "@heroicons/react/24/outline";

const Jewelry = () => {
  const [jewelries, setJewelry] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef(null);



  useEffect(() => {
    fetch("https://mahesh-gems-api.vercel.app/api/jewelry")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch jewelry");
        return res.json();
      })
      .then((data) => {
        const updated = data.map((item) => {
          const title = item.title?.toLowerCase() || "";
          let category = "other";
          if (title.includes("earring")) category = "earring";
          else if (title.includes("bracelet")) category = "bracelet";
          else if (title.includes("pendant")) category = "pendant";
          return { ...item, category };
        });
        setJewelry(updated);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load jewelry.");
        setLoading(false);
      });
   
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilter(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredJewelry = jewelries.filter((jewelry) => {
    const matchesSearch = jewelry.title
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase());

    let matchesFilter = true;
    switch (filter) {
      case "low":
        matchesFilter = jewelry.price <= 800;
        break;
      case "medium":
        matchesFilter = jewelry.price > 800 && jewelry.price <= 1100;
        break;
      case "high":
        matchesFilter = jewelry.price > 1100;
        break;
      case "earring":
      case "bracelet":
      case "pendant":
        matchesFilter = jewelry.category === filter;
        break;
      default:
        matchesFilter = true;
    }

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="font-montserrat">
      <br />
      {/* Search & Filter Section */}
      <section className="px-4 py-4 bg-white shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mx-auto max-w-7xl">
          {/* Search Bar */}
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

          {/* Filter Icon & Dropdown */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-gray-700 rounded-md shadow hover:bg-gray-800"
            >
              <FunnelIcon className="w-5 h-5" />
              Filters
            </button>

            {showFilter && (
              <div className="absolute right-0 z-10 w-56 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="p-2 text-sm">
                  <label className="block mb-1 font-semibold text-gray-600">
                    Filter By
                  </label>
                  <select
                    value={filter}
                    onChange={(e) => {
                      setFilter(e.target.value);
                      setShowFilter(false);
                    }}
                    className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                  >
                    <optgroup label="Price">
                      <option value="all">All Prices</option>
                      <option value="low">Below ₹800</option>
                      <option value="medium">₹801 - ₹1,100</option>
                      <option value="high">Above ₹1,101</option>
                    </optgroup>
                    <optgroup label="Category">
                      <option value="earring">Earrings</option>
                      <option value="bracelet">Bracelets</option>
                      <option value="pendant">Pendants</option>
                    </optgroup>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Jewelry Section */}
      <div className="p-6 bg-white">
        <h1 className="mb-6 text-3xl font-semibold text-center text-gray-800 sm:text-4xl">
          Explore Our Exquisite Jewelry Collection
        </h1>

        {loading && (
          <div className="flex justify-center items-center h-[50vh]">
            <div className="w-96">
              <Lottie animationData={loader} loop autoPlay />
            </div>
          </div>
        )}

        {error && <p className="text-center text-red-600">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 gap-6 mt-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
                    className="object-fill w-full h-48 rounded"
                  />
                  <h3 className="mt-4 mb-2 text-lg font-medium sm:text-xl">
                    {jewelry.title}
                  </h3>
                  <h4 className="font-semibold text-gray-700 text-md sm:text-lg">
                    ₹{jewelry.price}
                  </h4>
                </Link>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center text-center text-gray-500 col-span-full">
                <div className="w-50 sm:w-100">
                  <Lottie animationData={emptyBox} loop autoPlay />
                </div>
                <p className="mt-1 text-4xl">No jewelry matches your search.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jewelry;
