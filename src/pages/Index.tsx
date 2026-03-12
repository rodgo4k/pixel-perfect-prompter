import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import ReleasesSection from "@/components/ReleasesSection";
import TrendingSection from "@/components/TrendingSection";
import RecentWorksSection from "@/components/RecentWorksSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroBanner />
      
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          <ReleasesSection />
          <div className="hidden lg:block sticky top-4 self-start">
            <TrendingSection />
          </div>
        </div>
        
        <div className="mt-12">
          <RecentWorksSection />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
