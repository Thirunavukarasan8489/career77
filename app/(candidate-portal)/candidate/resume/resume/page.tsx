"use client";

import React, { useState, useRef } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';

export default function ResumePage() {
  const queryClient = useQueryClient();
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: profile, isLoading: loading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await apiClient.get('/candidates/profile');
      return res.data;
    },
  });

  const resumes = profile?.resumes || [];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadResume(file);
    }
  };

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const res = await apiClient.post('/candidates/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      if (fileInputRef.current) fileInputRef.current.value = '';
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || err.message || 'Upload failed');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  });

  const uploadResume = async (file: File) => {
    if (resumes.length >= 3) {
      setError("You can only upload up to 3 resumes.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File size should not exceed 5MB.");
      return;
    }
    
    setError('');
    uploadMutation.mutate(file);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await uploadResume(file);
    }
  };

  const setPrimaryMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.put(`/candidates/resume/${id}`);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`/candidates/resume/${id}`);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile'] }),
  });

  const setPrimary = (id: string) => setPrimaryMutation.mutate(id);
  const deleteResume = (id: string) => deleteMutation.mutate(id);

  const formatSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Resume Management</h1>
        <p className="text-slate-500 text-sm">Upload, update, and manage your resumes for different applications.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Active Resumes */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="text-lg font-bold text-slate-900 mb-4">Your Resumes ({resumes.length}/3)</h2>
            
            {loading ? (
              <p className="text-slate-500 text-sm">Loading resumes...</p>
            ) : resumes.length === 0 ? (
              <p className="text-slate-500 text-sm">No resumes uploaded yet.</p>
            ) : (
              <div className="space-y-4">
                {resumes.map((resume: any) => (
                  <div key={resume._id} className={`border ${resume.isPrimary ? 'border-blue-200 bg-blue-50/30' : 'border-slate-200'} rounded-2xl p-4 sm:p-6 relative overflow-hidden transition-all hover:shadow-md`}>
                    {resume.isPrimary && <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${resume.isPrimary ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm-1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                          </svg>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-slate-900 max-w-[200px] truncate">{resume.filename}</h3>
                            {resume.isPrimary && <Badge variant="success" className="text-[10px] py-0.5">Primary</Badge>}
                          </div>
                          <p className="text-xs text-slate-500">
                            Uploaded {new Date(resume.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a href={resume.url} target="_blank" rel="noreferrer">
                          <Button variant="outline" size="sm" className="font-bold">Preview</Button>
                        </a>
                        {!resume.isPrimary && (
                          <Button variant="ghost" size="sm" className="font-bold text-blue-600" onClick={() => setPrimary(resume._id)}>
                            Set Primary
                          </Button>
                        )}
                        <button onClick={() => deleteResume(resume._id)} className="p-2 text-slate-400 hover:text-red-600 bg-white border border-slate-200 rounded-lg shadow-sm transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column - Upload */}
        <div className="space-y-6">
          <Card>
            <h3 className="font-bold text-slate-900 mb-4">Upload New Resume</h3>
            
            {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}

            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />

              <div 
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 cursor-pointer ${
                isDragging ? 'border-blue-500 bg-blue-50/50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
              } ${uploadMutation.isPending || resumes.length >= 3 ? 'opacity-50 pointer-events-none' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <p className="font-bold text-sm text-slate-900 mb-1">
                {uploadMutation.isPending ? 'Uploading...' : 'Click to upload or drag and drop'}
              </p>
              <p className="text-xs text-slate-500 mb-6">PDF, DOCX up to 5MB</p>
              
              <Button size="sm" className="w-full" disabled={uploadMutation.isPending || resumes.length >= 3}>
                {uploadMutation.isPending ? 'Please wait' : resumes.length >= 3 ? 'Limit reached' : 'Select File'}
              </Button>
            </div>
          </Card>
          
          <Card className="bg-indigo-600 text-white border-none shadow-xl shadow-indigo-600/20">
            <h3 className="font-bold text-lg mb-2">Need a resume upgrade?</h3>
            <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
              Use our AI-powered resume builder to create a ATS-friendly resume in minutes.
            </p>
            <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-50 font-bold">
              Try Resume Builder ✨
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
