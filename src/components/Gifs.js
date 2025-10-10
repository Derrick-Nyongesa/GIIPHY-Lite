import { useState, useEffect } from "react";

function Gifs() {
  const [gifs, setGifs] = useState([]);
  const [offset, setOffset] = useState(0);
  const LIMIT = 12;
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const API_KEY = process.env.REACT_APP_GIPHY_API_KEY;

  useEffect(() => {
    loadGifs();
  }, []);

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

      const newGifs = (json.data || []).map((g) => ({
        id: g.id,
        title: g.title,
        url: g.images?.fixed_width?.url || g.images?.original?.url || "",
        width: g.images?.fixed_width?.width,
        height: g.images?.fixed_width?.height,
      }));

      setGifs((prev) => [...prev, ...newGifs]);
      setOffset((prev) => prev + LIMIT);

      if ((json.data || []).length < LIMIT) setHasMore(false);
    } catch (err) {
      console.error("Error loading gifs:", err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {gifs.map((gif) => (
          <div
            key={gif.id}
            className="rounded-md overflow-hidden bg-gray-800 flex items-center justify-center"
          >
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
        ))}
      </div>

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
  );
}

export default Gifs;
