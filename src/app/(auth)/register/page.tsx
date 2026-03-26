"use client";

import Link from "next/link";
import { Globe, Zap, ArrowRight, User, ShieldCheck } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 via-white to-brand-100 px-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">SphereAI</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Choose your account type</h1>
          <p className="text-gray-500 mt-2 text-lg text-secondary">Ready to dominate the AI search landscape?</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Standard Sign Up */}
          <Link 
            href="/sign-up"
            className="group bg-white p-8 rounded-2xl border border-gray-100 shadow-xl shadow-brand-100/20 hover:border-brand-300 transition-all hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-6 group-hover:bg-brand-600 group-hover:text-white transition-colors text-brand-600">
              <User size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Sign up</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Standard access for individuals. Generate AI-optimized pages for your projects quickly and easily.
            </p>
            <div className="flex items-center gap-2 text-brand-600 font-semibold text-sm">
              Get Started Free <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Pro Sign Up */}
          <Link 
            href="/sign-up-pro"
            className="group bg-white p-8 rounded-2xl border-2 border-brand-600 shadow-xl shadow-brand-600/10 hover:shadow-brand-600/20 transition-all hover:-translate-y-1 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-brand-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
              Professional
            </div>
            <div className="w-12 h-12 rounded-xl bg-brand-600 flex items-center justify-center mb-6 text-white">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Sign up Pro</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Unlock advanced tools, unlimited projects, and premium templates designed for professionals.
            </p>
            <div className="flex items-center gap-2 text-brand-600 font-semibold text-sm">
              Level Up Now <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        <p className="text-center mt-12 text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-600 hover:text-brand-700 font-medium border-b border-brand-200">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
