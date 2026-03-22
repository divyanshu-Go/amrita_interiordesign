// app/(customer)/layout.js



export default async function CustomerLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className=" flex-1">{children}</main>
    </div>
  );
}