import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Jewelry = () => {
  const [jewelries, setJewelry] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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

  // Filter jewelries based on the search term
  const filteredJewelry = jewelries.filter((jewelry) =>
    jewelry.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="font-montserrat">
      {/* Search Bar Section */}
      <div className="px-4 py-6 bg-gray-100">
        <div className="max-w-lg mx-auto">
          <input
            type="text"
            placeholder="Search Jewelry..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Jewelry Grid Section */}
      <div className="p-6 bg-white">
        <h1 className="mb-6 text-3xl font-semibold text-center text-gray-800 sm:text-4xl">
          Explore Our Exquisite Jewelry Collection
        </h1>

        {/* Loading & Error Handling */}
        {loading && <p className="text-center text-gray-600">Loading jewelry...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}

        {/* Product Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredJewelry.length > 0 ? (
              filteredJewelry.map((jewelry) => (
                <Link
                  key={jewelry._id}
                  to={`/jewelry/${jewelry._id}`}
                  className="block p-4 transition bg-white border rounded-lg shadow-lg hover:shadow-xl"
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
