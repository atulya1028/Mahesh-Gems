import React from "react";

const Location = () => {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-10 font-montserrat">
      {/* Address Section */}
      <div className="max-w-2xl mb-6 text-lg leading-relaxed text-center text-gray-800 sm:text-xl md:text-2xl">
        <h3>
          4675, Thakur Pachewar Ka Rasta, 3rd Crossing of KGB ka Rasta,
          <br />
          Johari Bazaar, Jaipur, Rajasthan - 302003, India
        </h3>
      </div>

      {/* Google Map Section */}
      <div className="w-full max-w-4xl">
        <iframe
          className="w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-lg shadow-lg"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3557.607521474187!2d75.8279104!3d26.91594839999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db7cf40a34daf%3A0x19cd11e4ed205850!2sMahesh%20Gems!5e0!3m2!1sen!2sin!4v1737823391473!5m2!1sen!2sin"
          style={{ border: "0" }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default Location;
