import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Company } from "@/models/Company";
import { Recruiter } from "@/models/Recruiter";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const companies = await Company.find({})
      .sort({ name: 1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ companies });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch companies" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as any).role;
    if (role !== "recruiter" && role !== "superadmin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectToDatabase();
    const body = await request.json();
    const { name, website, location, industry, about, logoUrl } = body;

    const slug = (name || "company")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "");

    if (role === "recruiter") {
      const recruiterDoc = await Recruiter.findOne({ userId: (session.user as any).id });
      if (recruiterDoc && recruiterDoc.companyId) {
        const existingCompany = await Company.findById(recruiterDoc.companyId);
        if (existingCompany) {
          const company = await Company.findByIdAndUpdate(
            recruiterDoc.companyId,
            { name, website, location, industry, about, logoUrl },
            { new: true }
          );
          return NextResponse.json({ company });
        }
      }
    }

    const company = await Company.findOneAndUpdate(
      { slug },
      { name, slug, website, location, industry, about, logoUrl },
      { upsert: true, new: true }
    );

    if (role === "recruiter") {
      await Recruiter.findOneAndUpdate(
        { userId: (session.user as any).id },
        { companyId: company._id }
      );
    }

    return NextResponse.json({ company });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save company" }, { status: 500 });
  }
}
