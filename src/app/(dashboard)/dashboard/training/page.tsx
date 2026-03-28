import { VimeoEmbed } from "@/components/dashboard/vimeo-embed";
import {
  GETTING_STARTED_VIMEO_ID,
  SITE_FORGE_VIMEO_ID,
  LOGO_GENERATOR_VIMEO_ID,
} from "@/lib/vimeo-config";
import { GraduationCap, PlayCircle, BookOpen, CheckCircle2 } from "lucide-react";

export default function TrainingPage() {
  const steps = [
    {
      title: "Step 1: Project Setup",
      description: "Connect your product or affiliate link and let the AI analyze your target audience and keywords.",
      icon: PlayCircle,
    },
    {
      title: "Step 2: Content Generation",
      description: "SphereAI generates 5 specialized pages (Landing, About, FAQ, Blog, Reviews) with full Schema Markup.",
      icon: CheckCircle2,
    },
    {
      title: "Step 3: Customization",
      description: "Review and edit the generated content to match your brand voice and specific requirements.",
      icon: BookOpen,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Training & Resources</h1>
        <p className="text-gray-500 mt-1">
          Master the art of AI search optimization with our step-by-step guides
        </p>
      </div>

      <div className="mb-12">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          1 — Getting Started
        </h2>
        <VimeoEmbed
          videoId={GETTING_STARTED_VIMEO_ID}
          title="1 — Getting Started"
          variant="training"
        />
      </div>

      <div className="mb-12">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          2 — Site Forge
        </h2>
        <VimeoEmbed
          videoId={SITE_FORGE_VIMEO_ID}
          title="2 — Site Forge"
          variant="training"
        />
      </div>

      <div className="mb-12">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          3 — Logo Generator
        </h2>
        <VimeoEmbed
          videoId={LOGO_GENERATOR_VIMEO_ID}
          title="3 — Logo Generator"
          variant="training"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 mb-12">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <GraduationCap size={20} className="text-brand-600" />
          The SphereAI Workflow
        </h2>
        {steps.map((step, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 flex gap-5">
            <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center shrink-0 border border-brand-100">
              <span className="text-brand-700 font-bold">{i + 1}</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-brand-50 border border-brand-100 rounded-2xl p-8">
        <h3 className="text-brand-900 font-bold text-lg mb-4">Pro Tips for AI Ranking</h3>
        <ul className="space-y-4">
          {[
            "Always include the product FAQ—it has the highest citation rate for AI assistants.",
            "Use natural, conversational keywords that people use when talking to AI (e.g., 'What is the best...')",
            "Keep your product description factual and detailed—the more info the AI has, the better it generates.",
          ].map((tip, i) => (
            <li key={i} className="flex gap-3 text-sm text-brand-800">
              <CheckCircle2 size={18} className="text-brand-600 shrink-0" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
