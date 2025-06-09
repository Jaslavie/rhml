//* primary button
import React from "react";

interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export default function Button({
  label,
  onClick,
  disabled = false,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-dark-accent hover:bg-dark-accent/90 px-4 py-2 rounded-sm text-white text-md font-serif italic transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
      disabled={disabled}
    >
      {label}
    </button>
  );
}
