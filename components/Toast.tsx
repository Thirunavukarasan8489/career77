"use client";

import React, { useState, useEffect } from "react";

export default function Toast() {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleToast = (e: Event) => {
      const msg = (e as CustomEvent).detail;
      setMessage(msg);
      setVisible(true);
    };

    window.addEventListener("show-toast", handleToast);
    return () => window.removeEventListener("show-toast", handleToast);
  }, []);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-6 py-3.5 rounded-xl shadow-2xl z-50 text-sm font-semibold transition-all duration-300 transform ${
        visible
          ? "translate-y-0 opacity-100 scale-100"
          : "translate-y-10 opacity-0 scale-95 pointer-events-none"
      }`}
    >
      {message}
    </div>
  );
}

/**
 * Triggers a global toast alert.
 */
export function showToast(message: string) {
  if (typeof window !== "undefined") {
    const event = new CustomEvent("show-toast", { detail: message });
    window.dispatchEvent(event);
  }
}
