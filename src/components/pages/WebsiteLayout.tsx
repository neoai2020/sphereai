"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Globe, ArrowRight } from "lucide-react";
import type { Project } from "@/types/database";

interface LayoutProps {
  project: Project & {
    primary_color?: string;
    secondary_color?: string;
    font_family?: string;
    site_logo?: string;
  };
  children: React.ReactNode;
  activePath: string;
}

export function WebsiteLayout({ project, children, activePath }: LayoutProps) {
  const navItems = [
    { label: "Home", path: "" },
    { label: "About", path: "/about" },
    { label: "Blog", path: "/blog" },
    { label: "FAQ", path: "/faq" },
    { label: "Reviews", path: "/reviews" },
  ];

  const primaryColor = project.primary_color || "#4F46E5";
  const fontFamily = project.font_family || "Inter";

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily }}>
      {/* Dynamic Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href={`/software/user/${project.id}`} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-105" style={{ backgroundColor: primaryColor }}>
              {project.site_logo ? <img src={project.site_logo} alt="logo" className="w-full h-full object-contain" /> : <Globe size={20} />}
            </div>
            <span className="text-xl font-black text-gray-900 tracking-tight">{project.name}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const fullPath = `/software/user/${project.id}${item.path}`;
              const isActive = activePath === fullPath || (item.path === "" && activePath === `/software/user/${project.id}`);
              return (
                <Link
                  key={item.label}
                  href={fullPath}
                  className={cn(
                    "text-sm font-black uppercase tracking-widest transition-colors",
                    isActive ? "text-brand-600" : "text-gray-400 hover:text-gray-900"
                  )}
                  style={isActive ? { color: primaryColor } : {}}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button 
            className="px-6 py-3 rounded-xl text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all"
            style={{ backgroundColor: primaryColor }}
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Dynamic Footer */}
      <footer className="bg-gray-900 text-white py-20 px-6 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-2 space-y-6">
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-2xl" style={{ backgroundColor: primaryColor }}>
                {project.site_logo ? <img src={project.site_logo} alt="logo" className="w-6 h-6 object-contain" /> : <Globe size={24} />}
              </div>
              <span className="text-2xl font-black tracking-tight">{project.name}</span>
            </div>
            <p className="text-gray-400 font-medium max-w-sm leading-relaxed">
              {project.product_description.slice(0, 150)}...
            </p>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-brand-400" style={{ color: primaryColor }}>Legal</h4>
            <ul className="space-y-4 text-sm font-bold text-gray-300">
              <li className="hover:text-white transition-colors cursor-pointer">Privacy Policy</li>
              <li className="hover:text-white transition-colors cursor-pointer">Terms of Service</li>
              <li className="hover:text-white transition-colors cursor-pointer">Cookie Policy</li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-brand-400" style={{ color: primaryColor }}>Support</h4>
            <ul className="space-y-4 text-sm font-bold text-gray-300">
              <li className="hover:text-white transition-colors cursor-pointer">Contact Us</li>
              <li className="hover:text-white transition-colors cursor-pointer">Knowledge Base</li>
              <li className="hover:text-white transition-colors cursor-pointer">Live Chat</li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-20 mt-20 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
          <p>© {new Date().getFullYear()} {project.name}. All AI Assets Secured.</p>
          <div className="flex items-center gap-2">
            Built with <span style={{ color: primaryColor }}>SiteForge</span> Artificial Intelligence
          </div>
        </div>
      </footer>
    </div>
  );
}
