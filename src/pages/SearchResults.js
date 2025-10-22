// SearchResults.js
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Search from "../components/Search";

function SearchResults() {
  const { query } = useParams();
  const navigate = useNavigate();
  const API_KEY = process.env.REACT_APP_GIPHY_API_KEY;
  const LIMIT = 12;

  // gifs state + paging
  const [gifs, setGifs] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [gifLoading, setGifLoading] = useState(false);

  // channels (extracted from GIF.user) - deduped by username
  const [channels, setChannels] = useState([]);

  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);

  // build the search URL
  const buildSearchUrl = (q, limit, offset) => {
    const encodedQ = encodeURIComponent(q || "");
    return `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${encodedQ}&limit=${limit}&offset=${offset}&rating=g&lang=en&bundle=messaging_non_clips`;
  };

  const extractChannelsFromData = (data = []) => {
    // data is an array of gif objects; some have a .user object
    // return array of { username, display_name, avatar_url } deduped by username
    const found = {};
    data.forEach((g) => {
      const u = g.user;
      if (u && (u.username || u.display_name)) {
        const key = (u.username || u.display_name || "").toLowerCase();
        if (!found[key]) {
          found[key] = {
            username: u.username || u.display_name || key,
            display_name:
              u.display_name ||
              u.username ||
              u.display_name ||
              u.username ||
              key,
            avatar_url: u.avatar_url || "",
          };
        }
      }
    });
    return Object.values(found);
  };

  const mapGifItem = (g) => ({
    id: g.id,
    title: g.title,
    url:
      g.images?.fixed_width?.url ||
      g.images?.fixed_width_small?.url ||
      g.images?.original?.url ||
      "",
    width: g.images?.fixed_width?.width,
    height: g.images?.fixed_width?.height,
    user: g.user || null,
  });

  const loadMoreGifs = useCallback(
    async (opts = {}) => {
      // opts can override offset (not used here) but kept for potential extension
      if (!API_KEY) {
        setError("Missing GIPHY API key");
        setInitialLoading(false);
        setGifLoading(false);
        setHasMore(false);
        return;
      }

      if (!query) {
        setError("No search query provided");
        setInitialLoading(false);
        setGifLoading(false);
        return;
      }

      if (!hasMore) return;

      setGifLoading(true);
      try {
        const url = buildSearchUrl(query, LIMIT, offset);
        console.log("Search loadMore URL:", url);
        const res = await fetch(url);
        console.log("Search fetch status:", res.status);
        if (!res.ok) throw new Error("Failed to fetch search results");
        const json = await res.json();
        const data = json.data || [];

        // map gifs
        const newGifs = data.map(mapGifItem);
        setGifs((prev) => [...prev, ...newGifs]);
        setOffset((prev) => prev + LIMIT);

        // extract channels and merge
        const newChannels = extractChannelsFromData(data);

        if (offset === 0) {
          // first page for this query: replace channels entirely
          setChannels(newChannels);
        } else if (newChannels.length > 0) {
          // subsequent pages: merge using functional update to avoid stale closures
          setChannels((prev) => {
            const merged = {};
            prev.forEach((c) => {
              merged[c.username?.toLowerCase()] = c;
            });
            newChannels.forEach((nc) => {
              merged[nc.username?.toLowerCase()] =
                merged[nc.username?.toLowerCase()] || nc;
            });
            return Object.values(merged);
          });
        }

        if (data.length < LIMIT) {
          setHasMore(false);
        }
      } catch (err) {
        console.error("Error loading search gifs:", err);
        setError("Failed to load GIFs");
        setHasMore(false);
      } finally {
        setGifLoading(false);
        setInitialLoading(false);
      }
    },

    [API_KEY, query, offset, hasMore, channels]
  );

  // initial load when query changes
  useEffect(() => {
    setGifs([]);
    setOffset(0);
    setHasMore(true);
    setGifLoading(false);
    setChannels([]);
    setError(null);
    setInitialLoading(true);

    // load first page
    loadMoreGifs();
  }, [query]);

  const onGifClick = (id) => {
    navigate(`/gif/${id}`);
  };

  const onChannelClick = (username) => {
    if (!username) return;
    // navigate to channel route (username expected to be raw, without @)
    navigate(`/channel/${username}`);
  };

  if (initialLoading) {
    return (
      <div className="p-6 text-center text-gray-300">
        <Navbar />
        <Search />
        <div>Searching for "{query}"...</div>
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
          <div className="max-w-6xl mx-auto mt-6 space-y-8">
            {/* Channels block */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white text-lg font-semibold">
                  Channels {channels.length > 0 ? `(${channels.length})` : ""}
                </h3>
                <div className="text-sm text-gray-400">
                  {channels.length === 0
                    ? "No channels found"
                    : `${channels.length} channel${
                        channels.length > 1 ? "s" : ""
                      }`}
                </div>
              </div>

              {channels.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {channels.map((c) => (
                    <button
                      key={c.username}
                      onClick={() => onChannelClick(c.username)}
                      className="flex items-center gap-3 p-3 bg-gray-800 rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      aria-label={`Open channel ${
                        c.display_name || c.username
                      }`}
                    >
                      {c.avatar_url ? (
                        <img
                          src={c.avatar_url}
                          alt={`${c.display_name || c.username} avatar`}
                          className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-sm text-gray-300 flex-shrink-0">
                          {(
                            c.display_name?.charAt(0) ||
                            c.username?.charAt(0) ||
                            "U"
                          ).toUpperCase()}
                        </div>
                      )}

                      <div className="text-left min-w-0">
                        <div className="text-sm text-white font-medium truncate">
                          {c.display_name}
                        </div>
                        <div className="text-xs text-gray-400 truncate">
                          @{c.username}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </section>

            {/* GIFs grid */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white text-lg font-semibold">GIFs</h3>
                <div className="text-sm text-gray-400">
                  Showing {gifs.length} result{gifs.length !== 1 ? "s" : ""}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {gifs.length === 0 && !gifLoading && (
                  <div className="col-span-full text-center text-gray-400">
                    No GIFs found for "{query}"
                  </div>
                )}

                {gifs.map((gif) => (
                  <div
                    key={gif.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => onGifClick(gif.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        onGifClick(gif.id);
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
                    onClick={() => loadMoreGifs()}
                    disabled={gifLoading}
                    className="px-6 py-2 bg-purple-600 text-white rounded-md hover:opacity-90 disabled:opacity-50"
                  >
                    {gifLoading ? "Loading..." : "Load more GIFs"}
                  </button>
                ) : (
                  <div className="text-gray-400">No more GIFs</div>
                )}
              </div>
            </section>
          </div>
        </div>
        <div className="hidden md:block" />
      </div>
    </>
  );
}

export default SearchResults;
