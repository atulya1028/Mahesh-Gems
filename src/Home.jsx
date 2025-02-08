import React, { useState, useEffect } from "react";
import banner from "./assets/images/mg-banner.jpeg";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("https://mahesh-gems-api.vercel.app/api/products")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        return res.json();
      })
      .then((data) => setProducts(data))
      .catch((err) => {
        console.error(err);
        setProducts([]);
      });
  }, []);

  // Filter products based on the search term
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="font-montserrat">
      {/* Hero Section */}
      <div className="relative w-full min-h-screen mb-0">
        {/* Background Image */}
        <img
          src={banner}
          alt="Mahesh Gems Banner"
          className="object-cover w-full h-[600px] opacity-4 border-l-neutral-300"
        />

        {/* Banner Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-3 text-center text-white opacity-3">
          <h1 className="mb-3 text-3xl font-bold md:text-5xl lg:text-6xl">
            Mahesh Gems
          </h1>
          <p className="text-base font-medium md:text-lg lg:text-xl">
            Crafting timeless beauty with exquisite gemstones and jewellery
          </p>
        </div>
      </div>

      {/* Marquee Section */}
      <div className="w-full overflow-hidden bg-gray-800 mt-[-30px]">
        <p className="text-xl font-semibold text-white animate-marquee whitespace-nowrap">
          Welcome to Mahesh Gems | Explore Our Latest Collection | Timeless
          Jewelry for Every Occasion | Contact Us Today!
        </p>
      </div>

      
     {/* Search Bar */}
<div className="px-4 my-6">
  <input
    type="text"
    placeholder="Search Products..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full p-3 text-lg text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
  />
</div>


      {/* Diamond Jewelry Section */}
      <div className="pt-10 pb-10 bg-gray-50">
        <h1 className="text-3xl font-normal text-center text-gray-800 sm:text-4xl lg:text-5xl font-montserrat">
          Diamond and Gold Jewelry
        </h1>

        <div className="grid grid-cols-3 gap-8 m-5">
          {filteredProducts.map((product) => (
            <a
              key={product._id}
              href={`/product/${product._id}`}
              className="block p-4 bg-white border rounded shadow-lg"
            >
              <img
                src={product.image}
                alt={product.title}
                className="object-cover w-full h-48 rounded"
              />
              <h3 className="mt-4 mb-2 text-xl font-medium">{product.title}</h3>
              <h4 className="text-lg font-semibold text-gray-700">
                ₹{product.price}
              </h4>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
