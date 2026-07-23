"use client";

import React from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';

export default function DashboardPage() {
  const { data: session } = useSession();

  const { data, isLoading: loading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await apiClient.get('/candidate/dashboard');
      return res.data;
    },
  });

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading dashboard...</div>;
  }

  if (error || !data) {
    return <div className="p-8 text-center text-slate-500">Failed to load dashboard data.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome back, {session?.user?.name || 'Candidate'}!</h1>
          <p className="text-slate-500 text-sm">Here is what's happening with your job search today.</p>
        </div>
        <Button className="flex items-center gap-2 shadow-md shadow-blue-600/20">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Browse Jobs
        </Button>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Active Applications</p>
            <p className="text-2xl font-extrabold text-slate-900">{data.stats?.activeApplications || 0}</p>
          </div>
        </Card>
        
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Upcoming Interviews</p>
            <p className="text-2xl font-extrabold text-slate-900">{data.stats?.upcomingInterviews || 0}</p>
          </div>
        </Card>
        
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Job Offers</p>
            <p className="text-2xl font-extrabold text-slate-900">{data.stats?.jobOffers || 0}</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recommended Jobs */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900">Recommended Jobs</h2>
              <Link href="/jobs" className="text-sm font-bold text-blue-600 hover:text-blue-700">View all</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.recommendedJobs && data.recommendedJobs.length > 0 ? (
                data.recommendedJobs.map((job: any) => (
                  <Card key={job._id} className="flex flex-col justify-between hover:border-blue-200 transition-colors cursor-pointer group">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 font-bold">
                          {job.companyId?.name?.substring(0, 2) || 'C'}
                        </div>
                        <Badge variant="success" className="bg-emerald-50 text-emerald-700">New</Badge>
                      </div>
                      <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                      <p className="text-sm text-slate-500 mb-6">{job.companyId?.name || 'Company'} • {job.location || 'Remote'}</p>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                      <span className="text-sm font-bold text-slate-700">{job.salaryRange || 'Competitive'}</span>
                      <span className="text-sm font-bold text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                        Apply Now
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="col-span-2 p-4 text-center text-slate-500 text-sm">No recommended jobs at the moment.</div>
              )}
            </div>
          </section>

          {/* Application Tracking */}
          <section>
            <h2 className="text-sm font-bold text-slate-900 mb-4">Application Tracking</h2>
            <Card padding="none" className="overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider">COMPANY</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider">ROLE</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider">STATUS</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider">DATE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.recentApplications && data.recentApplications.length > 0 ? (
                    data.recentApplications.map((app: any) => (
                      <tr key={app._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-bold text-slate-900">{app.jobId?.companyId?.name || 'Company'}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{app.jobId?.title || 'Role'}</td>
                        <td className="px-6 py-4">
                          <Badge variant={app.status === 'offered' ? 'success' : app.status === 'rejected' ? 'warning' : 'default'}>
                            {app.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-sm text-center text-slate-500">No applications yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Card>
          </section>
        </div>

        {/* Right Sidebar Column */}
        <div className="space-y-6">
          {/* Next Interview Card */}
          <Card className="border-blue-100 shadow-blue-900/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 cursor-pointer text-slate-400 hover:text-slate-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-6">Next Interview</h3>
            
            <div className="flex gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-blue-600 text-white flex flex-col items-center justify-center shrink-0 shadow-md shadow-blue-600/30">
                <span className="text-xl font-black leading-none">28</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">Oct</span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm leading-tight mb-1">Vercel: Onsite Presentation</h4>
                <p className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  10:00 AM — 11:30 AM
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-between mb-6 border border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                  </svg>
                </div>
                <span className="text-sm font-semibold text-slate-700">Zoom Meeting</span>
              </div>
              <button className="text-xs font-bold text-blue-600 hover:text-blue-700">Copy Link</button>
            </div>

            <Button className="w-full">Join Interview</Button>
          </Card>

          {/* Profile Strength */}
          <Card>
            <h3 className="font-bold text-sm text-slate-900 mb-2">Profile Strength</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Complete your profile to increase your visibility to recruiters by 4x.
            </p>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <Badge variant="default" className="text-[10px] py-0.5 font-extrabold bg-blue-100 text-blue-700">
                  {data.profileStrength || 0}% COMPLETE
                </Badge>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${data.profileStrength || 0}%` }}></div>
              </div>
            </div>

            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Resume uploaded
              </li>
              <li className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Experience details added
              </li>
              <li className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add personal website
              </li>
            </ul>
          </Card>

          {/* Article */}
          <Card padding="none" className="overflow-hidden group cursor-pointer hover:border-blue-200 transition-colors">
            <div className="h-32 bg-slate-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-slate-300 animate-pulse"></div>
            </div>
            <div className="p-4">
              <h4 className="font-bold text-sm text-slate-900 mb-2">Negotiating Your Next Offer</h4>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Learn the 5 key strategies for maximizing your compensation package.
              </p>
              <span className="text-xs font-bold text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                Read article
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
