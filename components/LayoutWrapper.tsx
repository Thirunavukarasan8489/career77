"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Toast from "./Toast";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide the public site Navbar and Footer on recruiter panel and candidate dashboard pages
  const isDashboardOrRecruiter =
    pathname.startsWith("/recruiter") || pathname.startsWith("/dashboard");

  return (
    <>
      {!isDashboardOrRecruiter && <Navbar />}
      <main className="flex flex-col grow">{children}</main>
      {!isDashboardOrRecruiter && <Footer />}
      <Toast />
    </>
  );
}
