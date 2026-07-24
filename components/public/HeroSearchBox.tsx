"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

export default function HeroSearchBox() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (location) params.append('location', location);
    router.push(`/openings?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="bg-white p-2 rounded-2xl shadow-xl shadow-blue-900/5 max-w-4xl mx-auto flex flex-col md:flex-row gap-2 border border-slate-100">
      <div className="flex-1 flex items-center px-4 relative">
        <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input 
          type="text"
          placeholder="Job title, keywords, or company"
          className="w-full bg-transparent border-none focus:ring-0 text-slate-900 text-sm font-medium px-3 py-3 outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="hidden md:block w-px bg-slate-200 my-2"></div>
      <div className="flex-1 flex items-center px-4 relative border-t md:border-t-0 border-slate-100">
        <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <input 
          type="text"
          placeholder="City, state, or zip code"
          className="w-full bg-transparent border-none focus:ring-0 text-slate-900 text-sm font-medium px-3 py-3 outline-none"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      <Button type="submit" size="lg" className="md:w-auto w-full">
        Search Jobs
      </Button>
    </form>
  );
}
