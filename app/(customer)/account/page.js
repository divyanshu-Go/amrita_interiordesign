import AccountDataProvider from "./AccountDataProvider";
import Breadcrumb from "@/components/customer/Breadcrumb";
import AccountShell from "./AccountShell";

export const metadata = {
  title: "My Account",
  description: "Manage your profile, orders, addresses and cart",
};

export default function AccountPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Breadcrumb
        items={[
          { label: "My Account" },
        ]}
      />

      <AccountDataProvider>
        <AccountShell />
      </AccountDataProvider>
    </div>
  );
}