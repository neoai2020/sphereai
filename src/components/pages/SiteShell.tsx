"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Globe, Menu, X, ExternalLink } from "lucide-react";

interface Project {
  id: string;
  name: string;
  product_description: string;
  primary_color?: string | null;
  site_logo?: string | null;
  product_url?: string | null;
}

interface SiteShellProps {
  project: Project;
  slug: string;
  children: React.ReactNode;
}

export function SiteShell({ project, slug, children }: SiteShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const primaryColor = project.primary_color || "#4F46E5";

  const navItems = [
    { label: "Home", href: `/s/${slug}` },
    { label: "About", href: `/s/${slug}/about` },
    { label: "Blog", href: `/s/${slug}/blog` },
    { label: "FAQ", href: `/s/${slug}/faq` },
    { label: "Reviews", href: `/s/${slug}/reviews` },
  ];

  const isActive = (href: string) => {
    if (href === `/s/${slug}`) return pathname === `/s/${slug}`;
    return pathname === href;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href={`/s/${slug}`} className="flex items-center gap-2.5 shrink-0 group">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform"
              style={{ backgroundColor: primaryColor }}
            >
              {project.site_logo ? (
                <img src={project.site_logo} alt="logo" className="w-5 h-5 object-contain" />
              ) : (
                <Globe size={15} />
              )}
            </div>
            <span className="text-sm font-black text-gray-900 tracking-tight">{project.name}</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                style={
                  isActive(item.href)
                    ? { color: primaryColor, backgroundColor: primaryColor + "12" }
                    : { color: "#6B7280" }
                }
                onMouseEnter={(e) => {
                  if (!isActive(item.href)) {
                    e.currentTarget.style.color = "#111827";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(item.href)) {
                    e.currentTarget.style.color = "#6B7280";
                  }
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA + Mobile toggle */}
          <div className="flex items-center gap-3 shrink-0">
            {project.product_url && (
              <a
                href={project.product_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-xs font-black uppercase tracking-wider transition-all hover:opacity-90 active:scale-95"
                style={{ backgroundColor: primaryColor }}
              >
                Get Started <ExternalLink size={12} />
              </a>
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
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all"
                style={
                  isActive(item.href)
                    ? { color: primaryColor, backgroundColor: primaryColor + "10" }
                    : { color: "#374151" }
                }
              >
                {item.label}
              </Link>
            ))}
            {project.product_url && (
              <a
                href={project.product_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 mt-2 px-4 py-3 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90"
                style={{ backgroundColor: primaryColor }}
              >
                Get Started <ExternalLink size={14} />
              </a>
            )}
          </div>
        )}
      </header>

      {/* Page Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  {project.site_logo ? (
                    <img src={project.site_logo} alt="logo" className="w-5 h-5 object-contain" />
                  ) : (
                    <Globe size={15} />
                  )}
                </div>
                <span className="font-black text-sm">{project.name}</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                {project.product_description.slice(0, 120)}...
              </p>
            </div>

            {/* Navigation */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: primaryColor }}>
                Pages
              </h4>
              <ul className="space-y-3">
                {navItems.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors font-medium"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: primaryColor }}>
                Get Started
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Ready to experience the difference?
              </p>
              {project.product_url && (
                <a
                  href={project.product_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-bold transition-all hover:opacity-90"
                  style={{ backgroundColor: primaryColor }}
                >
                  Visit Website <ExternalLink size={13} />
                </a>
              )}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              © {new Date().getFullYear()} {project.name}. All rights reserved.
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
