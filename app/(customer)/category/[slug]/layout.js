// app/(customer)/category/[slug]/layout.js

export default function CategoryLayout({ children }) {
  return (
    <div className="bg-gray-50 min-h-screen">
      {children}
    </div>
  );
}
