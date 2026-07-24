"use client";

import React from "react";
import Toast from "@/components/common/Toast";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="flex flex-col grow">{children}</main>
      <Toast />
    </>
  );
}
