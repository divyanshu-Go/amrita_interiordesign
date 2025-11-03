import ProfileDashboard from "@/components/ProfileDashboard";
import { getUserProfile } from "@/lib/api/api";

export default async function ProfilePage() {
  const user = await getUserProfile();
  

  return (
    <div className="mx-auto max-w-7xl w-full">
      <ProfileDashboard user={user}/>
    </div>
  );
}
