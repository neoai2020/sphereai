import { Rocket } from "lucide-react";
import { PremiumPageTemplate } from "@/components/dashboard/premium-page-template";

export default function TenXPage() {
  return (
    <PremiumPageTemplate
      title="10x Profits"
      badge="High Priority"
      description="Hyper-scale your earnings with our 10x multiplier system. This tool automates the heavy lifting and lets you focus on growth."
      icon={Rocket}
      ctaText="Access 10x Now"
      ctaHref="https://locus.com" // Placeholder for Locus link
      features={[
        "Automated Scaling",
        "Market Dominance",
        "Profit Multiplier",
        "High-Speed Growth",
        "Analytics Dashboard",
        "Scaling Engine",
      ]}
      steps={[
        {
          title: "Setup Your Profile",
          text: "Configure your target markets and financial goals.",
        },
        {
          title: "Select Your Niche",
          text: "Our AI identifies the highest converting sectors for your product.",
        },
        {
          title: "Launch & Scale",
          text: "Turn on the 10x engine and watch your campaigns grow exponentially.",
        },
      ]}
    />
  );
}
