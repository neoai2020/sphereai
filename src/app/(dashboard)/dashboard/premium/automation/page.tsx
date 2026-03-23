import { Wrench } from "lucide-react";
import { PremiumPageTemplate } from "@/components/dashboard/premium-page-template";

export default function AutomationPage() {
  return (
    <PremiumPageTemplate
      title="Automation Engine"
      badge="Power User"
      description="Put your entire marketing funnel on autopilot. From content generation to lead capture, our automation suite does it all."
      icon={Wrench}
      ctaText="Get Automation Now"
      ctaHref="https://locus.com" // Placeholder for Locus link
      features={[
        "Autopilot Campaigns",
        "Workflow Builder",
        "Email Integration",
        "Social Posting",
        "Data Syncing",
        "Smart Triggers",
      ]}
      steps={[
        {
          title: "Integrate Your Tools",
          text: "Connect your existing stack to our central automation hub.",
        },
        {
          title: "Build Workflows",
          text: "Create custom automation rules with our drag-and-drop editor.",
        },
        {
          title: "Monitor Performance",
          text: "Real-time tracking of every automated action and its impact.",
        },
      ]}
    />
  );
}
