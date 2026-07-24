import React, { ReactNode } from 'react';
import Card from '@/components/ui/Card';

export interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: number; // positive or negative percentage
  icon: ReactNode;
}

export default function MetricCard({ title, value, trend, icon }: MetricCardProps) {
  return (
    <Card className="flex items-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-bold text-slate-500 mb-1">{title}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-slate-900">{value}</span>
          {trend !== undefined && (
            <span className={`text-xs font-bold flex items-center ${trend >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {trend >= 0 ? (
                <svg className="w-3 h-3 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
              ) : (
                <svg className="w-3 h-3 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              )}
              {Math.abs(trend)}%
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
