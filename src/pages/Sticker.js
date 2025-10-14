import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Search from "../components/Search";
import { useParams } from "react-router-dom";

function Sticker() {
  const { id } = useParams();
  const [sticker, setSticker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_KEY = process.env.REACT_APP_GIPHY_API_KEY;

  // overlay states
  const [showCopied, setShowCopied] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  // separate timers so they don't clobber each other
  const copiedTimerRef = useRef(null);
  const savedTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      // cleanup timers on unmount
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!id) return;
    const loadSticker = async () => {
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
        if (!res.ok) throw new Error("Failed to fetch sticker");
        const json = await res.json();
        setSticker(json.data || null);
      } catch (err) {
        console.error("Error fetching sticker:", err);
        setError("Failed to load sticker");
      } finally {
        setLoading(false);
      }
    };

    loadSticker();
  }, [id, API_KEY]);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-300">
        <Navbar />
        <Search />
        <div>Loading STICKER...</div>
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

  if (!sticker) {
    return (
      <div className="p-6 text-center text-gray-300">
        <Navbar />
        <Search />
        <div>STICKER not found</div>
      </div>
    );
  }

  // pick a good image URL (original preferred)
  const imageUrl =
    sticker.images?.original?.url ||
    sticker.images?.fixed_width?.url ||
    sticker.images?.downsized?.url ||
    "";

  const user = sticker.user || {};
  const displayName = user.display_name || user.username || "Unknown";
  const username = user.username ? `@${user.username}` : "";
  const avatar = user.avatar_url || "";
  const description = user.description || "";

  // Use same download URL in both copy and download
  const downloadUrl =
    imageUrl || sticker.images?.fixed_width?.url || sticker.url || "";

  // Copy to clipboard handler — copies the actual media URL (downloadUrl)
  const handleCopy = async () => {
    const textToCopy = downloadUrl || window.location.href;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // fallback for older browsers
        const textarea = document.createElement("textarea");
        textarea.value = textToCopy;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      // show green overlay for 2s
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
      setShowCopied(true);
      copiedTimerRef.current = setTimeout(() => {
        setShowCopied(false);
        copiedTimerRef.current = null;
      }, 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  // Download handler (fetch blob and save)
  const handleDownload = async () => {
    if (!downloadUrl) {
      console.error("No download URL available");
      return;
    }

    try {
      const res = await fetch(downloadUrl, { mode: "cors" });
      if (!res.ok) throw new Error("Failed to fetch file for download");
      const blob = await res.blob();

      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;

      // Use id or title-safe filename
      const safeTitle =
        (sticker.title || id || "sticker")
          .replace(/[^a-z0-9_\-\.()\s]/gi, "")
          .trim()
          .slice(0, 120) ||
        id ||
        "sticker";
      const filename = `${safeTitle}.sticker`;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      // release object URL after a bit
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);

      // show blue overlay for 2s
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
      setShowSaved(true);
      savedTimerRef.current = setTimeout(() => {
        setShowSaved(false);
        savedTimerRef.current = null;
      }, 2000);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="hidden md:block" />

        <div className="col-span-1 md:col-span-3 flex flex-col ">
          <Navbar />
          <Search />

          <div className="p-4">
            {/* layout: left user, center sticker (bigger & fixed max width), right actions */}
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

              {/* Center: sticker (larger, consistent max width) */}
              <div className="w-full md:w-3/5 flex flex-col items-center">
                {/* wrapper relative so overlays can sit on top */}
                <div className="relative rounded-md w-full max-w-[760px]">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={sticker.title || "sticker"}
                      className="rounded-md w-full h-auto object-contain"
                    />
                  ) : (
                    <div className="text-gray-400">No image available</div>
                  )}

                  {/* Copied overlay (green) */}
                  {showCopied && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-md z-50 pointer-events-none">
                      <div className="bg-green-500 px-4 py-2 rounded text-white font-medium text-sm">
                        Copied to Clipboard!
                      </div>
                    </div>
                  )}

                  {/* Saved overlay (blue/indigo) */}
                  {showSaved && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-md z-50 pointer-events-none">
                      <div className="bg-indigo-600 px-4 py-2 rounded text-white font-medium text-sm">
                        Saved on Downloads!
                      </div>
                    </div>
                  )}
                </div>

                {/* Title directly below the sticker, centered */}
                <h2 className="text-white mt-3 text-center text-lg font-semibold break-words max-w-[760px]">
                  {sticker.title || "Untitled"}
                </h2>
              </div>

              {/* Right: actions (narrow) */}
              <div className="w-full md:w-1/5 flex flex-col items-start gap-3">
                <button
                  onClick={handleCopy}
                  className="flex items-center px-2 py-1 hover:text-green-400 transition-colors duration-150 cursor-pointer focus:outline-none"
                  aria-label="Copy STICKER link"
                >
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
                </button>

                <button
                  onClick={handleDownload}
                  className="flex items-center px-2 py-1 mt-1 hover:text-indigo-500 transition-colors duration-150 cursor-pointer focus:outline-none"
                  aria-label="Download STICKER"
                >
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
                </button>
              </div>
            </div>

            {/* optional extra details */}
            <div className="mt-6 text-gray-400">
              <div>
                <strong>Giphy URL:</strong>{" "}
                <a
                  href={sticker.url}
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  View on GIPHY
                </a>
              </div>
              <div className="mt-2">
                <strong>Rating:</strong> {sticker.rating || "N/A"}
              </div>
              <div className="mt-2">
                <strong>Imported:</strong> {sticker.import_datetime || "N/A"}
              </div>
            </div>
          </div>
        </div>

        <div className="hidden md:block"></div>
      </div>
    </>
  );
}

export default Sticker;
