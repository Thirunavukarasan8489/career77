"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { showToast } from "@/components/Toast";

interface AdminLayoutClientProps {
  children: React.ReactNode;
  userEmail?: string;
}

export default function AdminLayoutClient({ children, userEmail }: AdminLayoutClientProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const navItems = [
    { name: "Overview", href: "/admin", icon: "📊" },
    { name: "Users", href: "/admin/users", icon: "👥" },
    { name: "Companies", href: "/admin/companies", icon: "🏢" },
    { name: "Jobs Moderation", href: "/admin/jobs", icon: "💼" },
    { name: "Verification Queue", href: "/admin/verification", icon: "✓" },
    { name: "Analytics", href: "/admin/analytics", icon: "📈" },
    { name: "CMS Editor", href: "/admin/cms", icon: "📝" },
    { name: "Billing & Plans", href: "/admin/billing", icon: "💳" },
    { name: "Support Tickets", href: "/admin/support", icon: "🎧" },
    { name: "System Settings", href: "/admin/settings", icon: "⚙️" },
  ];

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/admin/login" });
    showToast("Super Admin logged out.");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <header className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            aria-label="Open Navigation"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-bold text-white text-lg">Super Admin</span>
        </div>
        <Link href="/" className="text-xs font-semibold text-indigo-400">
          Home
        </Link>
      </header>

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-8">
        <aside className="hidden md:block w-64 shrink-0">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl sticky top-6">
            <div className="flex items-center gap-3 pb-5 border-b border-slate-800 mb-5">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-black flex items-center justify-center text-lg shadow-md shadow-purple-600/30">
                SA
              </div>
              <div className="overflow-hidden">
                <h2 className="font-bold text-white text-sm truncate">Super Admin</h2>
                <p className="text-xs text-slate-400 truncate">{userEmail || "admin@career77.com"}</p>
              </div>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-8 pt-5 border-t border-slate-800 space-y-2">
              <Link
                href="/"
                className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
              >
                &larr; Public Storefront
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-900/30 transition-colors"
              >
                Sign Out Admin
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
