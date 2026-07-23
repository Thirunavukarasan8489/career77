"use client";

import React from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';

export default function ProfilePage() {
  const { data: profile, isLoading: loading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await apiClient.get('/candidates/profile');
      return res.data;
    },
  });

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading profile...</div>;
  }

  if (error || !profile) {
    return <div className="p-8 text-center text-slate-500">Failed to load profile. Please complete onboarding.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Main Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <Card padding="none" className="overflow-hidden relative">
            <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
            <div className="px-8 pb-8">
              <div className="flex justify-between items-end -mt-12 mb-6">
                <div className="w-24 h-24 rounded-full bg-white p-1 shadow-md">
                  <div className="w-full h-full rounded-full bg-slate-200 border border-slate-100 flex items-center justify-center text-slate-400 font-bold text-2xl">
                    JD
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="text-xs font-bold">Export CV</Button>
                  <Button className="text-xs font-bold">Edit Profile</Button>
                </div>
              </div>
              
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-1">{profile.name}</h1>
                <p className="text-slate-600 mb-4 font-medium">{profile.experience || "Experience not specified"}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {profile.city || "City not set"}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {profile.email}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* About Me */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-900 text-lg">About Me</h2>
              <button className="text-slate-400 hover:text-blue-600 transition-colors p-1">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              {profile.bio || "No bio added yet."}
            </p>
          </Card>

          {/* Experience */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-slate-900 text-lg">Experience</h2>
              <button className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Experience
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4 relative">
                {/* Timeline Line */}
                <div className="absolute left-[19px] top-10 bottom-[-24px] w-px bg-slate-100 hidden sm:block"></div>
                
                <div className="w-10 h-10 rounded-lg bg-slate-900 text-white font-bold flex items-center justify-center shrink-0 z-10 hidden sm:flex">
                  L
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-bold text-slate-900">Senior Product Designer</h3>
                      <p className="text-sm text-slate-600 font-medium">Linear</p>
                    </div>
                    <button className="text-slate-400 hover:text-blue-600 transition-colors p-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">Jan 2022 — Present • 2 yrs 10 mos</p>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Led the core experience design for issue tracking and cycles. Developed the internal design system resulting in 30% faster UI implementation. Managed a team of 3 product designers.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 relative">
                <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 z-10 hidden sm:flex">
                  S
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-bold text-slate-900">Product Designer</h3>
                      <p className="text-sm text-slate-600 font-medium">Stripe</p>
                    </div>
                    <button className="text-slate-400 hover:text-blue-600 transition-colors p-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">Mar 2019 — Dec 2021 • 2 yrs 10 mos</p>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Designed critical flows for Stripe Billing and Checkout. Contributed heavily to the Sail design system. Improved Checkout conversion rates by 4.2% through A/B tested UX improvements.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Profile Strength */}
          <Card>
            <h3 className="font-bold text-slate-900 mb-4">Profile Strength</h3>
            <div className="flex items-center gap-4 mb-4">
              {/* Circular Progress */}
              <div className="relative w-16 h-16 shrink-0">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  <path
                    className="text-blue-600"
                    strokeDasharray="85, 100"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-900">
                  85%
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Looking good!</p>
                <p className="text-xs text-slate-500">Complete the remaining items to boost your visibility.</p>
              </div>
            </div>
          </Card>

          {/* Visibility Toggle */}
          <Card className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-900 mb-0.5">Public View</p>
              <p className="text-xs text-slate-500">Recruiters can see your profile.</p>
            </div>
            {/* Toggle switch */}
            <div className="w-10 h-6 bg-blue-600 rounded-full relative cursor-pointer shadow-inner">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all"></div>
            </div>
          </Card>

          {/* Top Skills */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900">Top Skills</h3>
              <button className="text-slate-400 hover:text-blue-600 transition-colors p-1">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.skills && profile.skills.length > 0 ? (
                profile.skills.map((skill: string) => (
                  <Badge key={skill} className="bg-slate-100 text-slate-700 font-semibold px-3 py-1">{skill}</Badge>
                ))
              ) : (
                <span className="text-sm text-slate-500">No skills added</span>
              )}
            </div>
          </Card>

          {/* Improve Profile */}
          <Card>
            <h3 className="font-bold text-slate-900 mb-4">Improve your profile</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 rounded-xl border border-dashed border-slate-300 text-sm font-bold text-blue-600 hover:bg-slate-50 transition-colors">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Certification
                </span>
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-xl border border-dashed border-slate-300 text-sm font-bold text-blue-600 hover:bg-slate-50 transition-colors">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Upload Portfolio PDF
                </span>
              </button>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}
