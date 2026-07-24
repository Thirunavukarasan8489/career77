import React from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export interface ApplicantRowProps {
  id: string;
  name: string;
  role: string;
  matchScore: number;
  stage: string;
  appliedDate: string;
  onView?: () => void;
}

export default function ApplicantRow({ id: _id, name, role, matchScore, stage, appliedDate, onView }: ApplicantRowProps) {
  // Color code the match score
  let scoreColor = "text-amber-600 bg-amber-50 border-amber-200";
  if (matchScore >= 80) scoreColor = "text-emerald-600 bg-emerald-50 border-emerald-200";
  else if (matchScore < 50) scoreColor = "text-red-600 bg-red-50 border-red-200";

  return (
    <Card padding="sm" className="hover:border-blue-200 transition-colors flex items-center justify-between gap-4">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center shrink-0">
          {name.charAt(0)}
        </div>
        <div>
          <h4 className="font-bold text-slate-900 text-sm">{name}</h4>
          <p className="text-xs text-slate-500">{role} • Applied {appliedDate}</p>
        </div>
      </div>
      
      <div className="flex items-center justify-center px-4 hidden md:flex">
        <div className={`px-2.5 py-1 rounded-lg border text-xs font-bold ${scoreColor}`}>
          {matchScore}% Match
        </div>
      </div>
      
      <div className="flex items-center justify-center px-4 hidden sm:flex">
        <Badge variant="neutral">{stage}</Badge>
      </div>

      <div className="shrink-0 pl-2">
        <Button variant="outline" size="sm" onClick={onView}>
          Review
        </Button>
      </div>
    </Card>
  );
}
