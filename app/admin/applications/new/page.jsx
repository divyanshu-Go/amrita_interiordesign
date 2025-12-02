// ===== app/admin/applications/new/page.js =====
import ApplicationForm from "@/components/admin/ApplicationForm";

export default function NewApplicationPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create Application</h1>
        <p className="text-gray-600 mt-2">Add a new application area (Kitchen, Bathroom, etc.)</p>
      </div>
      <ApplicationForm />
    </div>
  );
}