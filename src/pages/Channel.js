import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Search from "../components/Search";

function Channel() {
  const { channelName } = useParams(); // expects the raw username (no @)
  const navigate = useNavigate();
  const API_KEY = process.env.REACT_APP_GIPHY_API_KEY;
  const LIMIT = 12;

  const [userInfo, setUserInfo] = useState(null); // { avatar_url, display_name, username, profile_url, banner_url, description? }
  const [gifs, setGifs] = useState([]);
  const [gifOffset, setGifOffset] = useState(0);
  const [gifHasMore, setGifHasMore] = useState(true);
  const [gifLoading, setGifLoading] = useState(false);
  const [stickers, setStickers] = useState([]);
  const [stickerOffset, setStickerOffset] = useState(0);
  const [stickerHasMore, setStickerHasMore] = useState(true);
  const [stickerLoading, setStickerLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);

  const tabs = ["GIFs", "Stickers"];
  const [active, setActive] = useState("GIFs"); // GIFs default

  const fetchUrlForActive = (q, limit, offset) => {
    const encodedQ = encodeURIComponent(q);
    if (active === "Stickers") {
      return `https://api.giphy.com/v1/stickers/search?api_key=${API_KEY}&q=${encodedQ}&limit=${limit}&offset=${offset}&rating=g&lang=en&bundle=messaging_non_clips`;
    }
    // default GIFs
    return `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${encodedQ}&limit=${limit}&offset=${offset}&rating=g&lang=en`;
  };

  const loadMore = useCallback(
    async (opts = {}) => {
      // opts can override which tab to load (useful on initial load)
      const target = opts.tab || active;

      if (!API_KEY) {
        setError("Missing GIPHY API key");
        setInitialLoading(false);
        setGifLoading(false);
        setStickerLoading(false);
        setGifHasMore(false);
        setStickerHasMore(false);
        return;
      }

      if (!channelName) {
        setError("No channel specified");
        setInitialLoading(false);
        setGifLoading(false);
        setStickerLoading(false);
        return;
      }

      // determine paging state for target
      const isStickers = target === "Stickers";
      if (isStickers && !stickerHasMore) return;
      if (!isStickers && !gifHasMore) return;

      // set loading flags
      if (isStickers) setStickerLoading(true);
      else setGifLoading(true);

      try {
        const q = `${channelName}`; // channelName is raw username
        const offset = isStickers ? stickerOffset : gifOffset;
        const url = fetchUrlForActive(q, LIMIT, offset);
        console.log(`Channel loadMore URL (${target}):`, url);

        const res = await fetch(url);
        console.log("Channel fetch status:", res.status);
        if (!res.ok)
          throw new Error(`Failed to fetch channel ${target.toLowerCase()}`);

        const json = await res.json();
        console.log(`Channel ${target} search response:`, json);
        const data = json.data || [];

        // Try to set user info if not set yet and a user object exists on returned item
        if (!userInfo && data.length > 0) {
          const u = data[0].user || null;
          if (u) {
            setUserInfo({
              avatar_url: u.avatar_url || "",
              display_name: u.display_name || u.username || channelName,
              username: u.username || channelName,
              profile_url:
                u.profile_url ||
                `https://giphy.com/${u.username || channelName}`,
              banner_url: u.banner_url || "",
              description: u.description || "",
            });
          }
        }

        const newItems = data.map((g) => ({
          id: g.id,
          title: g.title,
          url:
            g.images?.fixed_width?.url ||
            g.images?.fixed_width_small?.url ||
            g.images?.original?.url ||
            "",
          width: g.images?.fixed_width?.width,
          height: g.images?.fixed_width?.height,
        }));

        if (isStickers) {
          setStickers((prev) => [...prev, ...newItems]);
          setStickerOffset((prev) => prev + LIMIT);
          if (data.length < LIMIT) setStickerHasMore(false);
        } else {
          setGifs((prev) => [...prev, ...newItems]);
          setGifOffset((prev) => prev + LIMIT);
          if (data.length < LIMIT) setGifHasMore(false);
        }
      } catch (err) {
        console.error("Error loading channel content:", err);
        setError(`Failed to load ${active}`);
        if (active === "Stickers") setStickerHasMore(false);
        else setGifHasMore(false);
      } finally {
        setGifLoading(false);
        setStickerLoading(false);
        setInitialLoading(false);
      }
    },
    [
      API_KEY,
      channelName,
      active,
      gifOffset,
      stickerOffset,
      gifHasMore,
      stickerHasMore,
      userInfo,
    ]
  );

  // initial load when channelName changes: reset both GIFs and Stickers states and load first page for the active tab (GIFs by default)
  useEffect(() => {
    setGifs([]);
    setGifOffset(0);
    setGifHasMore(true);
    setGifLoading(false);

    setStickers([]);
    setStickerOffset(0);
    setStickerHasMore(true);
    setStickerLoading(false);

    setUserInfo(null);
    setError(null);
    setInitialLoading(true);

    // ensure active is GIFs on channel change - feel free to change if you want to keep last active across channels
    setActive("GIFs");

    // load first page for GIFs
    loadMore({ tab: "GIFs" });
  }, [channelName]);

  // when user switches tabs, if the target tab has no items yet, load its first page
  useEffect(() => {
    if (active === "Stickers" && stickers.length === 0 && !stickerLoading) {
      loadMore({ tab: "Stickers" });
    }
    // No need to load GIFs on switch since initial channel load already fetches them.
  }, [active]);

  const onGifClick = (id) => {
    navigate(`/gif/${id}`);
  };

  const onStickerClick = (id) => {
    navigate(`/sticker/${id}`);
  };

  const renderGrid = () => {
    const isStickers = active === "Stickers";
    const items = isStickers ? stickers : gifs;
    const loading = isStickers ? stickerLoading : gifLoading;

    return (
      <>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
          {items.length === 0 && !loading && (
            <div className="col-span-full text-center text-gray-400">
              {isStickers
                ? `No Stickers found for @${channelName}`
                : `No GIFs found for @${channelName}`}
            </div>
          )}

          {items.map((item) => (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={() =>
                isStickers ? onStickerClick(item.id) : onGifClick(item.id)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  isStickers ? onStickerClick(item.id) : onGifClick(item.id);
                }
              }}
              className="group relative rounded-md overflow-hidden bg-gray-800 flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label={`Open ${isStickers ? "sticker" : "gif"} ${
                item.title || item.id
              }`}
            >
              {item.url ? (
                <img
                  src={item.url}
                  alt={item.title || (isStickers ? "sticker" : "gif")}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="text-gray-400 p-4">No preview</div>
              )}

              {/* Hover overlay: show title */}
              <div className="absolute inset-0 flex items-end pointer-events-none">
                <div className="w-full bg-gradient-to-t from-black/70 to-transparent px-2 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  <div className="text-sm text-white font-medium truncate">
                    {item.title || "Untitled"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load more */}
        <div className="flex justify-center mt-6 mb-6">
          {error && <div className="text-red-400 mr-4">{error}</div>}
          {(isStickers ? stickerHasMore : gifHasMore) ? (
            <button
              onClick={() => loadMore({ tab: active })}
              disabled={isStickers ? stickerLoading : gifLoading}
              className="px-6 py-2 bg-purple-600 text-white rounded-md hover:opacity-90 disabled:opacity-50"
            >
              {(isStickers ? stickerLoading : gifLoading)
                ? `Loading...`
                : `Load more ${isStickers ? "Stickers" : "GIFs"}`}
            </button>
          ) : (
            <div className="text-gray-400">
              No more {isStickers ? "Stickers" : "GIFs"}
            </div>
          )}
        </div>
      </>
    );
  };

  if (initialLoading) {
    return (
      <div className="p-6 text-center text-gray-300">
        <Navbar />
        <Search />
        <div>Loading channel...</div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="hidden md:block" />
        <div className="col-span-1 md:col-span-3 flex flex-col ">
          <Navbar />
          <Search />
          <div className="max-w-5xl mx-auto mt-6">
            {/* Top: user info once */}
            <div className="flex items-center gap-4 bg-gray-800 p-4 rounded-md">
              {userInfo ? (
                <>
                  <div className="flex-shrink-0">
                    {userInfo.avatar_url ? (
                      <img
                        src={userInfo.avatar_url}
                        alt={`${userInfo.display_name} avatar`}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-sm text-gray-300">
                        {userInfo.display_name?.charAt(0) || "U"}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-white text-lg font-semibold truncate">
                      {userInfo.display_name}
                    </h2>
                    <div className="text-gray-400 text-sm truncate">
                      @{userInfo.username}
                    </div>
                    {userInfo.description && (
                      <p className="text-gray-300 text-sm mt-2">
                        {userInfo.description}
                      </p>
                    )}
                  </div>

                  <div className="ml-auto">
                    <a
                      href={userInfo.profile_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm underline text-gray-300"
                    >
                      View on GIPHY
                    </a>
                  </div>
                </>
              ) : (
                <div className="text-gray-400">
                  No user information available
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-3 mb-4">
              <div className="flex items-center"></div>

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

            {/* grid (GIFs or Stickers depending on active) */}
            {renderGrid()}
          </div>
        </div>
        <div className="hidden md:block" />
      </div>
    </>
  );
}

export default Channel;
