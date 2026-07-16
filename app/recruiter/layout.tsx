import React from "react";

// Block all recruiter panel pages from crawlers (Section 5)
export const metadata = {
  robots: { index: false, follow: false },
};

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
