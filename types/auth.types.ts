/**
 * Career77 — Auth & Session Types
 */

export interface UserSession {
  id: string;
  email: string;
  role: 'candidate' | 'recruiter' | 'superadmin';
  name?: string;
  image?: string;
}

export interface CandidateSession {
  candidateId: string;
  role: 'candidate';
}

export interface RegisterCandidateInput {
  name: string;
  email: string;
  password: string;
}

export interface RegisterRecruiterInput {
  email: string;
  password: string;
  companyName: string;
}
