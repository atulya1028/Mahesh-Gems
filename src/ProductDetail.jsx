import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams(); // Get product ID from the URL
  const [product, setProduct] = useState(null); // State to store the product details
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    // Fetch product details by ID from the API
    fetch(`https://mahesh-gems-api.vercel.app/api/products/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Product not found");
        }
        return res.json();
      })
      .then((data) => setProduct(data))
      .catch((err) => {
        console.error(err);
        setError("Unable to load product details.");
      });
  }, [id]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!product) {
    return <div>Loading...</div>;
  }

  // Mailto link for enquiry with dynamic subject and product details
  const mailtoLink = `mailto:maheshgemsindia@gmail.com?subject=Enquiry%20about%20${encodeURIComponent(
    product.title
  )}&body=I%20am%20interested%20in%20the%20following%20product:%0A%0ATitle:%20${encodeURIComponent(
    product.title
  )}%0APrice:%20${encodeURIComponent(
    product.price
  )}%0ADescription:%20${encodeURIComponent(product.description)}`;

  return (
    <div className="font-montserrat">
      {/* Product Detail Section */}
      <div className="grid grid-cols-1 gap-8 p-5 md:grid-cols-2">
        <div>
          <img
            src={product.image} // Use image from the API
            alt={product.title}
            className="object-cover w-full h-auto rounded-lg"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{product.title}</h1>
          <h2 className="mt-2 text-xl font-semibold text-gray-700">
            ₹{product.price}
          </h2>
          <p className="mt-4 text-gray-600">{product.description}</p>
          <a href={mailtoLink}>
            <button className="px-6 py-3 mt-6 text-white bg-black rounded-lg hover:bg-gray-500">
              Enquiry
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
