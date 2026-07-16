import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/lib/db";
import { Job } from "@/models/Job";
import EditJobForm from "./EditJobForm";
import { notFound, redirect } from "next/navigation";

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/recruiter/login");
  }

  const { jobId } = await params;
  const job = await Job.findById(jobId);
  if (!job) {
    notFound();
  }

  // Ensure owner
  if (job.recruiterId && job.recruiterId.toString() !== (session.user as any).id) {
    redirect("/recruiter");
  }

  const initialData = {
    _id: job._id.toString(),
    title: job.title,
    location: job.location,
    experience: job.experience || "",
    skills: job.skills ? job.skills.join(", ") : "",
    description: job.description || "",
    status: job.status as "open" | "closed",
  };

  return <EditJobForm initialData={initialData} />;
}
