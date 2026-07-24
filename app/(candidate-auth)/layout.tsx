import React from "react";
import Navbar from "@/components/layout/PublicNavbar";
import Footer from "@/components/layout/PublicFooter";

export default function CandidateAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex flex-col grow">{children}</main>
      <Footer />
    </>
  );
}
