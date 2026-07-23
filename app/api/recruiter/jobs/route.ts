import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { JobService } from "@/server/services/job.service";

const jobService = new JobService();

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as any).role;
    if (role !== "recruiter" && role !== "superadmin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const host = new URL(request.url).host;
    const recruiterId = (session.user as any).id;
    
    const job = await jobService.createJob(body, recruiterId, host);

    // Revalidate cache
    revalidatePath("/jobs");
    revalidatePath("/");

    return NextResponse.json({ success: true, job });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create job" },
      { status: error.message.includes("required") ? 400 : 500 }
    );
  }
}
