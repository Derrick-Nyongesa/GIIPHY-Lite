import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Search from "../components/Search";
import Gifs from "../components/Gifs";
import Stickers from "../components/Stickers";
import ArrowImage from "../images/arrow.png";

function Home() {
  const tabs = ["GIFs", "Stickers"];
  const [active, setActive] = useState("GIFs"); // GIFs default

  const renderContent = () => {
    switch (active) {
      case "GIFs":
        return <Gifs />;
      case "Stickers":
        return <Stickers />;
      default:
        return <Gifs />;
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="hidden md:block"></div>

        <div className="col-span-1 md:col-span-3 flex flex-col ">
          <Navbar />
          <Search />

          <div className="flex items-center justify-between mt-3 mb-4">
            <div className="flex items-center">
              <img src={ArrowImage} alt="Logo" className="h-9 w-9 mr-2" />
              <span className="text-white font-bold text-xl">Trending Now</span>
            </div>

            {/* Tabs */}
            <div>
              <div className="flex gap-3 bg-gray-500 rounded-full">
                {tabs.map((tab) => {
                  const isActive = tab === active;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActive(tab)}
                      className={
                        "px-6 py-2 text-sm font-medium transition-all focus:outline-none " +
                        (isActive && "bg-purple-600 text-white rounded-full")
                      }
                      aria-pressed={isActive}
                      aria-label={`Show ${tab}`}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Content area */}
          <div>{renderContent()}</div>
        </div>

        <div className="hidden md:block"></div>
      </div>
    </div>
  );
}

export default Home;
