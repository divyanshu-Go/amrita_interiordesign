// components/ui/Section.jsx
// Consistent max-width + vertical padding wrapper for every homepage section.
// Replaces the scattered <div className="pt-4 pb-16"> wrappers in page.js
// and the repeated `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-X` in each section.
//
// Props:
//   children  — section content
//   className — optional extra classes

export default function Section({ children, className = "" }) {
  return (
    <section
      className={`w-full mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 py-12 ${className}`}
    >
      {children}
    </section>
  );
}