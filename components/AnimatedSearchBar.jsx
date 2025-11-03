import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";

const placeholders = [
  "Search wallpapers...",
  "Search Tiles...",
  "Search Plywood...",
  "Search Mica..."
];

export default function AnimatedSearchBar() {
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      if (!value.trim()) {
        setIndex((prev) => (prev + 1) % placeholders.length);
      }
    }, 2500);
    return () => clearInterval(interval);
  }, [value]);

  return (
    <div className="flex items-center bg-white shadow-sm rounded-lg px-4 py-2
     border border-gray-200 w-80">
      <div className="relative flex-1">
        {/* Input field */}
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full bg-transparent focus:outline-none text-gray-700 placeholder-transparent"
        />

        {/* Animated placeholder */}
        {!value && (
          <div className="absolute left-0 top-1 overflow-hidden h-5 text-gray-400 text-sm pointer-events-none select-none">
            <div
              className="transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateY(-${index * 1.25}rem)`
              }}
            >
              {placeholders.map((text, i) => (
                <p key={i} className="h-5 leading-5">
                  {text}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lucide Search icon */}
      <button className="ml-2 text-gray-500 hover:text-gray-700">
        <Search className="h-5 w-5" />
      </button>
    </div>
  );
}
