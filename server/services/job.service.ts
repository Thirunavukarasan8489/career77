import { JobRepository } from "@/server/repositories/job.repository";
import { Candidate } from "@/models/Candidate";
import { Notification } from "@/models/Notification";
import { isMatch } from "@/lib/matching";

const jobRepository = new JobRepository();

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

export class JobService {
  async searchJobs(searchQuery: string, location: string, experience: string, limit: number, cursor?: string) {
    const matchQuery: any = { status: "open" };

    if (location) {
      matchQuery.location = { $regex: new RegExp(location, "i") };
    }

    if (searchQuery) {
      matchQuery.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { skills: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    if (experience) {
      if (experience.toLowerCase() === "fresher") {
        matchQuery.experience = { $regex: /(fresher|0-1|0-2|0\s*-\s*1|0\s*-\s*2|not specified)/i };
      } else {
        matchQuery.experience = { $regex: new RegExp(experience, "i") };
      }
    }

    const jobs = await jobRepository.getJobs(matchQuery, limit, cursor);
    
    const hasNextPage = jobs.length > limit;
    const results = hasNextPage ? jobs.slice(0, limit) : jobs;
    const nextCursor = hasNextPage ? results[results.length - 1]._id.toString() : null;

    return { jobs: results, nextCursor };
  }

  async createJob(data: any, recruiterId: string, host: string) {
    const { title, location, experience, skills, description } = data;

    if (!title || !location) {
      throw new Error("Title and location are required fields");
    }

    const skillsArray = Array.isArray(skills)
      ? skills
      : typeof skills === "string"
      ? skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    const slug = `${slugify(title)}-${Math.random().toString(36).substring(2, 7)}`;

    const job = await jobRepository.createJob({
      title,
      slug,
      location,
      experience,
      skills: skillsArray,
      description,
      status: "open",
      recruiterId,
    });

    // 1. Auto-match notifications
    // Note: Ideally, Candidate logic should be in a CandidateService.
    const candidates = await Candidate.find({});
    for (const cand of candidates) {
      if (isMatch(cand, job)) {
        await Notification.create({
          candidateId: cand._id,
          message: `New match: "${job.title}" in ${job.location} matches your preferences.`,
        });
      }
    }

    // 2. IndexNow ping
    try {
      const jobUrl = `https://${host}/openings/${slug}-${job._id}`;
      console.log(`[IndexNow] Simulating search engine ping for new job: ${jobUrl}`);
    } catch (e) {
      console.error("[IndexNow] Failed to log IndexNow ping:", e);
    }

    return job;
  }
}
