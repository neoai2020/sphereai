"use client";

import { RegisterForm } from "@/components/auth/register-form";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-gray-50 to-white pointer-events-none" />
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-50/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-50/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-10">
        <div className="text-center space-y-6">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-[1.25rem] bg-gray-950 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
              <span className="text-white font-black text-xl">S</span>
            </div>
            <span className="text-2xl font-black text-gray-900 tracking-tighter">SphereAI</span>
          </Link>
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter leading-tight">Join the Network</h1>
            <p className="text-gray-400 font-medium text-sm max-w-[280px] mx-auto leading-relaxed">
              Create your account to start generating high-performance AI assets.
            </p>
          </div>
        </div>
        <RegisterForm />
        
        <div className="text-center">
           <p className="text-gray-300 text-[9px] uppercase font-black tracking-[0.3em] font-mono">
             SphereAI Security Protocol v4.0
           </p>
        </div>
      </div>
    </div>
  );
}
