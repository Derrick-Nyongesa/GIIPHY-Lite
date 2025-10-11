import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Search from "../components/Search";
import { useParams } from "react-router-dom";

function Gif() {
  const { id } = useParams();
  const [gif, setGif] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_KEY = process.env.REACT_APP_GIPHY_API_KEY;

  useEffect(() => {
    if (!id) return;
    const loadGif = async () => {
      if (!API_KEY) {
        setError("Missing GIPHY API key");
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.giphy.com/v1/gifs/${id}?api_key=${API_KEY}&rating=g`
        );
        if (!res.ok) throw new Error("Failed to fetch gif");
        const json = await res.json();
        setGif(json.data || null);
      } catch (err) {
        console.error("Error fetching gif:", err);
        setError("Failed to load GIF");
      } finally {
        setLoading(false);
      }
    };

    loadGif();
  }, [id, API_KEY]);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-300">
        <Navbar />
        <Search />
        <div>Loading GIF...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-400">
        <Navbar />
        <Search />
        <div>{error}</div>
      </div>
    );
  }

  if (!gif) {
    return (
      <div className="p-6 text-center text-gray-300">
        <Navbar />
        <Search />
        <div>GIF not found</div>
      </div>
    );
  }

  // pick a good image URL (original preferred)
  const imageUrl =
    gif.images?.original?.url ||
    gif.images?.fixed_width?.url ||
    gif.images?.downsized?.url ||
    "";

  const user = gif.user || {};
  const displayName = user.display_name || user.username || "Unknown";
  const username = user.username ? `@${user.username}` : "";
  const avatar = user.avatar_url || "";
  const description = user.description || "";

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="hidden md:block" />

        <div className="col-span-1 md:col-span-3 flex flex-col ">
          <Navbar />
          <Search />

          <div className="p-4">
            {/* layout: left user, center gif (bigger & fixed max width), right actions */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              {/* Left: user info (narrow) */}
              <div className="w-full md:w-1/5 flex flex-col gap-3">
                {/* Top row: avatar + display name / username */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="flex-shrink-0">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt={`${displayName} avatar`}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-sm text-gray-300">
                        {displayName.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-white text-lg font-semibold truncate">
                      {displayName}
                    </h3>
                    {username && (
                      <h4 className="text-gray-400 text-sm truncate">
                        {username}
                      </h4>
                    )}
                  </div>
                </div>

                {/* Description: placed below the avatar + names */}
                {description && (
                  <p
                    className="text-gray-300 text-sm break-words whitespace-normal max-w-full"
                    style={{ wordWrap: "break-word" }}
                  >
                    {description}
                  </p>
                )}
              </div>

              {/* Center: gif (larger, consistent max width) */}
              <div className="w-full md:w-3/5 flex flex-col items-center">
                {imageUrl ? (
                  // full responsive width but limited to a consistent max width
                  <img
                    src={imageUrl}
                    alt={gif.title || "gif"}
                    className="rounded-md w-full max-w-[760px] h-auto object-contain"
                  />
                ) : (
                  <div className="text-gray-400">No image available</div>
                )}

                {/* Title directly below the gif, centered */}
                <h2 className="text-white mt-3 text-center text-lg font-semibold break-words max-w-[760px]">
                  {gif.title || "Untitled"}
                </h2>
              </div>

              {/* Right: actions (narrow) */}
              <div className="w-full md:w-1/5 flex flex-col items-start gap-3">
                <div className="hover:text-green-400 transition-colors duration-150 cursor-default">
                  {/* UI only, no copy logic per your note */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="inline-block align-middle mr-2 w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21.44 11.05l-9.19 9.19a5 5 0 0 1-7.07 0 5 5 0 0 1 0-7.07l8.48-8.48a3.5 3.5 0 0 1 4.95 4.95l-8.48 8.48a1.5 1.5 0 0 1-2.12 0 1.5 1.5 0 0 1 0-2.12l7.07-7.07" />
                  </svg>
                  <span>Copy Link</span>
                </div>

                <div className="mt-2 hover:text-indigo-500 transition-colors duration-150 cursor-default">
                  {/* UI only, no download logic per your note */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="inline-block align-middle mr-2 w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>Download</span>
                </div>
              </div>
            </div>

            {/* optional extra details */}
            <div className="mt-6 text-gray-400">
              <div>
                <strong>Giphy URL:</strong>{" "}
                <a
                  href={gif.url}
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  View on GIPHY
                </a>
              </div>
              <div className="mt-2">
                <strong>Rating:</strong> {gif.rating || "N/A"}
              </div>
              <div className="mt-2">
                <strong>Imported:</strong> {gif.import_datetime || "N/A"}
              </div>
            </div>
          </div>
        </div>

        <div className="hidden md:block"></div>
      </div>
    </>
  );
}

export default Gif;
