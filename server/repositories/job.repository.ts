import { Job } from "@/models/Job";
import { connectToDatabase } from "@/lib/db";

export class JobRepository {
  async getJobs(matchQuery: any, limit: number, cursor?: string) {
    await connectToDatabase();
    
    if (cursor) {
      matchQuery._id = { $lt: cursor };
    }

    const jobs = await Job.find(matchQuery)
      .sort({ _id: -1 })
      .limit(limit + 1);
      
    return jobs;
  }

  async createJob(jobData: any) {
    await connectToDatabase();
    return await Job.create(jobData);
  }
}
