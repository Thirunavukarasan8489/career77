import React from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';

export interface CompanyCardProps {
  id: string;
  name: string;
  industry: string;
  openPositions: number;
  description: string;
  logoUrl?: string;
}

export default function CompanyCard({ id, name, industry, openPositions, description, logoUrl }: CompanyCardProps) {
  return (
    <Card className="hover:border-blue-200 transition-colors group flex flex-col h-full text-center items-center relative">
      <Link href={`/companies/${id}`} className="absolute inset-0 z-10" aria-label={`View ${name} profile`}></Link>
      <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-4 overflow-hidden z-20">
        {logoUrl ? (
          <img src={logoUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-2xl font-bold text-slate-300">{name.charAt(0)}</span>
        )}
      </div>
      <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors mb-1">{name}</h3>
      <p className="text-xs font-semibold text-blue-600 mb-3">{industry}</p>
      <p className="text-sm text-slate-500 line-clamp-3 mb-6">
        {description}
      </p>
      <div className="mt-auto z-20">
        <span className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold">
          {openPositions} Open Position{openPositions !== 1 ? 's' : ''}
        </span>
      </div>
    </Card>
  );
}
