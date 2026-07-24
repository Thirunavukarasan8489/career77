"use client";

import { showToast } from "@/components/common/Toast";

export default function AdminBillingPage() {
  const plans = [
    { name: "Free Tier", price: "₹0 / mo", jobs: "Up to 2 active jobs", support: "Basic" },
    { name: "Starter Recruiter", price: "₹4,999 / mo", jobs: "Up to 10 active jobs", support: "Priority Email" },
    { name: "Enterprise ATS", price: "₹14,999 / mo", jobs: "Unlimited jobs", support: "Dedicated Manager" },
  ];

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-8">
      <div className="border-b border-slate-100 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-slate-900">
            Billing & Subscription Management
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Monitor company subscription tiers, invoice statuses, and payment gateway webhooks.
          </p>
        </div>
        <button
          onClick={() => showToast("Opening payment gateway logs...")}
          className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-colors shrink-0"
        >
          Payment Gateway Logs
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans.map((p) => (
          <div key={p.name} className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-6 space-y-4 hover:border-slate-300 transition-all">
            <h3 className="font-bold text-slate-900 text-lg">{p.name}</h3>
            <p className="text-2xl font-extrabold text-purple-600">{p.price}</p>
            <div className="text-xs text-slate-600 font-medium space-y-1">
              <p>• {p.jobs}</p>
              <p>• {p.support}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
