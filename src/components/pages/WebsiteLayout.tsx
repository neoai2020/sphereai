"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Globe, Menu, X } from "lucide-react";
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

function getBrandName(name: string): string {
  const words = name.trim().split(/\s+/);
  return words.slice(0, 2).join(" ");
}

export function WebsiteLayout({ project, children, activePath }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  // Auto-refresh when dashboard saves changes (bypasses browser cache)
  useEffect(() => {
    const channel = new BroadcastChannel("site-updates");
    channel.onmessage = (e) => {
      if (e.data?.projectId === project.id) {
        router.refresh();
      }
    };
    return () => channel.close();
  }, [project.id, router]);

  const navItems = [
    { label: "Home", path: "" },
    { label: "About", path: "/about" },
    { label: "Blog", path: "/blog" },
    { label: "FAQ", path: "/faq" },
    { label: "Reviews", path: "/reviews" },
  ];

  const primaryColor = project.primary_color || "#4F46E5";
  const brandName = getBrandName(project.product_name || project.name);

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href={`/software/user/${project.id}`} className="flex items-center gap-2.5 shrink-0 group">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform"
              style={{ backgroundColor: primaryColor }}
            >
              {project.site_logo
                ? <img src={project.site_logo} alt="logo" className="w-5 h-5 object-contain" />
                : <Globe size={15} />}
            </div>
            <span className="text-sm font-black text-gray-900 tracking-tight truncate max-w-[160px]">
              {brandName}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navItems.map((item) => {
              const fullPath = `/software/user/${project.id}${item.path}`;
              const isActive =
                activePath === fullPath ||
                (item.path === "" && activePath === `/software/user/${project.id}`);
              return (
                <Link
                  key={item.label}
                  href={fullPath}
                  className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                  style={isActive
                    ? { color: primaryColor, backgroundColor: primaryColor + "12" }
                    : { color: "#6B7280" }
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-3 shrink-0">
            {project.product_url ? (
              <a
                href={project.product_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center px-4 py-2 rounded-lg text-white text-xs font-black uppercase tracking-wider transition-all hover:opacity-90 active:scale-95"
                style={{ backgroundColor: primaryColor }}
              >
                Get Started
              </a>
            ) : (
              <button
                className="hidden md:flex items-center px-4 py-2 rounded-lg text-white text-xs font-black uppercase tracking-wider transition-all hover:opacity-90 active:scale-95"
                style={{ backgroundColor: primaryColor }}
              >
                Get Started
              </button>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const fullPath = `/software/user/${project.id}${item.path}`;
              const isActive =
                activePath === fullPath ||
                (item.path === "" && activePath === `/software/user/${project.id}`);
              return (
                <Link
                  key={item.label}
                  href={fullPath}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all"
                  style={isActive
                    ? { color: primaryColor, backgroundColor: primaryColor + "10" }
                    : { color: "#374151" }
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: primaryColor }}>
                  {project.site_logo
                    ? <img src={project.site_logo} alt="logo" className="w-5 h-5 object-contain" />
                    : <Globe size={15} />}
                </div>
                <span className="font-black text-sm">{brandName}</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                {project.product_description?.slice(0, 120)}...
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: primaryColor }}>
                Pages
              </h4>
              <ul className="space-y-3">
                {navItems.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={`/software/user/${project.id}${item.path}`}
                      className="text-sm text-gray-400 hover:text-white transition-colors font-medium"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: primaryColor }}>
                Legal
              </h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer font-medium">Privacy Policy</li>
                <li className="hover:text-white transition-colors cursor-pointer font-medium">Terms of Service</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              © {new Date().getFullYear()} {brandName}. All rights reserved.
            </p>
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
              Built with <span style={{ color: primaryColor }}>SiteForge AI</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
