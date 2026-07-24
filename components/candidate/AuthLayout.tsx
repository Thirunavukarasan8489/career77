import React from 'react';
import Link from 'next/link';

export default function AuthLayout({ children, activeTab }: { children: React.ReactNode, activeTab: 'login' | 'register' }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl shadow-blue-900/10 flex overflow-hidden min-h-[600px]">
        {/* Left Side - Blue Banner */}
        <div className="hidden md:flex md:w-5/12 bg-blue-700 p-12 flex-col justify-between relative overflow-hidden text-white">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-600 to-blue-800" />
          
          <div className="relative z-10 space-y-12">
            <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              Career77
            </Link>

            <div>
              <h2 className="text-3xl font-bold mb-4 leading-tight">Elevate your career trajectory.</h2>
              <p className="text-blue-100 mb-12">
                Join over 50,000 professionals finding high-impact roles at top-tier companies globally.
              </p>

              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/50 flex items-center justify-center shrink-0 border border-blue-500">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.95 11.95 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Verified Employers</h3>
                    <p className="text-sm text-blue-100">Work with the best in the industry.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/50 flex items-center justify-center shrink-0 border border-blue-500">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Instant Apply</h3>
                    <p className="text-sm text-blue-100">One-click applications for saved resumes.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-7/12 p-8 md:p-16 flex flex-col relative">
          <div className="flex justify-center mb-12">
            <div className="bg-slate-50 p-1 rounded-xl flex items-center w-full max-w-sm">
              <Link 
                href="/login"
                className={`flex-1 text-center py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'login' ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Login
              </Link>
              <Link 
                href="/register"
                className={`flex-1 text-center py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'register' ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Register
              </Link>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto">
            {children}
          </div>

          <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-center gap-6 text-sm font-medium text-slate-500">
            <Link href="/recruiter/login" className="hover:text-blue-600 transition-colors">Employer Login</Link>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <Link href="/help" className="hover:text-blue-600 transition-colors">Help Center</Link>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <Link href="/jobs" className="hover:text-blue-600 transition-colors">Job Board</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
