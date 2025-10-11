// src/app/page.tsx
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Stats from '@/components/sections/Stats';
import Services from '@/components/sections/Services';
import FixedDepositPlans from '@/components/sections/FixedDepositPlans';
import PensionSchemePlans from '@/components/sections/PensionSchemePlans';
import Footer from '@/components/layout/Footer'; 


export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Stats />
      <Services />
      <FixedDepositPlans />
      <PensionSchemePlans />
      <Footer />
      {/* <div className="h-screen bg-primary-blue">
      </div> */}
    </main>
  );
}