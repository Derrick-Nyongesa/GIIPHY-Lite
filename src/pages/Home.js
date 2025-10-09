import React from "react";
import Navbar from "../components/Navbar";
import Search from "../components/Search";
import ArrowImage from "../images/arrow.png";

function Home() {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="hidden md:block"></div>
        <div className="col-span-1 md:col-span-3 flex flex-col ">
          <Navbar />
          <Search />
          <div className="flex items-center justify-between mt-6 mb-4">
            <div className="flex items-center">
              <img src={ArrowImage} alt="Logo" className="h-09 w-09 mr-2" />
              <span className="text-white font-bold text-xl">Trending Now</span>
            </div>
            <div>{/* Tabs */}</div>
          </div>
        </div>
        <div className="hidden md:block"></div>
      </div>
    </div>
  );
}

export default Home;
