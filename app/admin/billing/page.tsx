"use client";

import { useState } from "react";

export default function AdminBillingPage() {
  const plans = [
    { name: "Free Tier", price: "₹0 / mo", jobs: "Up to 2 active jobs", support: "Basic" },
    { name: "Starter Recruiter", price: "₹4,999 / mo", jobs: "Up to 10 active jobs", support: "Priority Email" },
    { name: "Enterprise ATS", price: "₹14,999 / mo", jobs: "Unlimited jobs", support: "Dedicated Manager" },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-8">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
          Billing & Subscription Management
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Monitor company subscription tiers, invoice statuses, and payment gateway webhooks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans.map((p) => (
          <div key={p.name} className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="font-bold text-white text-lg">{p.name}</h3>
            <p className="text-2xl font-extrabold text-purple-400">{p.price}</p>
            <div className="text-xs text-slate-400 space-y-1">
              <p>• {p.jobs}</p>
              <p>• {p.support}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
