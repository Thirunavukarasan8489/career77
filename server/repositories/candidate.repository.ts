import { Candidate } from "@/models/Candidate";
import { Application } from "@/models/Application";
import { Job } from "@/models/Job";
import { Interview } from "@/models/Interview";
import { Company } from "@/models/Company";
import { connectToDatabase } from "@/lib/db";

export class CandidateRepository {
  async getCandidateByUserId(userId: string) {
    await connectToDatabase();
    return await Candidate.findOne({ userId }).lean();
  }

  async getCandidateById(candidateId: string) {
    await connectToDatabase();
    return await Candidate.findById(candidateId).lean();
  }

  async updateCandidateByUserId(userId: string, updates: any) {
    await connectToDatabase();
    return await Candidate.findOneAndUpdate(
      { userId },
      { $set: updates },
      { new: true }
    );
  }

  async getDashboardStats(candidateId: string) {
    await connectToDatabase();
    void Company; // Prevent tree-shaking of the Company model

    const activeApplications = await Application.countDocuments({ 
      candidateId, 
      status: { $in: ['Applied', 'Shortlisted'] } 
    });
    
    const jobOffers = await Application.countDocuments({ 
      candidateId, 
      status: 'Selected' 
    });
    
    const upcomingInterviews = await Interview.countDocuments({ 
      candidateId, 
      status: 'scheduled' 
    });

    const recommendedJobs = await Job.find({ status: 'open' })
      .sort({ createdAt: -1 })
      .limit(3)
      .populate('companyId')
      .lean();
      
    const recentApplications = await Application.find({ candidateId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate({ path: 'jobId', populate: { path: 'companyId' } })
      .lean();

    return {
      activeApplications,
      jobOffers,
      upcomingInterviews,
      recommendedJobs,
      recentApplications,
    };
  }
}
