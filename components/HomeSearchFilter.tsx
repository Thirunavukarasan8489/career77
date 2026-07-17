"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomeSearchFilter() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("query", query.trim());
    if (experience) params.set("experience", experience);
    if (location.trim()) params.set("location", location.trim());

    router.push(`/openings?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="w-full max-w-4xl bg-white border border-zinc-200/80 rounded-2xl md:rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_35px_rgb(0,0,0,0.07)] transition-all p-3 md:p-2 flex flex-col md:flex-row md:items-center gap-3 md:gap-0"
    >
      {/* Skills / Designations / Companies input */}
      <div className="flex items-center gap-3 flex-1 px-3 py-1">
        <svg
          className="w-5 h-5 text-zinc-400 shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Enter skills / designations / companies"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full text-sm text-zinc-800 placeholder-zinc-400 bg-transparent outline-none py-1.5"
        />
      </div>

      {/* Vertical Divider 1 */}
      <div className="hidden md:block h-8 w-px bg-zinc-200" />

      {/* Experience Select */}
      <div className="flex items-center gap-2 md:w-[220px] px-3 md:px-5 py-1 relative">
        <svg
          className="w-4.5 h-4.5 text-zinc-400 shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        <select
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          className="w-full text-sm text-zinc-700 bg-transparent outline-none py-1.5 cursor-pointer appearance-none pr-8 focus:text-zinc-900"
        >
          <option value="" className="text-zinc-500">
            Select experience
          </option>
          <option value="Fresher" className="text-zinc-800">
            Fresher (0-1 yrs)
          </option>
          <option value="1-3" className="text-zinc-800">
            1-3 Years
          </option>
          <option value="3-5" className="text-zinc-800">
            3-5 Years
          </option>
          <option value="5-10" className="text-zinc-800">
            5-10 Years
          </option>
          <option value="10+" className="text-zinc-800">
            10+ Years
          </option>
        </select>
        {/* Down Chevron */}
        <div className="absolute right-3 md:right-5 pointer-events-none text-zinc-400">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Vertical Divider 2 */}
      <div className="hidden md:block h-8 w-px bg-zinc-200" />

      {/* Location Input */}
      <div className="flex items-center gap-2.5 md:w-[220px] px-3 md:px-5 py-1">
        <svg
          className="w-4.5 h-4.5 text-zinc-400 shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Enter location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full text-sm text-zinc-800 placeholder-zinc-400 bg-transparent outline-none py-1.5"
        />
      </div>

      {/* Search Button */}
      <button
        type="submit"
        className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-8 py-3.5 rounded-xl md:rounded-full shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-300 md:mr-1 cursor-pointer shrink-0"
      >
        Search
      </button>
    </form>
  );
}
