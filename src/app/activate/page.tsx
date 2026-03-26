"use client";

import { useEffect, useState } from "react";
import { Sparkles, CheckCircle2, Lock, Loader2, ArrowRight, ShieldCheck, Mail, Zap, MousePointer2, Layout } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const FEATURE_CONFIG: Record<string, { title: string, icon: any, color: string }> = {
  "10x": { title: "10X Power Tool", icon: Zap, color: "text-indigo-600" },
  "automation": { title: "Traffic Machine", icon: MousePointer2, color: "text-emerald-600" },
  "infinite": { title: "Infinite Access", icon: Sparkles, color: "text-purple-600" },
  "dfy": { title: "DFY Library", icon: Layout, color: "text-blue-600" },
};

export default function ActivatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState(searchParams.get("code") || "");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [featureActivated, setFeatureActivated] = useState<string | null>(null);

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !email) {
      alert("Please enter both email and code");
      return;
    }

    setLoading(true);
    setStatus("idle");
    const supabase = createClient();

    try {
      // 1. Check if token is valid and not used
      const { data: token, error: tokenErr } = await supabase
        .from("access_tokens")
        .select("*")
        .eq("code", code.toUpperCase())
        .eq("is_used", false)
        .single();

      if (tokenErr || !token) {
        throw new Error("Invalid or already used activation code.");
      }

      setFeatureActivated(token.feature);

      // 2. Check if user exists in profiles table
      const { data: profile, error: profileErr } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email.toLowerCase())
        .single();

      if (profileErr || !profile) {
        throw new Error("User account not found. Please sign up first with this email.");
      }

      // 3. Grant access: Update the relevant feature flag
      const featureColumn = `has_${token.feature}`;
      const upgradeData: any = {
        user_id: profile.id,
        status: "active",
      };
      upgradeData[featureColumn] = true;

      const { error: subErr } = await supabase
        .from("user_subscriptions")
        .upsert(upgradeData, { onConflict: "user_id" });

      if (subErr) throw new Error("Could not update subscription: " + subErr.message);

      // 4. Mark token as used
      await supabase
        .from("access_tokens")
        .update({ 
          is_used: true, 
          used_by_email: email.toLowerCase(),
          used_by_user_id: profile.id 
        })
        .eq("id", token.id);

      setStatus("success");
      setMessage(`Successfully activated ${FEATURE_CONFIG[token.feature]?.title || token.feature.toUpperCase()}!`);
      
      setTimeout(() => {
        router.push(`/dashboard/${token.feature === 'infinite' ? 'infinite' : token.feature}`);
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.05),transparent)]">
      <div className="max-w-md w-full space-y-8">
        
        {/* Brand/Header */}
        <div className="text-center space-y-2">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-indigo-200 transition-all ${config ? 'bg-indigo-600' : 'bg-slate-900'}`}>
            {config ? <config.icon className="text-white" size={32} /> : <Sparkles className="text-white" size={32} />}
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {config ? `Activate ${config.title}` : "Activate Your Access"}
          </h1>
          <p className="text-slate-500 font-medium tracking-tight">
            Enter your email and code to unlock your custom access.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] p-8 md:p-10">
          {status === "success" ? (
            <div className="text-center space-y-6 py-4 animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                <CheckCircle2 size={48} />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-900">{message}</h2>
                <p className="text-slate-500 font-medium italic">Opening your account now...</p>
              </div>
              <Loader2 className="animate-spin text-indigo-600 mx-auto" size={24} />
            </div>
          ) : (
            <form onSubmit={handleActivate} className="space-y-8">
              {status === "error" && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold flex items-center gap-3 animate-shake">
                  <Lock size={18} /> {message}
                </div>
              )}

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Target Account Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your registered email"
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-6 text-slate-900 font-bold focus:ring-4 focus:ring-indigo-600/5 transition-all shadow-inner outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Access Key</label>
                  <div className="relative group">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
                    <input
                      type="text"
                      required
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="e.g. 10X-MODE-999"
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-6 text-slate-900 font-bold focus:ring-4 focus:ring-indigo-600/5 transition-all shadow-inner outline-none uppercase tracking-widest"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-slate-900 hover:bg-indigo-600 disabled:opacity-50 text-white font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] group"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <>
                      Activate Access
                      <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  Secure Redemption Portal
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Support */}
        <p className="text-center text-slate-400 text-[10px] uppercase font-black tracking-widest leading-loose">
          Need assistance? <br />
          Contact support at getshpereaccess.com
        </p>
      </div>
    </div>
  );
}
