import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import banner from "./assets/images/mg-banner.jpeg";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://mahesh-gems-api.vercel.app/api/products")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load products.");
        setLoading(false);
      });
  }, []);

  // Filter products based on the search term
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="font-montserrat">
      {/* Banner Section */}
      <div className="relative w-full">
        <img
          src={banner}
          alt="Mahesh Gems Banner"
          className="object-cover w-full h-[250px] sm:h-[350px] md:h-[500px] lg:h-[600px]"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white bg-black bg-opacity-50">
          <h1 className="mb-3 text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl">
            Mahesh Gems
          </h1>
          <p className="max-w-3xl text-sm sm:text-lg md:text-xl lg:text-2xl">
            Crafting timeless beauty with exquisite gemstones and jewelry
          </p>
        </div>
      </div>

      {/* Marquee Section */}
      <div className="w-full py-2 overflow-hidden bg-gray-800">
        <p className="text-sm font-semibold text-white sm:text-lg animate-marquee whitespace-nowrap">
          Welcome to Mahesh Gems | Explore Our Latest Collection | Timeless Jewelry for Every Occasion | Contact Us Today!
        </p>
      </div>

      {/* Search Bar */}
      <div className="px-4 my-6">
        <input
          type="text"
          placeholder="Search Products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 text-base border rounded-lg sm:text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Diamond Jewelry Section */}
      <div className="py-10 bg-gray-50">
        <h1 className="text-2xl font-semibold text-center text-gray-800 sm:text-3xl md:text-4xl lg:text-5xl">
          Diamond and Gold Jewelry
        </h1>

        {/* Loading Indicator */}
        {loading && <p className="mt-4 text-center text-gray-600">Loading products...</p>}

        {/* Error Message */}
        {error && <p className="mt-4 text-center text-red-600">{error}</p>}

        {/* Product Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <Link
                  key={product._id}
                  to={`/product/${product._id}`}
                  className="block p-4 transition bg-white border rounded-lg shadow-lg hover:shadow-xl"
                >
                  <img
                    src={product.image || "https://via.placeholder.com/300"}
                    alt={product.title}
                    className="object-cover w-full h-48 rounded"
                  />
                  <h3 className="mt-4 mb-2 text-lg font-medium sm:text-xl">{product.title}</h3>
                  <h4 className="font-semibold text-gray-700 text-md sm:text-lg">
                    ₹{product.price}
                  </h4>
                </Link>
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-full">No products found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
