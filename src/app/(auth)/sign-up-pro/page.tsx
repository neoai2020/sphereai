"use client";

import { RegisterForm } from "@/components/auth/register-form";
import logo from "@/components/dashboard/assets/logo2.png";
import Image from "next/image";
import Link from "next/link";

export default function SignUpProPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 via-white to-brand-100 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-0">
            <Link href="/" className="inline-flex items-center">
              <Image 
                src={logo} 
                alt="SphereAI" 
                width={280} 
                className="w-full h-auto object-contain" 
                priority
              />
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-500 mt-1">Start generating AI-optimized pages</p>
        </div>
        <RegisterForm plan="pro" />
      </div>
    </div>
  );
}
