"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // Hide main public footer on recruiter dashboard pages
  if (pathname.startsWith("/recruiter") && pathname !== "/recruiter/login" && pathname !== "/recruiter/register") {
    return null;
  }

  return (
    <footer className="bg-white border-t border-slate-200/80 pt-12 pb-8 mt-auto font-sans antialiased">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-100">
          {/* Company Brand Column */}
          <div className="md:col-span-5 space-y-3">
            <Link href="/" className="font-display font-extrabold text-2xl text-blue-600 tracking-tight block">
              Career77
            </Link>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed font-normal">
              Connecting world-class talent with the companies of tomorrow. The world's most trusted recruitment platform for high-growth companies.
            </p>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-7 grid grid-cols-3 gap-6 text-xs">
            {/* Product Column */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Product</h4>
              <ul className="space-y-2 text-slate-500 font-medium">
                <li><Link href="/openings" className="hover:text-blue-600 transition-colors">Jobs</Link></li>
                <li><Link href="/companies" className="hover:text-blue-600 transition-colors">Companies</Link></li>
                <li><Link href="/openings" className="hover:text-blue-600 transition-colors">Careers</Link></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Help Center</a></li>
              </ul>
            </div>

            {/* Legal Column */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Legal</h4>
              <ul className="space-y-2 text-slate-500 font-medium">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Security</a></li>
              </ul>
            </div>

            {/* Connect Column */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Connect</h4>
              <ul className="space-y-2 text-slate-500 font-medium">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">LinkedIn</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
          <p>© 2024 Career77. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="cursor-pointer hover:text-slate-600">🌐 English</span>
            <span>•</span>
            <span className="cursor-pointer hover:text-slate-600">🔒 Secure</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
