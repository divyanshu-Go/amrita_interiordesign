export default function Home() {
  return (
    <div className="">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-orange-700 mb-6">
          PanTask
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
          Organize, track, and manage your tasks effortlessly with a clean and professional interface.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="/tasks"
            className="px-6 py-3 bg-orange-600 text-white rounded-lg font-medium shadow hover:bg-orange-700 transition"
          >
            View Tasks
          </a>
          <a
            href="/create-task"
            className="px-6 py-3 bg-white text-orange-700 border border-orange-300 rounded-lg font-medium shadow hover:bg-orange-100 transition"
          >
            Create Task
          </a>
        </div>
      </div>
    </div>
  );
}
