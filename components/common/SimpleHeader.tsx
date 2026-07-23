import React from 'react';
import Link from 'next/link';

interface SimpleHeaderProps {
  type?: 'candidate' | 'recruiter';
}

export default function SimpleHeader({ type = 'candidate' }: SimpleHeaderProps) {
  const isRecruiter = type === 'recruiter';

  return (
    <header className="bg-white border-b border-slate-200/80 px-6 sm:px-12 py-4 flex items-center justify-between shrink-0">
      <Link href="/" className="font-display font-extrabold text-2xl text-blue-600 tracking-tight">
        Career77
      </Link>
      <div className="hidden sm:flex items-center gap-6 text-xs font-semibold text-slate-600">
        <Link href="/openings" className="hover:text-blue-600 transition-colors">Jobs</Link>
        <Link href="/companies" className="hover:text-blue-600 transition-colors">Companies</Link>
        <Link href="/recruiter/login" className={`transition-colors ${isRecruiter ? 'text-blue-600 font-bold' : 'hover:text-blue-600'}`}>For Employers</Link>
      </div>
      <div className="flex items-center gap-3">
        {isRecruiter ? (
          <>
            <Link href="/login" className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 transition-colors">
              Login
            </Link>
            <Link
              href="/recruiter/register"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-xs transition-all"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <Link href="/login" className="text-xs font-semibold text-blue-600 px-3 py-2 hover:text-blue-700 transition-colors">
              Candidate Login
            </Link>
            <Link
              href="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-xs transition-all"
            >
              Register Resume
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
