// components/ClientLayout.jsx

import Footer from "./Footer";
import Header from "./Header";

export default function ClientLayout({ children }) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <Header />
      <main className="mt-32 sm:mt-18 flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}