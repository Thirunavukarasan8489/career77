/**
 * Career77 — Application Domain Types
 */

export type ApplicationStatus =
  | 'Applied'
  | 'Shortlisted'
  | 'Interview'
  | 'Selected'
  | 'Rejected';

export interface Application {
  _id: string;
  candidateId: string;
  jobId: string;
  status: ApplicationStatus;
  appliedAt?: string;
  updatedAt?: string;
}
