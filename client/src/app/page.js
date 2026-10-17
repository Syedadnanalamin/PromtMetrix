import HeroSection from "@/components/Homepage/HeroSection/HeroSection";
import FeaturedPrompts from "@/components/Homepage/FeaturedPrompts/FeaturedPrompts";
import WhyChooseUs from "@/components/Homepage/WhyChooseUs/WhyChooseUs";
import TopCreators from "@/components/Homepage/TopCreators/TopCreators";
import CustomerReviews from "@/components/Homepage/CustomerReviews/CustomerReviews";
import FAQSection from "@/components/Homepage/FAQSection/FAQSection";
import CTASection from "@/components/Homepage/CTASection/CTASection";

import { getAllpromts } from "@/lib/actions/promts/getallpromts";
import { getTopCreators } from "@/lib/actions/promts/getTopCreators";
import { getAllReviews } from "@/lib/actions/promts/getAllReviews";
import { getAdminDashboardAnalytics } from "@/lib/actions/dashboard/adminDashboardAnalytics";

export default async function Home() {
  // Fetch dynamic homepage data concurrently with safe fallbacks
  const [promptsRes, creatorsRes, reviewsRes, analyticsRes] =
    await Promise.allSettled([
      getAllpromts(),
      getTopCreators(),
      getAllReviews(),
      getAdminDashboardAnalytics(),
    ]);

  const rawPrompts = promptsRes.status === "fulfilled" ? promptsRes.value : [];
  const prompts = Array.isArray(rawPrompts) ? rawPrompts : rawPrompts?.data || [];

  const rawCreators = creatorsRes.status === "fulfilled" ? creatorsRes.value : [];
  const creators = Array.isArray(rawCreators) ? rawCreators : rawCreators?.data || [];

  const rawReviews = reviewsRes.status === "fulfilled" ? reviewsRes.value : [];
  const reviews = Array.isArray(rawReviews) ? rawReviews : rawReviews?.data || [];

  const analytics = analyticsRes.status === "fulfilled" ? analyticsRes.value?.data : null;

  // Selected top featured prompt for the live Hero terminal
  const featuredHeroPrompt = prompts.length > 0 ? prompts[0] : null;

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Dynamic Hero / Banner Section */}
      <HeroSection
        initialPrompt={featuredHeroPrompt}
        stats={analytics}
        totalPromptsCount={prompts.length}
      />

      {/* 2. Dynamic 6 Featured & Trending Prompts Section */}
      <FeaturedPrompts initialPrompts={prompts} />

      {/* 3. Why Choose Us / Platform Benefits Section */}
      <WhyChooseUs totalPrompts={prompts.length} />

      {/* 4. Dynamic Top Verified Creators Section */}
      <TopCreators initialCreators={creators} />

      {/* 5. Dynamic Customer Testimonials & Reviews Section */}
      <CustomerReviews initialReviews={reviews} />

      {/* 6. Dynamic FAQ Section */}
      <FAQSection />

      {/* 7. Dynamic Final CTA Banner */}
      <CTASection
        totalPrompts={prompts.length}
        totalUsers={analytics?.totalUsers}
      />
    </div>
  );
}
