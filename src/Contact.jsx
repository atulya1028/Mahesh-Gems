import React from "react";
import gmail from "./assets/icons/gmail.png";
import whatsapp from "./assets/icons/whatsapp.png";

const Contact = () => {
  const email = "maheshgemsindia@gmail.com";
  const whatsappNo = "919352829421";

  return (
    <div className="m-[15%] font-montserrat">
      <div className="flex flex-col items-center justify-center text-center">
        <p>For any queries and questions, please inform us at:</p>
        <br />
      </div>
      <div className="flex items-center justify-center gap-10 text-center">
        <div className="m-1">
          <a
            href={`mailto:${email}`}
            className="flex flex-col items-center justify-center text-center "
          >
            <img src={gmail} alt="Gmail" className="w-[40px] h-[40px]" />
            <br />
            {email}
          </a>
        </div>
        <div className="m-1">
          <a
            href={`https://wa.me/${whatsappNo}`}
            className="flex flex-col items-center justify-center text-center "
          >
            <img src={whatsapp} alt="Gmail" className="w-[40px] h-[40px]" />
            <br />
            {whatsappNo}
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
