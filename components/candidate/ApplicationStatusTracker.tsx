import React from 'react';
import Card from '@/components/ui/Card';

export type ApplicationStatus = 'applied' | 'screening' | 'interview' | 'offer' | 'rejected';

export interface ApplicationStatusTrackerProps {
  currentStatus: ApplicationStatus;
  jobTitle: string;
  companyName: string;
  appliedDate: string;
}

export default function ApplicationStatusTracker({ currentStatus, jobTitle, companyName, appliedDate }: ApplicationStatusTrackerProps) {
  const steps: { key: ApplicationStatus; label: string }[] = [
    { key: 'applied', label: 'Applied' },
    { key: 'screening', label: 'Screening' },
    { key: 'interview', label: 'Interview' },
    { key: 'offer', label: 'Offer' },
  ];

  const currentIndex = steps.findIndex(s => s.key === currentStatus);
  const isRejected = currentStatus === 'rejected';

  return (
    <Card className="flex flex-col space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-slate-900">{jobTitle}</h3>
          <p className="text-sm text-slate-500">{companyName}</p>
        </div>
        <span className="text-xs font-semibold text-slate-400">Applied {appliedDate}</span>
      </div>

      <div className="relative pt-4">
        <div className="absolute top-6 left-0 w-full h-1 bg-slate-100 rounded-full" />
        <div 
          className={`absolute top-6 left-0 h-1 rounded-full transition-all duration-500 ${isRejected ? 'bg-red-500' : 'bg-blue-600'}`} 
          style={{ width: `${isRejected ? 100 : (currentIndex / (steps.length - 1)) * 100}%` }}
        />
        
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = index <= currentIndex && !isRejected;
            const isCurrent = index === currentIndex && !isRejected;
            
            return (
              <div key={step.key} className="flex flex-col items-center">
                <div className={`w-5 h-5 rounded-full z-10 flex items-center justify-center border-2 mb-2 ${
                  isRejected ? 'border-red-500 bg-white text-red-500' :
                  isCompleted ? 'border-blue-600 bg-blue-600 text-white' : 
                  'border-slate-200 bg-white text-slate-300'
                }`}>
                  {isCompleted && (
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {isRejected && index === currentIndex && (
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <span className={`text-xs font-bold ${
                  isRejected && index === currentIndex ? 'text-red-600' :
                  isCurrent ? 'text-blue-600' : 
                  isCompleted ? 'text-slate-700' : 
                  'text-slate-400'
                }`}>{step.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
