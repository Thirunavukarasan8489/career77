import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Company } from "@/models/Company";
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
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const body = await request.json();
    const { name, website, location, industry, about, logoUrl } = body;

    const slug = (name || "company")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "");

    const company = await Company.findOneAndUpdate(
      { slug },
      { name, slug, website, location, industry, about, logoUrl },
      { upsert: true, new: true }
    );

    return NextResponse.json({ company });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save company" }, { status: 500 });
  }
}
