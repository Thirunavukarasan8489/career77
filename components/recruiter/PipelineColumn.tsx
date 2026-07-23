import React, { ReactNode } from 'react';

export interface PipelineColumnProps {
  title: string;
  count: number;
  children: ReactNode;
}

export default function PipelineColumn({ title, count, children }: PipelineColumnProps) {
  return (
    <div className="flex flex-col w-80 shrink-0 h-full bg-slate-50 rounded-2xl border border-slate-200/60 overflow-hidden">
      <div className="p-4 border-b border-slate-200/80 bg-white flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <h3 className="font-bold text-sm text-slate-800">{title}</h3>
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
          {count}
        </span>
      </div>
      <div className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
        {children}
      </div>
    </div>
  );
}
