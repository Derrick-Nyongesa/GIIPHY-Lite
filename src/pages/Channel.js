import { useState, useEffect } from "react";
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
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // whenever channelName changes, reset state and load first page
    setGifs([]);
    setOffset(0);
    setHasMore(true);
    setUserInfo(null);
    setError(null);
    setInitialLoading(true);
    loadMore(); // load first page
  }, [channelName]);

  const loadMore = async () => {
    if (!API_KEY) {
      setError("Missing GIPHY API key");
      setInitialLoading(false);
      setLoading(false);
      setHasMore(false);
      return;
    }

    if (!channelName) {
      setError("No channel specified");
      setInitialLoading(false);
      setLoading(false);
      return;
    }

    if (!hasMore) return;

    setLoading(true);
    try {
      // use @username in q to fetch that user's GIFs per GIPHY docs
      // note: no need to include '@' in the displayed username; channelName should be raw username
      const q = encodeURIComponent(`${channelName}`);
      //           https://api.giphy.com/v1/gifs/search?api_key=m9Bxt2i0wVxefxK8chnp8w2vMlP6eqKH&q=hbomax&limit=5
      const url = `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${q}&limit=${LIMIT}`;
      console.log("Channel loadMore URL:", url);
      const res = await fetch(url);
      console.log("Channel fetch status:", res.status);
      if (!res.ok) throw new Error("Failed to fetch channel gifs");
      const json = await res.json();
      console.log("Channel search response:", json);
      const data = json.data || [];

      // If we don't yet have userInfo, try to extract from first returned GIF's user object
      if (!userInfo && data.length > 0) {
        const u = data[0].user || null;
        if (u) {
          setUserInfo({
            avatar_url: u.avatar_url || "",
            display_name: u.display_name || u.username || channelName,
            username: u.username || channelName,
            profile_url:
              u.profile_url || `https://giphy.com/${u.username || channelName}`,
            banner_url: u.banner_url || "",
            description: u.description || "",
          });
        }
      }

      // map gifs to the minimal data needed
      const newGifs = data.map((g) => ({
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

      setGifs((prev) => [...prev, ...newGifs]);
      setOffset((prev) => prev + LIMIT);

      if (data.length < LIMIT) {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error loading channel gifs:", err);
      setError("Failed to load GIFs");
      setHasMore(false);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  const onGifClick = (id) => {
    navigate(`/gif/${id}`);
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
    <div className="p-4">
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
            <div className="text-gray-400">No user information available</div>
          )}
        </div>

        {/* gifs grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
          {gifs.length === 0 && !loading && (
            <div className="col-span-full text-center text-gray-400">
              No GIFs found for @{channelName}
            </div>
          )}

          {gifs.map((gif) => (
            <div
              key={gif.id}
              role="button"
              tabIndex={0}
              onClick={() => onGifClick(gif.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onGifClick(gif.id);
              }}
              className="group relative rounded-md overflow-hidden bg-gray-800 flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label={`Open gif ${gif.title || gif.id}`}
            >
              {gif.url ? (
                <img
                  src={gif.url}
                  alt={gif.title || "gif"}
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
                    {gif.title || "Untitled"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load more */}
        <div className="flex justify-center mt-6 mb-6">
          {error && <div className="text-red-400 mr-4">{error}</div>}
          {hasMore ? (
            <button
              onClick={loadMore}
              disabled={loading}
              className="px-6 py-2 bg-purple-600 text-white rounded-md hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Load more GIFs"}
            </button>
          ) : (
            <div className="text-gray-400">No more GIFs</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Channel;
