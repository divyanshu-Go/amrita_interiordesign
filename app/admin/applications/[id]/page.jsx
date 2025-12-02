// ===== app/admin/applications/[id]/page.js =====
import ApplicationForm from "@/components/admin/ApplicationForm";
import { getApplicationById } from "@/lib/fetchers/applications";

export default async function EditApplicationPage({ params }) {
  const application = await getApplicationById(params.id);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Application</h1>
        <p className="text-gray-600 mt-2">Modify application details</p>
      </div>
      <ApplicationForm application={application} />
    </div>
  );
}