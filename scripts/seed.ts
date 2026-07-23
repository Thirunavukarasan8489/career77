import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { Company } from "../models/Company";
import { Recruiter } from "../models/Recruiter";
import { Candidate } from "../models/Candidate";
import { Job } from "../models/Job";
import { Application } from "../models/Application";
import { PipelineStage } from "../models/PipelineStage";
import { Interview } from "../models/Interview";
import { VerificationRequest } from "../models/VerificationRequest";
import { CmsContent } from "../models/CmsContent";
import { Subscription } from "../models/Subscription";
import { Invoice } from "../models/Invoice";
import { SupportTicket } from "../models/SupportTicket";
import { Notification } from "../models/Notification";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://thirugopi733_db_user:RYy9xP7TsOM5YMVN@cluster0.u8qrocd.mongodb.net/career77";

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

async function seed() {
  console.log("Connecting to MongoDB for 3-Role Platform Seeding...");
  await mongoose.connect(MONGODB_URI);

  console.log("Clearing existing database collections...");
  await Promise.all([
    User.deleteMany({}),
    Company.deleteMany({}),
    Recruiter.deleteMany({}),
    Candidate.deleteMany({}),
    Job.deleteMany({}),
    Application.deleteMany({}),
    PipelineStage.deleteMany({}),
    Interview.deleteMany({}),
    VerificationRequest.deleteMany({}),
    CmsContent.deleteMany({}),
    Subscription.deleteMany({}),
    Invoice.deleteMany({}),
    SupportTicket.deleteMany({}),
    Notification.deleteMany({}),
  ]);

  // 1. Create Users for all 3 roles
  const superadminPass = await bcrypt.hash("admin123", 10);
  const recruiterPass = await bcrypt.hash("password123", 10);
  const candidatePass = await bcrypt.hash("password123", 10);

  const _adminUser = await User.create({
    email: "admin@career77.com",
    password: superadminPass,
    role: "superadmin",
  });

  const recruiterUser = await User.create({
    email: "recruiter@company.com",
    password: recruiterPass,
    role: "recruiter",
  });

  const candidateUser = await User.create({
    email: "candidate@example.com",
    password: candidatePass,
    role: "candidate",
  });

  console.log("Seeded auth users for candidate, recruiter, superadmin.");

  // 2. Create Companies
  const techCorp = await Company.create({
    name: "TechCorp Global",
    slug: "techcorp-global",
    logoUrl:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
    about: "Leading enterprise software solutions & cloud platform provider.",
    website: "https://techcorp.example.com",
    location: "Bengaluru, India",
    industry: "Enterprise Software",
    verified: true,
  });

  const acmeInc = await Company.create({
    name: "Acme Innovations",
    slug: "acme-innovations",
    logoUrl:
      "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&auto=format&fit=crop&q=80",
    about: "Next-gen Artificial Intelligence and fintech product studio.",
    website: "https://acme.example.com",
    location: "Jaipur, India",
    industry: "AI & Fintech",
    verified: false,
  });

  // 3. Create Recruiter profile
  const recruiterDoc = await Recruiter.create({
    userId: recruiterUser._id,
    companyId: techCorp._id,
    name: "John Doe",
    email: recruiterUser.email,
    companyName: techCorp.name,
    designation: "Talent Acquisition Lead",
  });

  // 4. Create Candidate profile
  const candidateDoc = await Candidate.create({
    userId: candidateUser._id,
    name: "Rahul Sharma",
    email: candidateUser.email,
    experience: "1-3 years",
    city: "Jaipur",
    skills: ["React", "TypeScript", "Node.js", "Tailwind CSS"],
    lookingFor: "Full Stack Engineer",
    bio: "Passionate web developer with experience building scalable React applications.",
  });

  // 5. Create Pipeline Stages
  const stages = [
    { companyId: techCorp._id, name: "Applied", order: 1 },
    { companyId: techCorp._id, name: "Shortlisted", order: 2 },
    { companyId: techCorp._id, name: "Interview", order: 3 },
    { companyId: techCorp._id, name: "Offer", order: 4 },
  ];
  await PipelineStage.insertMany(stages);

  // 6. Create Jobs
  const jobData = [
    {
      title: "Senior Full Stack Engineer",
      companyId: techCorp._id,
      recruiterId: recruiterDoc._id,
      location: "Bengaluru / Remote",
      experience: "3-5 years",
      skills: ["React", "Next.js", "Node.js", "MongoDB"],
      description:
        "Design and implement full stack features for our flagship enterprise ATS application.",
      salaryRange: "₹18,00,000 - ₹24,00,000 PA",
      employmentType: "Full-time",
      status: "open" as const,
    },
    {
      title: "Frontend Developer (React)",
      companyId: techCorp._id,
      recruiterId: recruiterDoc._id,
      location: "Jaipur",
      experience: "1-3 years",
      skills: ["React", "JavaScript", "Tailwind CSS"],
      description:
        "Build clean, accessible user interface screens and component libraries.",
      salaryRange: "₹8,00,000 - ₹12,00,000 PA",
      employmentType: "Full-time",
      status: "open" as const,
    },
    {
      title: "AI Product Designer",
      companyId: acmeInc._id,
      recruiterId: recruiterDoc._id,
      location: "Remote",
      experience: "2-4 years",
      skills: ["Figma", "UI/UX", "Design Systems"],
      description:
        "Create sleek user interfaces and interactive prototypes for next-generation web tools.",
      salaryRange: "₹12,00,000 - ₹16,00,000 PA",
      employmentType: "Full-time",
      status: "open" as const,
    },
  ];

  const createdJobs = [];
  for (const item of jobData) {
    const job = await Job.create({
      ...item,
      slug: `${slugify(item.title)}-${Math.random().toString(36).substring(2, 7)}`,
    });
    createdJobs.push(job);
  }

  // 7. Create Application
  const application = await Application.create({
    jobId: createdJobs[0]._id,
    candidateId: candidateDoc._id,
    status: "Shortlisted",
    appliedAt: new Date(),
    notes: "Strong candidate with Next.js experience",
  });

  // 8. Create Interview
  await Interview.create({
    applicationId: application._id,
    candidateId: candidateDoc._id,
    recruiterId: recruiterDoc._id,
    jobId: createdJobs[0]._id,
    scheduledAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // In 2 days
    mode: "video",
    link: "https://meet.google.com/abc-defg-hij",
    status: "scheduled",
  });

  // 9. Verification Request for Acme Innovations
  await VerificationRequest.create({
    companyId: acmeInc._id,
    documentUrl:
      "https://res.cloudinary.com/demo/image/upload/v1700000000/sample_gstin.pdf",
    status: "pending",
  });

  // 10. CMS Content
  await CmsContent.create({
    key: "landing-hero",
    content: {
      title: "Find & Hire Top Talent Faster",
      subtitle:
        "Career77 connects verified job seekers with top recruiters nationwide.",
      announcement: "⚡ Over 1,000+ Verified Jobs & AI Matches Active!",
    },
  });

  // 11. Subscription & Invoice
  await Subscription.create({
    companyId: techCorp._id,
    plan: "Starter",
    status: "active",
    amount: 4999,
  });

  await Invoice.create({
    companyId: techCorp._id,
    invoiceNumber: `INV-${Date.now()}`,
    amount: 4999,
    status: "paid",
  });

  // 12. Support Ticket
  await SupportTicket.create({
    raisedBy: candidateUser._id,
    userRole: "candidate",
    subject: "Resume PDF Upload Assistance",
    message: "How do I update my resume file on my candidate profile?",
    status: "open",
  });

  console.log("Database successfully seeded for Career77 3-Role Platform!");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seeding error:", err);
  process.exit(1);
});
