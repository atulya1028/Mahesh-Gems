import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Lottie from "lottie-react";
import loader from "./assets/loading.json"

const JewelryDetail = () => {
  const { id } = useParams(); // Get jewelry ID from the URL
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

  // Mailto link for enquiry
  const mailtoLink = `mailto:maheshgemsindia@gmail.com?subject=Enquiry%20about%20${encodeURIComponent(
    jewelry.title
  )}&body=I%20am%20interested%20in%20the%20following%20jewelry:%0A%0ATitle:%20${encodeURIComponent(
    jewelry.title
  )}%0APrice:%20${encodeURIComponent(
    jewelry.price
  )}%0ADescription:%20${encodeURIComponent(jewelry.description)}`;

  return (
    <div className="container px-4 mx-auto mt-10 font-montserrat">
      <div className="grid items-center grid-cols-1 gap-8 md:grid-cols-2">
        {/* Image Section */}
        <div className="flex justify-center">
          <img
            src={jewelry.image}
            alt={jewelry.title}
            className="object-fill w-full max-w-md rounded-lg shadow-lg"
          />
        </div>

        {/* Jewelry Info Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{jewelry.title}</h1>
          <h2 className="mt-2 text-2xl font-semibold text-gray-700">
            ₹{jewelry.price}
          </h2>
          <p className="mt-4 text-gray-600">{jewelry.description}</p>
          
          {/* Enquiry Button */}
          <div className="mt-6">
            <a href={mailtoLink}>
              <button className="w-full px-6 py-3 text-lg font-medium text-white transition bg-black rounded-lg hover:bg-gray-600">
                Enquire Now
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JewelryDetail;
