import { useState, useEffect } from "react";
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

  // GIF related state
  const [gifs, setGifs] = useState([]); // accumulated gifs
  const [offset, setOffset] = useState(0);
  const LIMIT = 12;
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // assume more until API says otherwise
  const API_KEY = process.env.REACT_APP_GIPHY_API_KEY;

  useEffect(() => {
    // initial load (only for GIFs)
    if (active === "GIFs" && gifs.length === 0) {
      loadGifs();
    }
  }, [active]);

  const loadGifs = async () => {
    if (!API_KEY) {
      console.error("Missing REACT_APP_GIPHY_API_KEY in .env");
      return;
    }
    setLoading(true);
    try {
      const url = `https://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}&limit=${LIMIT}&offset=${offset}&rating=g&bundle=messaging_non_clips`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch trending gifs");
      const json = await res.json();

      // Append new gifs
      const newGifs = (json.data || []).map((g) => ({
        id: g.id,
        title: g.title,
        url:
          g.images && g.images.fixed_width
            ? g.images.fixed_width.url
            : g.images?.original?.url ?? "",
        width: g.images?.fixed_width?.width,
        height: g.images?.fixed_width?.height,
      }));

      setGifs((prev) => [...prev, ...newGifs]);

      // Update offset and hasMore
      setOffset((prev) => prev + LIMIT);
      // If fewer than LIMIT returned, no more pages
      if ((json.data || []).length < LIMIT) setHasMore(false);
    } catch (err) {
      console.error("Error loading gifs:", err);
      setHasMore(false);
    } finally {
      setLoading(false);
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
                      onClick={() => {
                        setActive(tab);
                        // If switching to GIFs and we have none loaded yet, trigger load
                        if (tab === "GIFs" && gifs.length === 0) {
                          // reset offset so load starts from 0
                          setOffset(0);
                          // ensure gifs are reset before loading
                          setGifs([]);
                          setHasMore(true);
                          // load will be triggered by effect OR call directly:
                          // calling directly ensures immediate fetch
                          loadGifs();
                        }
                      }}
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
          <div>
            {/* <h3 className="text-white text-lg font-semibold mb-3">{active}</h3> */}

            {active === "GIFs" ? (
              <>
                {/* 4-column grid on md+ */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {gifs.map((gif, idx) => {
                    return (
                      <div
                        key={gif.id}
                        className={`rounded-md overflow-hidden bg-gray-800  flex items-center justify-center`}
                      >
                        {/* Use img with object-cover to fill box */}
                        {gif.url ? (
                          <img
                            src={gif.url}
                            alt={gif.title || "gif"}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="text-gray-400">No preview</div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Load more button */}
                <div className="flex justify-center mt-6 mb-6">
                  {hasMore ? (
                    <button
                      onClick={loadGifs}
                      disabled={loading}
                      className="px-6 py-2 bg-purple-600 text-white rounded-md hover:opacity-90 disabled:opacity-50"
                    >
                      {loading ? "Loading..." : "Load more GIFs"}
                    </button>
                  ) : (
                    <div className="text-gray-400">No more GIFs</div>
                  )}
                </div>
              </>
            ) : (
              // Stickers & Clips - use dummy data for now
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {dummyData[active].map((item) => (
                  <div
                    key={item.id}
                    className="bg-gray-900/60 p-4 rounded-lg shadow-sm border border-gray-800"
                  >
                    <div className="h-40 bg-gray-800 rounded-md mb-3 flex items-center justify-center">
                      <span className="text-gray-400">Media placeholder</span>
                    </div>
                    <h4 className="text-white font-semibold">{item.title}</h4>
                    <p className="text-gray-400 text-sm mt-1">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="hidden md:block"></div>
      </div>
    </div>
  );
}

export default Home;
