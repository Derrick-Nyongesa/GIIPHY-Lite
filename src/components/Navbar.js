import React from "react";
import LogoImage from "../images/logo.png";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div>
      <nav className="flex items-center justify-between p-2 ">
        <div className="flex items-center">
          <Link to="/" className="flex items-center no-underline">
            <img src={LogoImage} alt="Logo" className="h-12 w-12 mr-2" />
            <span className="text-white font-bold text-4xl">GIPHY-Lite</span>
          </Link>
        </div>
        <div>
          {/* <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Upload
          </button> */}
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
