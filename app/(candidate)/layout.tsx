import React from "react";
import CandidateLayoutClient from "@/components/CandidateLayoutClient";

// Block all candidate dashboard pages from crawlers (Section 5)
export const metadata = {
  robots: { index: false, follow: false },
};

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CandidateLayoutClient>
      {children}
    </CandidateLayoutClient>
  );
}
