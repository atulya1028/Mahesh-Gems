import React from "react";
import dj from "./assets/images/diamond_jewellery.jpeg";
import gj from "./assets/images/gold_jewellery.jpeg";

const About = () => {
  return (
    <div>
      <div className="text-center h-[100vh]">
        <h1 className="text-[70px]">About US</h1>
        <p className="text-justify mx-[50px]">
          Mahesh Gems has been a trusted name in the world of gemstones and
          jewelry for over 30 years. Based in the vibrant city of Jaipur, India,
          renowned as the gemstone capital of the world, we specialize in
          natural gemstones, exquisite jewelry, and custom designs that reflect
          timeless craftsmanship. With decades of experience, we take pride in
          sourcing the finest precious and semi-precious stones, ensuring
          authenticity, quality, and unmatched brilliance. Our commitment to
          excellence has earned us a loyal clientele across India and beyond. At
          Mahesh Gems, we blend tradition with innovation, offering both classic
          and contemporary designs that cater to diverse tastes. Whether you
          seek a rare gemstone, a bespoke jewelry piece, or expert guidance, we
          are dedicated to providing transparency, trust, and excellence in
          every purchase.
        </p>
        <br />
        <br />
        <div className="flex items-center justify-evenly">
          <img
            src={dj}
            alt="Diamond Jewellery"
            className="w-[400px] h-[400px] rounded-md"
          />
          <img
            src={gj}
            alt="Diamond Jewellery"
            className="w-[400px] h-[400px] rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default About;
