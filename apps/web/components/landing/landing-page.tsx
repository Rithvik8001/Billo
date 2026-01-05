import Nav from "@/components/landing/nav";
import Header from "@/components/landing/header";
import FeaturesGrid from "@/components/landing/features-grid";
import HowItWorks from "@/components/landing/how-it-works";
import PricingSection from "@/components/landing/pricing-section";
import Footer from "@/components/landing/footer-cta";

export default function Landing() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="border-x border-border/60 max-w-4xl mx-auto w-full">
        <Nav />
        <Header />
        <FeaturesGrid />
        <HowItWorks />
        <PricingSection />
        <Footer />
      </div>
    </div>
  );
}
