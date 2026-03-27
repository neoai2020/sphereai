"use client";

import { useState, useEffect } from "react";
import logo from "./assets/logo.png";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  LogOut,
  Globe,
  Rocket,
  Cpu,
  Infinity,
  Sparkles,
  GraduationCap,
  Zap,
  FolderLock,
  MessagesSquare,
  Star,
  Wand2
} from "lucide-react";

const navSections = [
  {
    title: "Main",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/dashboard/projects/new", label: "Site Forge", icon: Zap },
      { href: "/dashboard/projects", label: "Asset Vault", icon: FolderLock },
    ],
  },
  {
    title: "Resources",
    items: [
      { href: "/dashboard/training", label: "Training", icon: GraduationCap },
      { href: "/dashboard/logo-generator", label: "Logo Generator", icon: Wand2 },
      { href: "/dashboard/support", label: "Support", icon: MessagesSquare },
    ],
  },
  {
    title: "Premium",
    isPremium: true,
    items: [
      { href: "/dashboard/10x", label: "10x", icon: Rocket },
      { href: "/dashboard/automation", label: "Automation", icon: Cpu },
      { href: "/dashboard/infinite", label: "Infinite", icon: Infinity },
      { href: "/dashboard/dfy", label: "DFY", icon: Star },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [userInfo, setUserInfo] = useState<{ email: string | null; name: string | null }>({ email: null, name: null });

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserInfo({
          email: user.email ?? null,
          name: user.user_metadata?.full_name || user.email?.split("@")[0] || null
        });
      }
    }
    getUser();
  }, [supabase]);


  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 overflow-y-auto">
      <div className="p-6 border-b border-gray-100 shrink-0 mb-4 flex justify-center">
        <Link href="/dashboard" className="flex items-center w-full">
          <Image 
            src={logo} 
            alt="SphereAI" 
            width={220} 
            className="w-[200px] h-auto object-contain" 
            priority
          />
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-6">
        {navSections.map((section) => (
          <div key={section.title} className={cn("space-y-1", section.isPremium && "pt-4")}>
            <div className="flex items-center justify-between px-3 mb-2">
              <h3 className={cn(
                "text-xs font-semibold uppercase tracking-wider",
                section.isPremium 
                  ? "bg-gradient-to-r from-brand-600 to-amber-500 bg-clip-text text-transparent font-black" 
                  : "text-gray-400"
              )}>
                {section.title}
              </h3>
              {section.isPremium && (
                <div className="flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-[10px] font-black text-amber-600 uppercase">Pro</span>
                </div>
              )}
            </div>
            
            <div className={cn(
              "space-y-1 relative",
              section.isPremium && "p-2 rounded-2xl bg-gradient-to-b from-brand-50 to-amber-50/50 border border-brand-100 shadow-[0_0_20px_rgba(79,70,229,0.1)] overflow-hidden"
            )}>
              {section.isPremium && (
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-400/5 via-transparent to-amber-400/5 animate-pulse pointer-events-none" />
              )}
              {section.items.map((item) => {
                const isActive = 
                  pathname === item.href || 
                  (item.href !== "/dashboard" && 
                   pathname.startsWith(item.href + "/") && 
                   !(item.href === "/dashboard/projects" && pathname.startsWith("/dashboard/projects/new")));
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group",
                      isActive
                        ? section.isPremium 
                          ? "bg-white text-brand-700 shadow-sm border border-brand-100" 
                          : "bg-brand-50 text-brand-700"
                        : section.isPremium
                          ? "text-gray-700 hover:bg-white/80 hover:text-brand-900"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <item.icon size={18} className={cn(
                      "transition-transform group-hover:scale-110",
                      isActive ? "text-brand-600" : "text-gray-400",
                      section.isPremium && !isActive && "text-brand-500/70"
                    )} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100 shrink-0 space-y-3">
        {userInfo.email && (
          <div className="px-3 py-2 rounded-xl bg-gray-50/80 border border-gray-100">
            <p className="text-sm font-bold text-gray-900 truncate">{userInfo.name}</p>
            <p className="text-[11px] font-medium text-gray-500 truncate">{userInfo.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors w-full"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
