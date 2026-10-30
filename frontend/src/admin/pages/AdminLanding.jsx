import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import HeroSection from "@/components/landing/HeroSection";
import AboutSection from "@/components/landing/AboutSection";
import ServiceSection from "@/components/landing/ServiceSection";
import WeddingPortfolio from "@/components/landing/WeddingPortfolio";
import PreWeddingPortfolio from "@/components/landing/PreWeddingPortfolio";
import EventPortfolio from "@/components/landing/EventPortfolio";
import AlbumSection from "@/components/landing/AlbumSection";
import VideoSection from "@/components/landing/VideoSection";
import PackageSection from "@/components/landing/PackageSection";
import TestimonialSection from "@/components/landing/TestimonialSection";
import VendorCTA from "@/components/landing/VendorCTA";
import ContactSection from "@/components/landing/ContactSection";
function AdminLanding() {
  return <div className="min-h-screen bg-ink-950">
    <Navbar />
    <main>
      <HeroSection />
      <AboutSection />
      <ServiceSection />
      <WeddingPortfolio />
      <PreWeddingPortfolio />
      <EventPortfolio />
      <AlbumSection />
      <VideoSection />
      <PackageSection />
      <TestimonialSection />
      <VendorCTA />
      <ContactSection />
    </main>
    <Footer />
  </div>;
}
export {
  AdminLanding as default
};
