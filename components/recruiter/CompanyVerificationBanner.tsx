import React from 'react';
import Link from 'next/link';

export type VerificationStatus = 'pending' | 'rejected' | 'approved';

export interface CompanyVerificationBannerProps {
  status: VerificationStatus;
  reason?: string;
}

export default function CompanyVerificationBanner({ status, reason }: CompanyVerificationBannerProps) {
  if (status === 'approved') return null;

  const isRejected = status === 'rejected';

  return (
    <div className={`p-4 rounded-xl border mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 ${
      isRejected ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
    }`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
        isRejected ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
      }`}>
        {isRejected ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      </div>
      
      <div className="flex-1">
        <h4 className={`font-bold text-sm ${isRejected ? 'text-red-900' : 'text-amber-900'}`}>
          {isRejected ? 'Company Verification Rejected' : 'Company Verification Pending'}
        </h4>
        <p className={`text-sm mt-0.5 ${isRejected ? 'text-red-700' : 'text-amber-700'}`}>
          {isRejected 
            ? (reason || "Your company details could not be verified. Please contact support or update your details.")
            : "Your account is currently under review by our Super Admin team. You will have full access once approved."}
        </p>
      </div>

      {isRejected && (
        <Link 
          href="/recruiter/settings" 
          className="shrink-0 bg-red-100 hover:bg-red-200 text-red-800 text-sm font-bold px-4 py-2 rounded-lg transition-colors"
        >
          Update Details
        </Link>
      )}
    </div>
  );
}
