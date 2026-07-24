/**
 * Career77 — App-level configuration constants
 * 
 * All configurable limits and platform constants live here.
 * Never hardcode these values in individual components or API routes.
 */

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 50;

// File upload limits
export const MAX_RESUME_COUNT = 3;
export const MAX_SAVED_JOBS = 50;
export const MAX_FILE_SIZE_MB = 5;

// Search
export const SEARCH_DEBOUNCE_MS = 300;

// Platform
export const PLATFORM_NAME = 'Career77';
export const PLATFORM_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://career77.com';

// Recruiter statuses
export const RECRUITER_STATUSES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

// Application statuses
export const APPLICATION_STATUSES = {
  APPLIED: 'Applied',
  SHORTLISTED: 'Shortlisted',
  INTERVIEW: 'Interview',
  SELECTED: 'Selected',
  REJECTED: 'Rejected',
} as const;

// Support ticket statuses
export const SUPPORT_STATUSES = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
} as const;
