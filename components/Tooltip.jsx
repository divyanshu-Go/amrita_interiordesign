// app/components/Tooltip.jsx
'use client';

export default function Tooltip({ text, children }) {
  return (
    <div className="relative group flex items-center">
      {children}

      <div className="absolute mb-2 top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 
      transition bg-amber-100 text-orange-500 text-xs px-2 py-1 rounded shadow-lg z-50 whitespace-nowrap pointer-events-none">
        {text}
      </div>
    </div>
  );
}
