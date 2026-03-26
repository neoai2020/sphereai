"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Loader2, CheckCircle2, Eye, EyeOff, Lock, AlertCircle } from "lucide-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [ready, setReady] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const init = async () => {
      const urlParams = new URLSearchParams(window.location.search);

      // Check for error passed via query param
      const urlError = urlParams.get("error");
      if (urlError) {
        setError(urlError);
        setChecking(false);
        return;
      }

      // ===== PRIMARY METHOD: Token Hash =====
      const tokenHash = urlParams.get("token_hash");
      const type = urlParams.get("type");
      if (tokenHash && type === "recovery") {
        try {
          const { error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: "recovery",
          });
          if (verifyError) {
            setError(verifyError.message);
          } else {
            setReady(true);
          }
        } catch {
          setError("Failed to verify reset link. Please request a new one.");
        }
        setChecking(false);
        return;
      }

      // ===== FALLBACK: PKCE Code Exchange =====
      const code = urlParams.get("code");
      if (code) {
        try {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            setError(exchangeError.message);
          } else {
            setReady(true);
          }
        } catch {
          setError("Failed to verify reset code. Please request a new link.");
        }
        setChecking(false);
        return;
      }

      // ===== FALLBACK: Hash-based tokens (implicit flow) =====
      const hash = window.location.hash.substring(1);
      const hashParams = new URLSearchParams(hash);
      const hashError = hashParams.get("error_description");
      if (hashError) {
        setError(hashError.replace(/\+/g, " "));
        setChecking(false);
        return;
      }
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");
      if (accessToken && refreshToken) {
        try {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (sessionError) {
            setError(sessionError.message);
          } else {
            setReady(true);
          }
        } catch {
          setError("Failed to verify reset link. Please request a new one.");
        }
        setChecking(false);
        return;
      }

      // ===== FALLBACK: Check existing session =====
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setReady(true);
      } else {
        setError("No active reset session. Please request a new password reset link.");
      }
      setChecking(false);
    };

    init();
  }, [searchParams, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="text-center py-12">
        <Loader2 className="animate-spin text-brand-600 mx-auto mb-4" size={40} />
        <h3 className="text-lg font-bold text-gray-900">Verifying your link...</h3>
        <p className="text-gray-500">Wait a second, we're making sure it's you.</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center space-y-6 py-4">
        <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto border border-green-100">
          <CheckCircle2 size={32} />
        </div>
        <div className="space-y-2">
          <h3 className="font-bold text-gray-900 text-lg">Password Updated!</h3>
          <p className="text-gray-500 text-sm">You can now sign in with your new password.</p>
        </div>
        <div className="pt-2">
          <Link 
            href="/login" 
            className="w-full py-2.5 px-4 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-black transition-all flex items-center justify-center shadow-lg shadow-brand-500/10"
          >
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  if (!ready && error) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
          <AlertCircle size={32} />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Reset Failed</h3>
        <p className="text-gray-500 text-sm mb-8">{error}</p>
        <Link 
          href="/forgot-password" 
          className="text-brand-600 text-sm font-bold hover:underline"
        >
          Request a New Link
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Secure Your Account</h2>
        <p className="text-sm text-gray-500">Enter your new password below to get back in.</p>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
          New Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            placeholder="At least 6 characters"
            className="w-full px-4 py-2.5 pl-10 rounded-lg border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all text-gray-900"
          />
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-1.5">
          Confirm Password
        </label>
        <div className="relative">
          <input
            id="confirm"
            type={showPassword ? "text" : "password"}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            placeholder="Repeat your password"
            className="w-full px-4 py-2.5 pl-10 rounded-lg border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all text-gray-900"
          />
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-black transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-brand-500/10"
      >
        {loading && <Loader2 size={18} className="animate-spin" />}
        {loading ? "Saving Changes..." : "Set New Password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
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
          <h1 className="text-2xl font-bold text-gray-900">Complete Reset</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-brand-100/50 border border-gray-100 p-8">
          <Suspense fallback={
            <div className="text-center py-12">
              <Loader2 className="animate-spin text-brand-600 mx-auto" size={32} />
              <p className="text-gray-500 mt-4">Initializing...</p>
            </div>
          }>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
