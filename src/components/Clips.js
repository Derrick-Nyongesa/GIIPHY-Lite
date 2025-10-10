import { useState, useEffect } from "react";

function Clips() {
  const [clips, setClips] = useState([]);
  const [offset, setOffset] = useState(0);
  const LIMIT = 12;
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const API_KEY = process.env.REACT_APP_GIPHY_API_KEY;

  useEffect(() => {
    loadClips();
  }, []);

  const loadClips = async () => {
    if (!API_KEY) {
      console.error("Missing REACT_APP_GIPHY_API_KEY in .env");
      return;
    }

    setLoading(true);
    try {
      const url = `https://api.giphy.com/v1/clips/trending?api_key=${API_KEY}&limit=${LIMIT}&offset=${offset}&rating=g`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch trending clips");
      const json = await res.json();

      const newClips = (json.data || []).map((c) => ({
        id: c.id,
        title: c.title,
        url: c.images?.fixed_width?.mp4 || "",
        preview: c.images?.fixed_width_still?.url || "",
        width: c.images?.fixed_width?.width,
        height: c.images?.fixed_width?.height,
      }));

      setClips((prev) => [...prev, ...newClips]);
      setOffset((prev) => prev + LIMIT);

      if ((json.data || []).length < LIMIT) setHasMore(false);
    } catch (err) {
      console.error("Error loading clips:", err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {clips.map((clip) => (
          <div
            key={clip.id}
            className="rounded-md overflow-hidden bg-gray-800 flex items-center justify-center"
          >
            {clip.url ? (
              <video
                src={clip.url}
                poster={clip.preview}
                className="w-full h-full object-cover"
                muted
                loop
                playsInline
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
            onClick={loadClips}
            disabled={loading}
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load more Clips"}
          </button>
        ) : (
          <div className="text-gray-400">No more Clips</div>
        )}
      </div>
    </>
  );
}

export default Clips;
