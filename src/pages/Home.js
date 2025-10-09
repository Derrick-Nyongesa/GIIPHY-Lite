import React from "react";
import Navbar from "../components/Navbar";
import Search from "../components/Search";

function Home() {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="hidden md:block"></div>
        <div className="col-span-1 md:col-span-3 flex flex-col ">
          <Navbar />
          <Search />
        </div>
        <div className="hidden md:block"></div>
      </div>
    </div>
  );
}

export default Home;
