import React from "react";
import dj from "./assets/images/diamond_jewellery.jpeg";
import gj from "./assets/images/gold_jewellery.jpeg";

const About = () => {
  return (
    <div className="px-4 py-10 text-center md:px-10 lg:px-20">
      {/* Heading */}
      <h1 className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">About Us</h1>

      {/* Description */}
      <p className="max-w-5xl mx-auto text-base leading-relaxed text-justify md:text-lg lg:text-xl">
        Mahesh Gems has been a trusted name in the world of gemstones and jewelry for over 30 years. 
        Based in the vibrant city of Jaipur, India, renowned as the gemstone capital of the world, we specialize 
        in natural gemstones, exquisite jewelry, and custom designs that reflect timeless craftsmanship. 
        With decades of experience, we take pride in sourcing the finest precious and semi-precious stones, 
        ensuring authenticity, quality, and unmatched brilliance. Our commitment to excellence has earned us a 
        loyal clientele across India and beyond. At Mahesh Gems, we blend tradition with innovation, offering 
        both classic and contemporary designs that cater to diverse tastes. Whether you seek a rare gemstone, 
        a bespoke jewelry piece, or expert guidance, we are dedicated to providing transparency, trust, and 
        excellence in every purchase.
      </p>

      {/* Image Section */}
      <div className="flex flex-col items-center justify-center gap-6 mt-10 md:flex-row">
        <img
          src={dj}
          alt="Diamond Jewellery"
          className="w-full md:w-[45%] max-w-[400px] rounded-md shadow-lg"
        />
        <img
          src={gj}
          alt="Gold Jewellery"
          className="w-full md:w-[45%] max-w-[400px] rounded-md shadow-lg"
        />
      </div>
    </div>
  );
};

export default About;
