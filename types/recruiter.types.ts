/**
 * Career77 — Recruiter Domain Types
 */

export type RecruiterStatus = 'pending' | 'approved' | 'rejected';

export interface Recruiter {
  _id: string;
  userId: string;
  email: string;
  companyName: string;
  status: RecruiterStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface RecruiterStats {
  activeJobs: number;
  totalApplications: number;
  shortlistedCandidates: number;
  scheduledInterviews: number;
}
