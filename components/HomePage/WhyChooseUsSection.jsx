import {
  Pencil,
  Award,
  Tag,
  Truck,
  Wrench,
  ShieldCheck,
  PackageCheck,
  Users,
} from "lucide-react";

const features = [
  {
    icon: Pencil,
    title: "Free Design Consultation",
    description:
      "Get expert advice and personalized solutions for your space.",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description:
      "We use the best raw materials for long lasting durability.",
  },
  {
    icon: Tag,
    title: "Best Price",
    description:
      "Factory direct pricing with the best value for your money.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description:
      "On-time delivery across Delhi NCR and major cities.",
  },
  {
    icon: Wrench,
    title: "Installation Support",
    description:
      "Professional installation by skilled and experienced workers.",
  },
  {
    icon: ShieldCheck,
    title: "Warranty",
    description:
      "Assured warranty on products for your complete peace of mind.",
  },
];

const stats = [
  {
    icon: Award,
    value: "1500+",
    label: "Happy Customers",
  },
  {
    icon: PackageCheck,
    value: "5000+",
    label: "Projects Completed",
  },
  {
    icon: Users,
    value: "50+",
    label: "Expert Team",
  },
  {
    icon: ShieldCheck,
    value: "7",
    label: "Years Warranty",
  },
];

export default function WhyChooseUsSection() {
  return (
    <section className="max-w-[1600px] mx-auto px-2.5 sm:px-6 lg:px-8 py-10 font-sans">
      {/* ── Section Title ── */}
      <div className="text-center mb-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight">
          Why Choose <span className="text-primary-500">Interio97?</span>
        </h2>
        <p className="text-[11px] sm:text-xs text-neutral-500 font-medium mt-1.5">
          We deliver more than just products. We deliver trust, quality & satisfaction.
        </p>
      </div>

      {/* ── Top Feature Cards Grid (3 Columns on Mobile) ── */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 mb-6">
        {features.map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <div
              key={idx}
              className="flex flex-col items-center text-center bg-white border border-neutral-200/80 rounded-md p-2 sm:p-4 shadow-xs hover:shadow-md transition-shadow"
            >
              {/* Circular Icon Wrapper */}
              <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-primary-50 border border-primary-100 flex items-center justify-center mb-2 sm:mb-3 flex-shrink-0">
                <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500" strokeWidth={1.8} />
              </div>

              {/* Title & Accent Line */}
              <h3 className="text-[10px] sm:text-xs font-bold text-neutral-900 leading-tight min-h-[28px] sm:min-h-[32px] flex items-center justify-center">
                {item.title}
              </h3>
              <span className="w-4 sm:w-6 h-0.5 bg-primary-500 rounded-full my-1.5 sm:my-2" />

              {/* Description */}
              <p className="text-[9px] sm:text-xs text-neutral-500 leading-normal sm:leading-relaxed">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* ── Bottom Stats Banner ── */}
      <div className="bg-primary-50/70 border border-primary-100 rounded-md p-3 sm:p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 divide-y md:divide-y-0 md:divide-x divide-primary-100/80">
          {stats.map((stat, idx) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={idx}
                className={`flex items-center justify-center sm:justify-start lg:justify-center gap-2 sm:gap-3 ${
                  idx > 0 ? "pt-2 md:pt-0" : ""
                }`}
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border border-primary-100 flex items-center justify-center shadow-xs flex-shrink-0">
                  <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500" strokeWidth={2} />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-xs sm:text-base font-black text-primary-600">
                    {stat.value}
                  </span>
                  <span className="text-[10px] sm:text-xs font-semibold text-neutral-700 mt-1">
                    {stat.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}