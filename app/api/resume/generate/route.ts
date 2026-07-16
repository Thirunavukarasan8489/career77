import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { name, mobile, email, role, exp, city, edu, skills, work } = body;

    if (!name || !mobile || !role) {
      return NextResponse.json(
        { error: "Name, mobile number, and target role are required fields" },
        { status: 400 }
      );
    }

    const skillList = typeof skills === "string"
      ? skills.split(",").map((s: string) => s.trim()).filter(Boolean)
      : Array.isArray(skills)
      ? skills
      : [];

    const isFresher =
      !exp ||
      exp.toLowerCase() === "fresher" ||
      exp.toLowerCase().includes("fresh");

    // Simulated "AI" professional summary generation
    const summary = `${name} is a dedicated professional targeting a career as a ${role}${
      city ? ` in ${city}` : ""
    }. Demonstrates key technical expertise in ${
      skillList.slice(0, 3).join(", ") || "relevant domains"
    } and holds a strong focus on team collaboration and prompt execution. Highly motivated to learn and add immediate value.`;

    const resumeData = {
      name,
      mobile,
      email: email || "",
      role,
      exp: exp || "Fresher",
      city: city || "",
      edu: edu || "",
      skills: skillList,
      work: work || "",
      summary,
    };

    return NextResponse.json({ success: true, resume: resumeData });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to generate resume" },
      { status: 500 }
    );
  }
}
