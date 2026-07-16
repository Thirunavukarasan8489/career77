import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { Recruiter } from "../models/Recruiter";
import { Job } from "../models/Job";
import { Candidate } from "../models/Candidate";
import { Application } from "../models/Application";
import { Notification } from "../models/Notification";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI environment variable is missing.");
  process.exit(1);
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

async function seed() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI!);

  console.log("Clearing existing database collections...");
  await Recruiter.deleteMany({});
  await Job.deleteMany({});
  await Candidate.deleteMany({});
  await Application.deleteMany({});
  await Notification.deleteMany({});

  console.log("Creating default recruiter...");
  const hashedPassword = await bcrypt.hash("password123", 10);
  const recruiter = await Recruiter.create({
    email: "recruiter@company.com",
    password: hashedPassword,
    companyName: "TechCorp",
  });
  console.log(`Recruiter created: ${recruiter.email}`);

  console.log("Creating default jobs...");
  const jobData = [
    {
      title: "Frontend Developer",
      location: "Jaipur",
      experience: "1-3 years",
      skills: ["React", "JavaScript", "CSS"],
      description: "Build and maintain user-facing features for our web platform. Work closely with design and backend teams to implement modern interfaces.",
      status: "open" as const,
      recruiterId: recruiter._id,
    },
    {
      title: "Backend Engineer",
      location: "Remote",
      experience: "2-5 years",
      skills: ["Node.js", "PostgreSQL", "AWS"],
      description: "Design, build, and scale APIs and backend services powering our core products. Experience with relational databases and microservices required.",
      status: "open" as const,
      recruiterId: recruiter._id,
    },
    {
      title: "Business Development Executive",
      location: "Delhi NCR",
      experience: "0-2 years",
      skills: ["Sales", "Communication"],
      description: "Drive new client acquisition, outbound pitching, and manage partner relationships across the northern region.",
      status: "open" as const,
      recruiterId: recruiter._id,
    },
  ];

  const jobs = [];
  for (const item of jobData) {
    const job = await Job.create({
      ...item,
      slug: `${slugify(item.title)}-${Math.random().toString(36).substring(2, 7)}`,
    });
    jobs.push(job);
    console.log(`Job created: ${job.title} (${job.slug})`);
  }

  console.log("Creating sample candidates...");
  const candidateData = [
    {
      name: "Rahul Sharma",
      mobile: "9876543210",
      email: "rahul@gmail.com",
      experience: "2 years",
      city: "Jaipur",
      skills: ["React", "JavaScript", "HTML", "CSS"],
      lookingFor: "Frontend Developer",
      resumeUrl: "https://res.cloudinary.com/demo/image/upload/v1700000000/sample.pdf",
      resumePublicId: "sample",
    },
    {
      name: "Pooja Patel",
      mobile: "8765432109",
      email: "pooja@gmail.com",
      experience: "Fresher",
      city: "Remote",
      skills: ["Node.js", "Express", "MongoDB", "JavaScript"],
      lookingFor: "Backend Engineer",
      resumeUrl: "https://res.cloudinary.com/demo/image/upload/v1700000000/sample.pdf",
      resumePublicId: "sample",
    },
  ];

  for (const item of candidateData) {
    const candidate = await Candidate.create(item);
    console.log(`Candidate created: ${candidate.name} (${candidate.mobile})`);
  }

  console.log("Database seeded successfully!");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
