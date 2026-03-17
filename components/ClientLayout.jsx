// components/ClientLayout.jsx
import Footer from "./Footer";
import Header from "./Header";

export default function ClientLayout({ user, children }) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <Header user={user} />
      <main className="mt-16 py-6 px-2.5 flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}