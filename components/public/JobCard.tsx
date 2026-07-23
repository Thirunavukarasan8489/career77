import React from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export interface JobCardProps {
  id: string;
  title: string;
  companyName: string;
  location: string;
  salary?: string;
  jobType: string;
  postedAt: string;
  logoUrl?: string;
}

export default function JobCard({ id, title, companyName, location, salary, jobType, postedAt, logoUrl }: JobCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow group flex flex-col justify-between h-full relative">
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
              {logoUrl ? (
                <img src={logoUrl} alt={companyName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl font-bold text-slate-400">{companyName.charAt(0)}</span>
              )}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                <Link href={`/jobs/${id}`} className="focus:outline-none">
                  <span className="absolute inset-0" aria-hidden="true" />
                  {title}
                </Link>
              </h3>
              <p className="text-sm text-slate-500 font-medium">{companyName}</p>
            </div>
          </div>
        </div>
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {location}
          </div>
          {salary && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {salary}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between mt-auto z-10">
        <Badge variant="neutral">{jobType}</Badge>
        <span className="text-xs font-semibold text-slate-400">{postedAt}</span>
      </div>
    </Card>
  );
}
