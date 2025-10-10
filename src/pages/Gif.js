import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Search from "../components/Search";
import { useParams } from "react-router-dom";

function Gif() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="hidden md:block"></div>

        <div className="col-span-1 md:col-span-3 flex flex-col ">
          <Navbar />
          <Search />

          <div>
            <div className="flex justify-between mt-3 mb-4 gap-9">
              <div>
                {/* User */}
                <div>
                  <div className="flex justify-between gap-9">
                    <div>
                      <img src="" alt="avatar_url" />
                    </div>
                    <div>
                      <h3>display_name</h3>
                      <h4>@username</h4>
                      <p>description</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <img src="" alt="gif url" />
                <h2>Title</h2>
              </div>
              <div>
                <div className=" hover:text-green-400 transition-colors duration-150 cursor-pointer">
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

                <div className="mt-2  hover:text-indigo-500 transition-colors duration-150 cursor-pointer">
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
          </div>
        </div>

        <div className="hidden md:block"></div>
      </div>
    </>
  );
}

export default Gif;
