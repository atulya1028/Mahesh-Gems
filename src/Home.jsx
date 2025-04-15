import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import banner from "./assets/images/mg-banner.jpg";
import Lottie from "lottie-react";
import loader from "./assets/loading.json";
import emptyBox from "./assets/empty_box.json";
import { FunnelIcon } from "@heroicons/react/24/outline";

const Home = () => {
  const [jewelry, setJewelry] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [combinedFilter, setCombinedFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilter, setShowFilter] = useState(false);

  const filterRef = useRef();

  useEffect(() => {
    fetch("https://mahesh-gems-api.vercel.app/api/jewelry")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch jewelry");
        }
        return res.json();
      })
      .then((data) => {
        const categorizedData = data.map((item) => {
          const title = item.title?.toLowerCase() || "";
          let category = "other";
          if (title.includes("earring")) category = "earring";
          else if (title.includes("bracelet")) category = "bracelet";
          else if (title.includes("pendant")) category = "pendant";
          return { ...item, category };
        });

        setJewelry(categorizedData);
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredJewelry = jewelry.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase());

    let matchesCombined = true;
    switch (combinedFilter) {
      case "low":
        matchesCombined = item.price <= 800;
        break;
      case "medium":
        matchesCombined = item.price > 800 && item.price <= 1100;
        break;
      case "high":
        matchesCombined = item.price > 1100;
        break;
      case "earring":
      case "bracelet":
      case "pendant":
        matchesCombined = item.category === combinedFilter;
        break;
      default:
        matchesCombined = true;
    }

    return matchesSearch && matchesCombined;
  });

  return (
    <div className="relative font-montserrat">
      <br />
      {/* Loader */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
          <div className="w-96">
            <Lottie animationData={loader} loop={true} autoPlay={true} />
          </div>
        </div>
      )}

      {/* Filter/Search Bar */}
      <section className="px-4 py-4 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mx-auto max-w-7xl">
          {/* Search Bar */}
          <div className="flex justify-center flex-1">
            <div className="w-full max-w-[700px]">
              <input
                type="text"
                placeholder="Search jewelry..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded-md shadow-lg focus:ring-1 focus:border-gray-300 focus:outline-none"
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
                    value={combinedFilter}
                    onChange={(e) => {
                      setCombinedFilter(e.target.value);
                      setShowFilter(false);
                    }}
                    className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                  >
                    <option value="all">All Items</option>
                    <optgroup label="Price">
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
      <br />

      {/* Banner and Marquee */}
      {searchTerm.trim() === "" && combinedFilter === "all" && (
        <>
          <div className="w-full overflow-hidden rounded-sm sm:mx-0">
            <img
              src={banner}
              alt="Mahesh Gems Banner"
              className="object-fill w-full h-[150px] sm:h-[300px] md:h-[300px] lg:h-[300px]"
            />
          </div>

          <div className="w-full overflow-hidden bg-gray-800 py-[1px] shadow-lg">
            <p className="text-sm font-semibold text-white sm:text-base animate-marquee whitespace-nowrap">
              Welcome to Mahesh Gems | Explore Our Latest Collection | Timeless
              Jewelry for Every Occasion | Contact Us Today!
            </p>
          </div>
        </>
      )}

      {/* Jewelry Listing */}
      <div className="px-4 py-10 bg-white">
        <h1 className="text-2xl font-semibold text-center text-gray-800 sm:text-3xl md:text-4xl">
          Diamond and Gold Jewelry
        </h1>
        <br />

        {error && <p className="text-center text-red-600">{error}</p>}
        <br /> <br />

        {!loading && !error && (
          <div className="grid grid-cols-1 gap-6 mt-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredJewelry.length > 0 ? (
              filteredJewelry.slice(0, 10).map((item) => (
                <Link
                  key={item._id}
                  to={`/jewelry/${item._id}`}
                  className="block p-4 transition bg-white border rounded-lg shadow hover:shadow-md"
                >
                  <img
                    src={item.image || "https://via.placeholder.com/300"}
                    alt={item.title}
                    className="object-fill w-full h-48 rounded"
                  />
                  <h3 className="mt-3 font-medium text-md sm:text-lg">
                    {item.title}
                  </h3>
                  <h4 className="mt-1 text-sm font-semibold text-gray-700 sm:text-base">
                    ₹{item.price}
                  </h4>
                </Link>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center text-center text-gray-500 col-span-full">
                <div className="w-100 sm:w-100">
                  <Lottie
                    animationData={emptyBox}
                    loop={true}
                    autoPlay={true}
                  />
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

export default Home;
