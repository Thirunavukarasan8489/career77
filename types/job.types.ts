/**
 * Career77 — Job Domain Types
 */

export type JobStatus = 'open' | 'closed' | 'draft';

export interface Job {
  _id: string;
  title: string;
  slug: string;
  location: string;
  experience?: string;
  skills: string[];
  description?: string;
  status: JobStatus;
  recruiterId: string;
  companyId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface JobSearchParams {
  query?: string;
  location?: string;
  experience?: string;
  cursor?: string;
  limit?: number;
}

export interface JobSearchResult {
  jobs: Job[];
  nextCursor: string | null;
}

export interface CreateJobInput {
  title: string;
  location: string;
  experience?: string;
  skills?: string | string[];
  description?: string;
}
