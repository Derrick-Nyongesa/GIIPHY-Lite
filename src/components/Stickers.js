import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Stickers() {
  const [stickers, setStickers] = useState([]);
  const [offset, setOffset] = useState(0);
  const LIMIT = 12;
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const API_KEY = process.env.REACT_APP_GIPHY_API_KEY;

  const navigate = useNavigate();

  useEffect(() => {
    loadStickers();
  }, []);

  const loadStickers = async () => {
    if (!API_KEY) {
      console.error("Missing REACT_APP_GIPHY_API_KEY in .env");
      return;
    }

    setLoading(true);
    try {
      const url = `https://api.giphy.com/v1/stickers/trending?api_key=${API_KEY}&limit=${LIMIT}&offset=${offset}&rating=g&bundle=messaging_non_clips`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch trending stickers");
      const json = await res.json();

      const newStickers = (json.data || []).map((s) => ({
        id: s.id,
        title: s.title,
        url:
          s.images?.fixed_width?.url ||
          s.images?.fixed_width_small?.url ||
          s.images?.original?.url ||
          "",
        width: s.images?.fixed_width?.width,
        height: s.images?.fixed_width?.height,
        // user info (may be absent) so overlay can show it
        username: s.username || s.user?.username || "",
        user_display_name: s.user?.display_name || "",
        user_avatar: s.user?.avatar_url || "",
      }));

      setStickers((prev) => [...prev, ...newStickers]);
      setOffset((prev) => prev + LIMIT);

      if ((json.data || []).length < LIMIT) setHasMore(false);
    } catch (err) {
      console.error("Error loading stickers:", err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {stickers.map((sticker) => (
          <div
            key={sticker.id}
            role="button"
            tabIndex={0}
            onClick={() => navigate(`/sticker/${sticker.id}`)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                navigate(`/sticker/${sticker.id}`);
            }}
            className="group relative rounded-md overflow-hidden bg-gray-800 flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-label={`Open sticker ${sticker.title || sticker.id}`}
          >
            {sticker.url ? (
              <img
                src={sticker.url}
                alt={sticker.title || "sticker"}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="text-gray-400">No preview</div>
            )}
            {/* Hover overlay: show user display_name (use group-hover on parent) */}
            <div className="absolute inset-0 flex items-end pointer-events-none">
              <div className="w-full bg-gradient-to-t from-black/70 to-transparent px-2 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <div className="text-sm text-white font-medium truncate">
                  {sticker.user_display_name || sticker.username || "Unknown"}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6 mb-6">
        {hasMore ? (
          <button
            onClick={loadStickers}
            disabled={loading}
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Loadins..." : "Load more Stickers"}
          </button>
        ) : (
          <div className="text-gray-400">No more Stickers</div>
        )}
      </div>
    </>
  );
}

export default Stickers;
