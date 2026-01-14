export default function ApplicationsLoading() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />

      <div className="space-y-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-14 bg-gray-200 rounded-lg animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
