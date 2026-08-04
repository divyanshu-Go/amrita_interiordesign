// app/(customer)/page.js
export const revalidate = 1800;

import PopularCategoriesSection from "@/components/HomePage/PopularCategoriesSection";
import HeroSection from "@/components/HomePage/HeroSection";
import WhyChooseUsSection from "@/components/HomePage/WhyChooseUsSection";

// export const metadata = { /* unchanged — keep as is */ };

// function OrganizationJsonLd() { /* unchanged */ }
// function WebSiteJsonLd() { /* unchanged */ }

export default async function HomePage() {

  return (
    <>

      <div className="bg-white space-y-6">
        
        <HeroSection />

        <PopularCategoriesSection />

        <WhyChooseUsSection/>

      </div>
    </>
  );
}