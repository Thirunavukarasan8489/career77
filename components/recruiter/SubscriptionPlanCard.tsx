import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export interface SubscriptionPlanCardProps {
  name: string;
  price: string;
  interval: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  isActive?: boolean;
  onSubscribe?: () => void;
}

export default function SubscriptionPlanCard({ 
  name, price, interval, description, features, isPopular, isActive, onSubscribe 
}: SubscriptionPlanCardProps) {
  return (
    <Card className={`relative flex flex-col h-full ${isPopular ? 'border-blue-500 shadow-blue-900/5 shadow-xl' : ''}`}>
      {isPopular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-full">
          Most Popular
        </div>
      )}
      
      <div className="mb-6">
        <h3 className="font-bold text-lg text-slate-900">{name}</h3>
        <p className="text-sm text-slate-500 mt-1">{description}</p>
      </div>
      
      <div className="mb-6 flex items-baseline gap-1">
        <span className="text-3xl font-extrabold text-slate-900">{price}</span>
        <span className="text-sm text-slate-500 font-medium">/{interval}</span>
      </div>
      
      <ul className="space-y-3 mb-8 flex-1">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
            <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">{feature}</span>
          </li>
        ))}
      </ul>
      
      <Button 
        variant={isActive ? 'outline' : (isPopular ? 'primary' : 'secondary')} 
        className="w-full"
        onClick={onSubscribe}
        disabled={isActive}
      >
        {isActive ? 'Current Plan' : 'Subscribe Now'}
      </Button>
    </Card>
  );
}
