import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Search from "../components/Search";

function Channel() {
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
                {/* Top row: avatar */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="flex-shrink-0">
                    <img
                      src="https://media2.giphy.com/avatars/hbomax/Yo99fqMjGRZH.png"
                      alt=""
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    {/* {avatar ? (
                      <img
                        src={avatar}
                        alt={`${displayName} avatar`}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-sm text-gray-300">
                        {displayName.charAt(0)}
                      </div>
                    )} */}
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-white text-lg font-semibold truncate">
                      website_url
                    </h3>
                  </div>
                </div>
              </div>

              {/* Right:Top row: avatar + display name / username , Below: Gifs */}
              <div className="w-full md:w-3/5 flex flex-col items-center">
                {/* wrapper relative so overlays can sit on top */}
                {/* Title directly below the gif, centered */}
                <h2 className="text-white mt-3 text-center text-lg font-semibold break-words max-w-[760px]">
                  displayName
                </h2>
                <h4 className="text-indigo-600 text-sm truncate">username</h4>

                {/* Gifs */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3">
                  {/* Each gif */}
                </div>
                <div className="flex justify-center mt-6 mb-6">
                  <div>
                    <button className="px-6 py-2 bg-purple-600 text-white rounded-md hover:opacity-90 disabled:opacity-50">
                      "Load more"
                    </button>
                  </div>

                  {/* {hasMore ? (
          <button
            onClick={loadGifs}
            disabled={loading}
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load more GIFs"}
          </button>
        ) : (
          <div className="text-gray-400">No more GIFs</div>
        )} */}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden md:block"></div>
      </div>
    </>
  );
}

export default Channel;
