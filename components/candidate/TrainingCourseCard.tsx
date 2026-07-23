import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export interface TrainingCourseCardProps {
  title: string;
  provider: string;
  duration: string;
  price: number;
  skills: string[];
  imageUrl?: string;
  onEnroll?: () => void;
}

export default function TrainingCourseCard({ title, provider, duration, price, skills, imageUrl, onEnroll }: TrainingCourseCardProps) {
  return (
    <Card padding="none" className="overflow-hidden flex flex-col group">
      <div className="h-40 bg-slate-200 relative">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 opacity-90" />
        )}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-900 shadow-sm">
          ${price.toFixed(2)}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-4 flex-1">
          <p className="text-xs font-bold text-blue-600 mb-1">{provider}</p>
          <h3 className="font-bold text-lg text-slate-900 mb-2 leading-tight">{title}</h3>
          
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4 font-medium">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {duration}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {skills.map(skill => (
              <span key={skill} className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold uppercase tracking-wider">
                {skill}
              </span>
            ))}
          </div>
        </div>
        
        <Button className="w-full" onClick={onEnroll}>
          Enroll Now
        </Button>
      </div>
    </Card>
  );
}
