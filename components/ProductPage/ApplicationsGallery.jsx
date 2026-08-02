// components/customer/ApplicationsGallery.js
export default function ApplicationsGallery({ applications }) {
  if (!applications || applications.length === 0) return null;

  return (
    <div>
      {/* Divider from specs above */}
      <div className="h-px bg-gray-200 mb-4" />

      <h3 className="text-md font-bold text-gray-900 mb-3">Applications</h3>

      {/* Tighter grid, smaller images */}
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 sm:gap-3">
        {applications.map((app, idx) => (
          <div key={app._id || idx} className="flex flex-col items-center gap-1">
            {/* Image — smaller: w-12 (48px) from w-16 (64px) */}
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-md overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
              {app.image ? (
                <img
                  src={app.image}
                  alt={app.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-xl">🏠</span>
              )}
            </div>
            {/* Label */}
            <p className="text-[10px] font-medium text-gray-700 text-center line-clamp-2 leading-tight">
              {app.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}