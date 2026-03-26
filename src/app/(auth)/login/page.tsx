"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-gray-50 to-white pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-50/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-50/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-10">
        <div className="text-center space-y-6">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-[1.25rem] bg-gray-950 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
              <span className="text-white font-black text-xl">S</span>
            </div>
            <span className="text-2xl font-black text-gray-900 tracking-tighter">SphereAI</span>
          </Link>
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter leading-tight">Welcome Back</h1>
            <p className="text-gray-400 font-medium text-sm max-w-[280px] mx-auto leading-relaxed">
              Enter your credentials to access your project management vault.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] p-10 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="p-4 rounded-2xl bg-red-50/50 border border-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 animate-shake">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm border border-red-100 flex-shrink-0">
                  <EyeOff size={14} />
                </div>
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div className="space-y-2.5">
                <label htmlFor="email" className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl py-4 px-6 text-gray-900 font-bold placeholder:text-gray-300 focus:bg-white focus:border-gray-900 focus:ring-4 focus:ring-gray-950/5 transition-all outline-none"
                  placeholder="name@company.com"
                />
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between pl-1">
                  <label htmlFor="password" className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    Secret Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-[10px] font-black text-brand-600 hover:text-brand-700 uppercase tracking-widest transition-colors"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative group">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl py-4 pl-6 pr-12 text-gray-900 font-bold placeholder:text-gray-300 focus:bg-white focus:border-gray-900 focus:ring-4 focus:ring-gray-950/5 transition-all outline-none"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-950 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
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
                  <span className="text-xs uppercase tracking-[0.2em]">Sign In</span>
                )}
              </button>

              <p className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-brand-600 hover:text-brand-700 transition-colors">
                  Create One
                </Link>
              </p>
            </div>
          </form>
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
