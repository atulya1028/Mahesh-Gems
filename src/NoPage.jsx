import React from "react";
import Layout from "./Layout";
import pageNotFound from "./assets/page_not_found.json";
import Lottie from "lottie-react";

const NoPage = () => {
  return (
    <div className="flex items-center justify-center ">
      <div className="w-[600px] h-[250px]">
        <Lottie animationData={pageNotFound} loop={true} autoPlay={true}/>
      </div>
    </div>
  );
};

export default NoPage;
