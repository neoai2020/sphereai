"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export function RegisterForm({ plan = "free" }: { plan?: "free" | "pro" }) {
  const [fullName, setFullName] = useState("");
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

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          full_name: fullName,
          plan: plan 
        },
      },
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
            <label htmlFor="fullName" className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">
              Legal Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl py-4 px-6 text-gray-900 font-bold placeholder:text-gray-300 focus:bg-white focus:border-gray-900 focus:ring-4 focus:ring-gray-950/5 transition-all outline-none"
              placeholder="e.g. John Doe"
            />
          </div>

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
            <label htmlFor="password" className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">
              Master Password
            </label>
            <div className="relative group">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
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
              <span className="text-xs uppercase tracking-[0.2em]">Create Account</span>
            )}
          </button>

          <p className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-600 hover:text-brand-700 transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
