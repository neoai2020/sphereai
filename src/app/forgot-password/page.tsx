"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Mail, CheckCircle2 } from "lucide-react";
import logo from "@/components/dashboard/assets/logo.png";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError(error.message);
      } else {
        setSent(true);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-gray-50 to-white pointer-events-none" />
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-50/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-50/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-10">
        <div className="text-center space-y-6">
          <Link href="/" className="inline-flex items-center mb-8">
            <Image 
              src={logo} 
              alt="SphereAI" 
              height={40} 
              className="h-10 w-auto object-contain" 
              priority
            />
          </Link>
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter leading-tight">Master Recovery</h1>
            <p className="text-gray-400 font-medium text-sm max-w-[280px] mx-auto leading-relaxed">
              {sent ? "Check your secure vault inbox for the recovery link." : "Enter your email address to initiate the password restoration protocol."}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] p-10 md:p-12">
          {sent ? (
            <div className="text-center space-y-8 py-6">
              <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto text-emerald-500 border border-emerald-100">
                <CheckCircle2 size={40} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Email Dispatched</h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  We have sent a verification link to: <br/>
                  <span className="font-mono font-bold text-gray-900 text-[13px]">{email}</span>
                </p>
              </div>
              <div className="pt-4 border-t border-gray-50">
                <Link 
                  href="/login" 
                  className="text-[10px] font-black text-brand-600 uppercase tracking-widest hover:text-brand-700 transition-colors"
                >
                  Return to Portal
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-10">
              {error && (
                <div className="p-4 rounded-2xl bg-red-50/50 border border-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 animate-shake">
                  <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm border border-red-100 flex-shrink-0">
                    <Mail size={14} />
                  </div>
                  {error}
                </div>
              )}

              <div className="space-y-6">
                <div className="space-y-2.5">
                  <label htmlFor="email" className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">
                    Registered Email
                  </label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-gray-900 transition-colors">
                      <Mail size={18} />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl py-4.5 pl-14 pr-6 text-gray-900 font-bold placeholder:text-gray-300 focus:bg-white focus:border-gray-900 focus:ring-4 focus:ring-gray-950/5 transition-all outline-none"
                      placeholder="name@company.com"
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
                    <span className="text-xs uppercase tracking-[0.2em]">Initiate Reset</span>
                  )}
                </button>

                <p className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Remember your password?{" "}
                  <Link href="/login" className="text-brand-600 hover:text-brand-700 transition-colors">
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
          )}
        </div>

        <div className="text-center">
           <p className="text-gray-300 text-[9px] uppercase font-black tracking-[0.3em] font-mono">
             SphereAI Security Protocol v4.0
           </p>
        </div>
      </div>
    </div>
  );
}
