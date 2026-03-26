"use client";

import { Suspense, useEffect, useState } from "react";
import { Sparkles, CheckCircle2, Lock, Loader2, ArrowRight, ShieldCheck, Mail, Zap, MousePointer2, Layout } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
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
    <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-gray-50 to-white pointer-events-none" />
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-50/30 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-md w-full space-y-10 relative z-10">
        
        {/* 1. Brand/Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center p-4 bg-gray-950 rounded-[2rem] shadow-2xl relative group">
             <div className="absolute inset-0 bg-brand-500 rounded-[2rem] blur opacity-10 group-hover:opacity-20 transition-opacity" />
             {config ? <config.icon className="text-white relative z-10" size={32} /> : <Sparkles className="text-white relative z-10" size={32} />}
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter leading-tight">
              {config ? `Activate ${config.title}` : "Activate Your Access"}
            </h1>
            <p className="text-gray-400 font-medium text-sm max-w-[280px] mx-auto leading-relaxed">
              Enter your registration details below to unlock your custom platform access.
            </p>
          </div>
        </div>

        {/* 2. Main Action Card */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] p-10 md:p-12">
          {status === "success" ? (
            <div className="text-center space-y-8 py-6 animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto text-emerald-500 border border-emerald-100">
                <CheckCircle2 size={40} />
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">{message}</h2>
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest italic">Redirecting to project vault...</p>
              </div>
              <Loader2 className="animate-spin text-gray-900 mx-auto" size={24} />
            </div>
          ) : (
            <form onSubmit={handleActivate} className="space-y-10">
              {status === "error" && (
                <div className="p-4 rounded-2xl bg-red-50/50 border border-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 animate-shake">
                  <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm border border-red-100">
                    <Lock size={14} />
                  </div>
                  {message}
                </div>
              )}

              <div className="space-y-8">
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Target Account Email</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-gray-950 transition-colors">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. user@domain.com"
                      className="w-full h-14 bg-gray-50/50 border border-gray-100 rounded-2xl pl-12 pr-6 text-gray-900 font-bold placeholder:text-gray-300 focus:bg-white focus:border-gray-950 focus:ring-4 focus:ring-gray-950/5 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Access Key</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-gray-950 transition-colors">
                      <ShieldCheck size={18} />
                    </div>
                    <input
                      type="text"
                      required
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="XXXX-XXXX-XXXX"
                      className="w-full h-14 bg-gray-50/50 border border-gray-100 rounded-2xl pl-12 pr-6 text-gray-900 font-bold placeholder:text-gray-300 focus:bg-white focus:border-gray-950 focus:ring-4 focus:ring-gray-950/5 transition-all outline-none uppercase tracking-[0.1em]"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-950 hover:bg-black disabled:opacity-50 text-white font-black py-5 rounded-2xl shadow-2xl flex items-center justify-center gap-4 transition-all active:scale-[0.98] group"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <>
                      <span className="text-xs uppercase tracking-[0.2em]">Activate Access</span>
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
                <p className="text-center text-[9px] font-black text-gray-300 uppercase tracking-[0.3em] font-mono">
                  Secure Redemption Portal v2.0
                </p>
              </div>
            </form>
          )}
        </div>

        {/* 3. Support/Footer */}
        <div className="text-center space-y-4">
           <p className="text-gray-400 text-[9px] uppercase font-black tracking-[0.2em] leading-loose">
            Need assistance? <br />
            <span className="text-gray-900">contact support at getshpereaccess.com</span>
           </p>
           <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-50">
             <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
             <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Server Status: Operational</span>
           </div>
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
