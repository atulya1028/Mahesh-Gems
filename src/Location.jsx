import React from "react";

const Location = () => {
  return (
    <div className="h-auto font-montserrat">
      <div className="items-center justify-center text-center mt-[100px] text-[20px] mb-[50px]">
        <h3>
          4675, Thakur Pachewar Ka Ratsa, 3rd Crossing of KGB ka Rasta,
          <br />
          Johari Bazaar, Jaipur, Rajasthan-302003, India
        </h3>
      </div>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3557.607521474187!2d75.8279104!3d26.91594839999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db7cf40a34daf%3A0x19cd11e4ed205850!2sMahesh%20Gems!5e0!3m2!1sen!2sin!4v1737823391473!5m2!1sen!2sin"
        width="100%"
        height="500"
        style={{ border: "0" }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

export default Location;
