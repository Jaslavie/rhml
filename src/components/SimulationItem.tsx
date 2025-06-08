//* single simulation object in the navbar
"use client";

import React, { useState, useRef, useEffect } from "react";

interface SimulationItemProps {
  name: string;
  id: string;
}

export default function SimulationItem({ name, id }: SimulationItemProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // handle dropdown interaction
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDelete = () => {
    // TODO: Implement delete functionality
    console.log(`Delete simulation ${id}`);
    setShowDropdown(false);
  };

  //* ===== render =====
  return (
    <div className=" border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:bg-gray-100 pointer">
      {/* name */}
      <div className="flex items-center">
        <span className="text-gray-800 font-medium">{name}</span>
      </div>

      {/* dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="8" cy="3" r="1.5" fill="#6B7280" />
            <circle cx="8" cy="8" r="1.5" fill="#6B7280" />
            <circle cx="8" cy="13" r="1.5" fill="#6B7280" />
          </svg>
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-sm z-10">
            <button
              onClick={handleDelete} // TODO: implement later
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
