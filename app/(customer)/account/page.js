// account/page.js
import AccountDataProvider from "./AccountDataProvider";
import AccountShell from "./AccountShell";

export default function AccountPage() {
  return (
    <AccountDataProvider>
      <AccountShell />
    </AccountDataProvider>
  );
}
