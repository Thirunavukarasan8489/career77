import { IJob } from "../models/Job";
import { ICandidate } from "../models/Candidate";

/**
 * Evaluates whether a candidate matches a job posting.
 * Uses a tokenized overlap of the candidate's 'lookingFor' field
 * and the job 'title', plus intersection of skills.
 */
export function isMatch(candidate: ICandidate, job: IJob): boolean {
  if (!candidate.lookingFor) return false;

  // Clean tokens from target role (excluding short filler words)
  const roleTokens = candidate.lookingFor
    .toLowerCase()
    .split(/[\s,/-]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 2);

  const jobTitleLower = job.title.toLowerCase();

  // 1. Check title keyword matches
  const matchesRole = roleTokens.some((token) => jobTitleLower.includes(token));
  if (matchesRole) return true;

  // 2. Check skill intersections
  if (job.skills && job.skills.length > 0 && candidate.skills && candidate.skills.length > 0) {
    const candSkillsLower = candidate.skills.map((s) => s.toLowerCase());
    const overlaps = job.skills.some((s) => candSkillsLower.includes(s.toLowerCase()));
    if (overlaps) return true;
  }

  return false;
}
