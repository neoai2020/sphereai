import { Sparkles } from "lucide-react";
import { PremiumPageTemplate } from "@/components/dashboard/premium-page-template";

export default function DFYPage() {
  return (
    <PremiumPageTemplate
      title="Done For You (DFY)"
      badge="Concierge Service"
      description="Sit back while our experts build your entire high-converting ecosystem. We handle the content, SEO, and integration."
      icon={Sparkles}
      ctaText="Join the Waitlist"
      ctaHref="#"
      features={[
        "Expert Consultation",
        "Professional Copywriting",
        "SEO Strategy Setup",
        "Technical Integration",
        "Custom Design Edits",
        "First 1k Traffic Run",
      ]}
      steps={[
        {
          title: "Onboarding Call",
          text: "Discuss your product, goals, and target market with our lead strategist.",
        },
        {
          title: "We Build & Optimize",
          text: "Our team spends 48 hours crafting your perfect AI-optimized network.",
        },
        {
          title: "Handover & Launch",
          text: "Full demonstration and training on your new high-performance setup.",
        },
      ]}
    />
  );
}
