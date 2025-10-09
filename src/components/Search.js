import React from "react";

export default function Search() {
  return (
    <form>
      <div className="col-span-full">
        <div className="relative">
          <input
            type="text"
            placeholder="Search all GIFs and Stickers"
            aria-label="Search GIFs and Stickers"
            style={{
              resize: "vertical",
              minHeight: "4.5rem",
              paddingRight: "4.5rem",
              borderRadius: "0.3rem",
            }}
            className={
              "block w-full rounded-l-md rounded-r-none border-0 py-3 text-gray-900 shadow-sm " +
              "ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 placeholder:text-lg " +
              "focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            }
          />

          {/* Button flush with the right edge of the input (no gap) */}
          <button
            type="submit"
            aria-label="Search"
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: "4.5rem",
              minHeight: "4.5rem",
              borderRadius: "0.3rem",
            }}
            className="flex items-center justify-center rounded-r-md bg-pink-500 text-white shadow"
          >
            {/* Larger white search icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-9 w-9"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A6.5 6.5 0 1110.5 4a6.5 6.5 0 016.15 12.65z"
              />
            </svg>
          </button>
        </div>
      </div>
    </form>
  );
}
