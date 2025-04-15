import React from "react";
import gmail from "./assets/icons/gmail.png";
import whatsapp from "./assets/icons/whatsapp.png";

const Contact = () => {
  const email = "maheshgemsindia@gmail.com";
  const whatsappNo = "919352829421";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-10 font-montserrat">
      <div className="max-w-xl text-center">
        <p className="text-lg font-medium text-gray-800 sm:text-xl">
          For any queries and questions, please contact us:
        </p>
      </div>
      <div className="flex flex-col items-center justify-center w-full gap-6 mt-6 sm:flex-row sm:gap-12">
        {/* Gmail */}
        <a
          href={`mailto:${email}`}
          className="flex flex-col items-center justify-center text-center transition-transform transform hover:scale-105"
        >
          <img
            src={gmail}
            alt="Gmail"
            className="w-12 h-12 sm:w-16 sm:h-16"
          />
          <p className="mt-2 text-sm text-gray-700 sm:text-base">{email}</p>
        </a>

        {/* WhatsApp */}
        <a
          href={`https://wa.me/${whatsappNo}`}
          className="flex flex-col items-center justify-center text-center transition-transform transform hover:scale-105"
        >
          <img
            src={whatsapp}
            alt="WhatsApp"
            className="w-12 h-12 sm:w-16 sm:h-16"
          />
          <p className="mt-2 text-sm text-gray-700 sm:text-base">{whatsappNo}</p>
        </a>
      </div>
    </div>
  );
};

export default Contact;
