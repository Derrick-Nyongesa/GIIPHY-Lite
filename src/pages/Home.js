import { useState } from "react";
import Navbar from "../components/Navbar";
import Search from "../components/Search";
import ArrowImage from "../images/arrow.png";

const dummyData = {
  GIFs: [
    { id: 1, title: "Funny Cat", description: "A cat doing a silly dance" },
    { id: 2, title: "Happy Dance", description: "Looping celebration" },
    { id: 3, title: "Surprised Pikachu", description: "Classic reaction" },
  ],
  Stickers: [
    { id: 1, title: "Love Sticker", description: "Heart sticker" },
    { id: 2, title: "Thumbs Up", description: "Approval sticker" },
    { id: 3, title: "Party Popper", description: "Sticker for celebrations" },
  ],
  Clips: [
    { id: 1, title: "Short Clip 1", description: "10s teaser" },
    { id: 2, title: "Short Clip 2", description: "Highlight moment" },
    { id: 3, title: "Short Clip 3", description: "Loopable clip" },
  ],
};

function Home() {
  const tabs = ["GIFs", "Stickers", "Clips"];
  const [active, setActive] = useState("GIFs"); // GIFs default
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="hidden md:block"></div>
        <div className="col-span-1 md:col-span-3 flex flex-col ">
          <Navbar />
          <Search />

          <div className="flex items-center justify-between mt-6 mb-4">
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
                        "px-8 py-2 text-sm font-medium transition-all focus:outline-none  " +
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
          <div className="mt-4">
            <h3 className="text-white text-lg font-semibold mb-3">{active}</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dummyData[active].map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-900/60 p-4 rounded-lg shadow-sm border border-gray-800"
                >
                  <div className="h-40 bg-gray-800 rounded-md mb-3 flex items-center justify-center">
                    {/* placeholder box for image/video */}
                    <span className="text-gray-400">Media placeholder</span>
                  </div>
                  <h4 className="text-white font-semibold">{item.title}</h4>
                  <p className="text-gray-400 text-sm mt-1">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden md:block"></div>
      </div>
    </div>
  );
}

export default Home;
