import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const JewelryDetail = () => {
  const { id } = useParams(); // Get jewelry ID from the URL
  const [jewelry, setJewelry] = useState(null); // State to store the jewelry details
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    // Fetch jewelry details by ID from the API
    fetch(`https://mahesh-gems-api.vercel.app/api/jewelry/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("jewelry not found");
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
    return <div className="m-[100px] text-center">{error}</div>;
  }

  if (!jewelry) {
    return <div className="m-[100px] text-center">Loading...</div>;
  }

  // Mailto link for enquiry with dynamic subject and jewelry details
  const mailtoLink = `mailto:maheshgemsindia@gmail.com?subject=Enquiry%20about%20${encodeURIComponent(
    jewelry.title
  )}&body=I%20am%20interested%20in%20the%20following%20jewelry:%0A%0ATitle:%20${encodeURIComponent(
    jewelry.title
  )}%0APrice:%20${encodeURIComponent(
    jewelry.price
  )}%0ADescription:%20${encodeURIComponent(jewelry.description)}`;

  return (
    <div className="font-montserrat h-[100vh]">
      {/* jewelry Detail Section */}
      <div className="grid grid-cols-1 gap-8 p-5 md:grid-cols-2">
        <div>
          <img
            src={`http://localhost:3000${jewelry.image}`} // Use image from the API
            alt={jewelry.title}
            className="object-cover w-full h-auto rounded-lg"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{jewelry.title}</h1>
          <h2 className="mt-2 text-xl font-semibold text-gray-700">
            {jewelry.price}
          </h2>
          <p className="mt-4 text-gray-600">{jewelry.description}</p>
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

export default JewelryDetail;
