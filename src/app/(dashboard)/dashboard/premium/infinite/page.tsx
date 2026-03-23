import { Infinity } from "lucide-react";
import { PremiumPageTemplate } from "@/components/dashboard/premium-page-template";

export default function InfinitePage() {
  return (
    <PremiumPageTemplate
      title="Sphere Infinite"
      badge="Ultimate Tier"
      description="Unlimited everything. No daily limits, no project caps. The ultimate package for agencies and large-scale marketers."
      icon={Infinity}
      ctaText="Upgrade to Infinite"
      ctaHref="/dashboard/settings"
      features={[
        "Unlimited Generations",
        "Unlimited Projects",
        "Priority AI Access",
        "Custom Domains",
        "Team Management",
        "White-label Reports",
      ]}
      steps={[
        {
          title: "Unlimited Freedom",
          text: "Remove all barriers and scale your business without worrying about daily usage.",
        },
        {
          title: "Priority Support",
          text: "Get a dedicated account manager and 24/7 priority technical support.",
        },
        {
          title: "Agency Features",
          text: "Add team members and manage client projects under a single workspace.",
        },
      ]}
    />
  );
}
