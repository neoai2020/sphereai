"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Loader2, CheckCircle2, Eye, EyeOff, Lock, AlertCircle } from "lucide-react";
import logo from "@/components/dashboard/assets/logo.png";
import Image from "next/image";

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
      <div className="text-center space-y-8 py-12 animate-pulse">
        <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto text-gray-400 border border-gray-100">
          <Loader2 className="animate-spin" size={32} />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">Verifying Sequence</h3>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest leading-none">Establishing secure connection...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center space-y-8 py-6 animate-in zoom-in duration-500">
        <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto text-emerald-500 border border-emerald-100">
          <CheckCircle2 size={40} />
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Access Restored</h2>
          <p className="text-gray-400 text-sm leading-relaxed">Your account has been successfully re-secured with your new credentials.</p>
        </div>
        <div className="pt-4 border-t border-gray-50">
          <Link 
            href="/login" 
            className="w-full bg-gray-950 hover:bg-black text-white font-black py-5 rounded-2xl shadow-2xl flex items-center justify-center gap-4 transition-all active:scale-[0.98]"
          >
            <span className="text-xs uppercase tracking-[0.2em]">Sign In Now</span>
          </Link>
        </div>
      </div>
    );
  }

  if (!ready && error) {
    return (
      <div className="text-center space-y-8 py-6 animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-red-50 text-red-600 rounded-[2rem] flex items-center justify-center mx-auto border border-red-100">
          <AlertCircle size={40} />
        </div>
        <div className="space-y-4">
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">Link Expired</h3>
          <p className="text-gray-400 text-sm leading-relaxed">{error}</p>
        </div>
        <div className="pt-6 border-t border-gray-50">
          <Link 
            href="/forgot-password" 
            className="text-[10px] font-black text-brand-600 uppercase tracking-widest hover:text-brand-700 transition-colors"
          >
            Request Redirection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {error && (
        <div className="p-4 rounded-2xl bg-red-50/50 border border-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 animate-shake">
          <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm border border-red-100 flex-shrink-0">
            <Lock size={14} />
          </div>
          {error}
        </div>
      )}

      <div className="space-y-8">
        <div className="space-y-2.5">
          <label htmlFor="password" className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">
            New Secret Password
          </label>
          <div className="relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-gray-900 transition-colors">
              <Lock size={18} />
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="••••••••"
              className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl py-4.5 pl-14 pr-12 text-gray-900 font-bold placeholder:text-gray-300 focus:bg-white focus:border-gray-900 focus:ring-4 focus:ring-gray-950/5 transition-all outline-none"
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

        <div className="space-y-2.5">
          <label htmlFor="confirm" className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">
            Confirm Sequence
          </label>
          <div className="relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-gray-900 transition-colors">
              <Lock size={18} />
            </div>
            <input
              id="confirm"
              type={showPassword ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl py-4.5 pl-14 pr-6 text-gray-900 font-bold placeholder:text-gray-300 focus:bg-white focus:border-gray-900 focus:ring-4 focus:ring-gray-950/5 transition-all outline-none"
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
            <span className="text-xs uppercase tracking-[0.2em]">Finalize Restoration</span>
          )}
        </button>
      </div>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-gray-50 to-white pointer-events-none" />
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-50/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-50/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-10">
        <div className="text-center space-y-6">
          <Link href="/" className="inline-flex items-center mb-8">
            <Image 
              src={logo} 
              alt="SphereAI" 
              height={64} 
              className="h-16 w-auto object-contain" 
              priority
            />
          </Link>
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter leading-tight">Master Reset</h1>
            <p className="text-gray-400 font-medium text-sm max-w-[280px] mx-auto leading-relaxed">
              Complete the security verification and choose your new secret access key.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] p-10 md:p-12">
          <Suspense fallback={
            <div className="text-center py-12 space-y-8 animate-pulse">
              <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto text-gray-300 border border-gray-100">
                <Loader2 className="animate-spin" size={32} />
              </div>
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none">Initializing Cryptographic Tunnel...</p>
            </div>
          }>
            <ResetPasswordForm />
          </Suspense>
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
