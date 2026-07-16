import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import RecruiterLayoutClient from "@/components/RecruiterLayoutClient";

export default async function RecruiterPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <RecruiterLayoutClient userEmail={session?.user?.email || "recruiter@company.com"}>
      {children}
    </RecruiterLayoutClient>
  );
}
