import { CandidateRepository } from "@/server/repositories/candidate.repository";

const candidateRepository = new CandidateRepository();

export class CandidateService {
  async getProfile(userId: string) {
    const candidate = await candidateRepository.getCandidateByUserId(userId);
    if (!candidate) {
      throw new Error("Candidate profile not found");
    }
    return candidate;
  }

  async updateProfile(userId: string, updates: any) {
    const candidate = await candidateRepository.updateCandidateByUserId(userId, updates);
    if (!candidate) {
      throw new Error("Candidate profile not found");
    }
    return candidate;
  }

  async getDashboard(candidateIdStr: string, isNextAuthUserId: boolean) {
    let candidate;
    
    if (isNextAuthUserId) {
      candidate = await candidateRepository.getCandidateByUserId(candidateIdStr);
    } else {
      candidate = await candidateRepository.getCandidateById(candidateIdStr);
    }

    if (!candidate) {
      throw new Error("Candidate not found");
    }

    const candidateId = candidate._id.toString();
    const stats = await candidateRepository.getDashboardStats(candidateId);

    const profileStrength = candidate.skills && candidate.skills.length > 0 ? 80 : 40;

    return {
      stats: {
        activeApplications: stats.activeApplications,
        jobOffers: stats.jobOffers,
        upcomingInterviews: stats.upcomingInterviews,
      },
      recommendedJobs: stats.recommendedJobs,
      recentApplications: stats.recentApplications,
      profileStrength,
    };
  }
}
