"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function OnboardingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    city: '',
    experience: '',
    skills: '',
    bio: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s);
      const res = await fetch('/api/candidate/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          skills: skillsArray
        })
      });

      if (!res.ok) {
        throw new Error('Failed to save profile details');
      }

      router.push('/candidate');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pt-12 pb-24 px-4">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Welcome to Career77!</h1>
        <p className="text-slate-500">Let's set up your profile so recruiters can find you.</p>
      </div>

      <Card className="p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl">{error}</div>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="City" 
              name="city"
              placeholder="e.g. New York, NY" 
              value={formData.city}
              onChange={handleChange}
              required
            />
            <Input 
              label="Years of Experience" 
              name="experience"
              placeholder="e.g. 5 Years" 
              value={formData.experience}
              onChange={handleChange}
              required
            />
          </div>

          <Input 
            label="Top Skills (comma separated)" 
            name="skills"
            placeholder="React, TypeScript, Node.js" 
            value={formData.skills}
            onChange={handleChange}
            required
          />

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Short Bio</label>
            <textarea 
              name="bio"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm min-h-[100px]"
              placeholder="Tell us a little about yourself..."
              value={formData.bio}
              onChange={handleChange}
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button 
              type="button" 
              onClick={() => router.push('/candidate')}
              className="text-sm font-medium text-slate-500 hover:text-slate-700"
            >
              Skip for now
            </button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Complete Profile'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
