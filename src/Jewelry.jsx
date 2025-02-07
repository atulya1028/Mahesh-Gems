import React, { useState, useEffect } from "react";

const Jewelry = () => {
  const [jewelries, setJewelry] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/jewelry")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch jewelry");
        }
        return res.json();
      })
      .then((data) => setJewelry(data))
      .catch((err) => {
        console.error(err);
        setJewelry([]);
      });
  }, []);

  // Filter jewelries based on the search term
  const filteredJewelry = jewelries.filter((jewelry) =>
    jewelry.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-[100vh] font-montserrat">
      {/* Search Bar Section */}
      <div className="px-4 py-6 bg-gray-100">
        <div className="max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Search Jewelry..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 text-lg bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Jewelry Grid Section */}
      <div className="text-center h-[300px] p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredJewelry.map((jewelry) => (
          <a
            key={jewelry._id}
            href={`/jewelry/${jewelry._id}`}
            className="block p-4 bg-white border rounded shadow-lg"
          >
            <img
              src={`http://localhost:3000${jewelry.image}`}
              alt={jewelry.title}
              className="object-cover w-full h-48 rounded"
            />
            <h3 className="mt-4 mb-2 text-xl font-medium">{jewelry.title}</h3>
            <h4 className="text-lg font-semibold text-gray-700">₹{jewelry.price}</h4>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Jewelry;
  