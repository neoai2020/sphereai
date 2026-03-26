"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Mail, CheckCircle2 } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 via-white to-brand-100 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">SphereAI</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
          <p className="text-gray-500 mt-1">
            {sent ? "Check your inbox" : "Enter your email to receive a reset link"}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-brand-100/50 border border-gray-100 p-8">
          {sent ? (
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto border border-green-100">
                <CheckCircle2 size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-gray-900 text-lg">Email Sent!</h3>
                <p className="text-gray-500 text-sm">
                  We&apos;ve sent a password reset link to <br />
                  <span className="font-bold text-gray-900 font-mono text-[13px]">{email}</span>
                </p>
              </div>
              <div className="pt-2">
                <Link 
                  href="/login" 
                  className="inline-flex items-center gap-2 text-sm text-brand-600 font-bold hover:underline"
                >
                  <ArrowLeft size={16} /> Back to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 pl-10 rounded-lg border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all text-gray-900"
                    placeholder="you@example.com"
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-black transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-brand-500/10"
              >
                {loading && <Loader2 size={18} className="animate-spin" />}
                {loading ? "Sending link..." : "Send Reset Link"}
              </button>

              <div className="text-center pt-2">
                <Link 
                  href="/login" 
                  className="inline-flex items-center gap-2 text-sm text-gray-400 font-bold hover:text-gray-900 transition-colors uppercase tracking-widest text-[10px]"
                >
                  <ArrowLeft size={14} /> Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
