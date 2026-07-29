// components/customer/TrustBadges.jsx
import { Wrench, Shield, Truck } from "lucide-react";

const BADGES = [
  { icon: Wrench, label: "Installation Services"  },
  { icon: Shield, label: "Amrita Assured Quality" },
  { icon: Truck,  label: "Doorstep Delivery"       },
];

export default function TrustBadges() {
  return (
    <div className="bg-orange-50 rounded-xl border border-orange-100 px-3 py-3.5 sm:px-4 sm:py-4 mt-4">
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {BADGES.map(({ icon: Icon, label }, i) => (
          <div key={i} className="flex flex-col items-center text-center gap-1.5">
            <div className="bg-orange-500 text-white rounded-full p-2 sm:p-2.5">
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <p className="text-[11px] sm:text-xs font-medium text-gray-800 leading-tight">
              {label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}