import React from 'react';

export function Logo({ className = "h-8 w-auto" }) {
  return (
    <svg 
      viewBox="0 0 800 800" 
      className={className}
      aria-label="TogetEase logo"
    >
      <path
        d="M350 200 L450 200 L450 300 L550 300 L550 400 L450 400 L450 600 L350 600 L350 200Z"
        fill="#C5B6E0"
      />
      <path
        d="M500 400 Q600 400 650 450 Q700 500 650 550 Q600 600 500 550 L500 450 Z"
        fill="#7EBFB3"
      />
    </svg>
  );
}