"use client";

import { Suspense, useEffect, useState } from "react";
import { Sparkles, CheckCircle2, Lock, Loader2, ArrowRight, ShieldCheck, Mail, Zap, MousePointer2, Layout } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import logo from "@/components/dashboard/assets/logo.png";
import Image from "next/image";
import Link from "next/link";


const FEATURE_CONFIG: Record<string, { title: string, icon: any, color: string }> = {
  "10x": { title: "10X Power Tool", icon: Zap, color: "text-indigo-600" },
  "automation": { title: "Traffic Machine", icon: MousePointer2, color: "text-emerald-600" },
  "infinite": { title: "Infinite Access", icon: Sparkles, color: "text-purple-600" },
  "dfy": { title: "DFY Library", icon: Layout, color: "text-blue-600" },
};

function ActivateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [featureActivated, setFeatureActivated] = useState<string | null>(null);

  useEffect(() => {
    const c = searchParams.get("code");
    if (c) setCode(c);
  }, [searchParams]);

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !email) {
      alert("Please enter both email and code");
      return;
    }

    setLoading(true);
    setStatus("idle");

    try {
      const response = await fetch("/api/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Activation failed.");
      }

      setFeatureActivated(data.feature);
      setStatus("success");
      setMessage(`Successfully activated ${FEATURE_CONFIG[data.feature]?.title || data.feature.toUpperCase()}!`);
      
      setTimeout(() => {
        router.push(`/dashboard/${data.feature === 'infinite' ? 'infinite' : data.feature}`);
      }, 3000);
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const config = featureActivated ? FEATURE_CONFIG[featureActivated] : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 via-white to-brand-100 px-4 py-12">
      <div className="w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center mb-8">
            <Image 
              src={logo} 
              alt="SphereAI" 
              height={40} 
              className="h-10 w-auto object-contain" 
              priority
            />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {config ? `Activate ${config.title}` : "Activate Your Access"}
          </h1>
          <p className="text-gray-500 mt-1">Enter your details to unlock access</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-brand-100/50 border border-gray-100 p-8">
          {status === "success" ? (
            <div className="text-center space-y-4 py-4 animate-in zoom-in duration-300">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{message}</h2>
              <p className="text-sm text-gray-500">Redirecting to project vault...</p>
              <Loader2 className="animate-spin text-brand-600 mx-auto" size={20} />
            </div>
          ) : (
            <form onSubmit={handleActivate} className="space-y-5">
              {status === "error" && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
                  {message}
                </div>
              )}

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                  <Mail size={14} className="text-gray-400" />
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all text-gray-900"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                  <ShieldCheck size={14} className="text-gray-400" />
                  Access Key
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="XXXX-XXXX-XXXX"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all text-gray-900 uppercase tracking-widest"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <span>Activate Access</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
           <p className="text-sm text-gray-400">
            Need help? <Link href="/dashboard/support" className="text-brand-600 hover:text-brand-700 font-medium ml-1">Contact Support</Link>
           </p>
        </div>
      </div>
    </div>
  );
}

export default function ActivatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    }>
      <ActivateContent />
    </Suspense>
  );
}
