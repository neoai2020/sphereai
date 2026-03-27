"use client";

import { RegisterForm } from "@/components/auth/register-form";
import logo from "@/components/dashboard/assets/logo.png";
import Image from "next/image";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 via-white to-brand-100 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center mb-8">
            <Image 
              src={logo} 
              alt="SphereAI" 
              height={64} 
              className="h-16 w-auto object-contain" 
              priority
            />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-500 mt-1">Start generating AI-optimized pages</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
