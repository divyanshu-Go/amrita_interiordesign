"use client";

import { useRef, useState } from "react";
import Footer from "./Footer";
import Header from "./Header"; 
import Sidebar from "./Sidebar";

export default function ClientLayout({ categories, user, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleRef = useRef();


  return (
    <><div className="relative">
      <Header user={user} open={sidebarOpen} setOpen={setSidebarOpen} toggleRef={toggleRef}/>
      <Sidebar user={user} open={sidebarOpen} setOpen={setSidebarOpen} toggleRef={toggleRef}/>
      <main className="mt-16 mx-auto px-4 py-8 container flex flex-col flex-1">
        {children}
      </main>
      <Footer />
    </div>
    </>
  );
}
