"use client";

import React, { useState } from "react";
import Button from "./Button";

interface NavbarProps {
  onSimulationSelect?: (simulationId: string) => void; // TODO: Connect to main app simulation selection
}

export default function Navbar({ onSimulationSelect }: NavbarProps) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const navigationItems = [ // TODO: replace this later
    { id: "career-trajectory", name: "Career trajectory" },
    { id: "best-travel-route", name: "Best travel route" },
    { id: "career-direction", name: "Career direction" },
  ];

  const handleCreateSimulation = () => {
    // TODO: Implement create simulation logic
    console.log("Create new simulation");
  };

  const handleItemSelect = (itemId: string) => {
    setSelectedItem(itemId);
    if (onSimulationSelect) {
      onSimulationSelect(itemId);
    }
  };

  return (
    <div className="w-64 h-screen bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* Create Button */}
      <div className="p-4">
        <Button label="new simulation" onClick={handleCreateSimulation} />
      </div>

      {/* Navigation Items */}
      <div className="flex-1 px-4">
        <div className="space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemSelect(item.id)}
              className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                selectedItem === item.id
                  ? "bg-blue-100 text-blue-900"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="space-y-2">
          <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center">
            <span className="mr-2">ⓘ</span>
            About
          </button>
          <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center">
            <span className="mr-2">📋</span>
            Documentation
          </button>
        </div>
      </div>
    </div>
  );
}
