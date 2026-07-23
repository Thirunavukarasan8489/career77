/**
 * Career77 — Candidate Domain Types
 */

export interface Resume {
  _id?: string;
  url: string;
  publicId: string;
  filename: string;
  isPrimary: boolean;
  uploadedAt?: string;
}

export interface Candidate {
  _id: string;
  userId: string;
  name: string;
  email: string;
  mobile?: string;
  location?: string;
  bio?: string;
  skills: string[];
  resumes: Resume[];
  savedJobs: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateCandidateInput {
  name?: string;
  mobile?: string;
  location?: string;
  bio?: string;
  skills?: string[];
}

export interface DashboardStats {
  activeApplications: number;
  jobOffers: number;
  upcomingInterviews: number;
}

export interface CandidateDashboard {
  stats: DashboardStats;
  recommendedJobs: any[];
  recentApplications: any[];
  profileStrength: number;
}
