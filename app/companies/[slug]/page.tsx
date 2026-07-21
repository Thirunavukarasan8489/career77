import { notFound } from "next/navigation";
import Link from "next/link";
import { connectToDatabase } from "@/lib/db";
import { Company } from "@/models/Company";
import { Job } from "@/models/Job";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

async function getCompany(slug: string) {
  await connectToDatabase();
  try {
    const company = await Company.findOne({ slug: slug.toLowerCase() }).lean();
    return company ? JSON.parse(JSON.stringify(company)) : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const company = await getCompany(slug);

  if (!company) {
    return { title: "Company Not Found | Career77" };
  }

  return {
    title: `${company.name} Careers & Openings | Career77`,
    description: company.about
      ? company.about.substring(0, 160)
      : `Explore job opportunities and open career positions at ${company.name} on Career77.`,
  };
}

export default async function CompanyProfilePage({ params }: Props) {
  const { slug } = await params;
  const company = await getCompany(slug);

  if (!company) {
    notFound();
  }

  await connectToDatabase();
  const companyJobsRaw = await Job.find({ companyId: company._id, status: "open" })
    .sort({ postedAt: -1 })
    .lean();
  const companyJobs = JSON.parse(JSON.stringify(companyJobsRaw));

  const companyName = company.name || "Stellar Dynamics";
  const industry = company.industry || "Enterprise Software";
  const website = company.website || "stellardynamics.tech";
  const location = company.location || "San Francisco, CA";

  const sampleOpenRoles = companyJobs.length > 0 ? companyJobs : [
    {
      _id: "role1",
      title: "Senior Backend Engineer",
      dept: "Core Infrastructure • Distributed Systems",
      salary: "$150k - $220k",
      postedAgo: "2d ago",
      type: "Full-time",
    },
    {
      _id: "role2",
      title: "Staff Product Designer",
      dept: "Platform Design • UX Strategy",
      salary: "$150k - $200k",
      postedAgo: "4d ago",
      type: "Remote",
    },
    {
      _id: "role3",
      title: "Marketing Analyst",
      dept: "Growth Team • Data Science",
      salary: "$110k - $145k",
      postedAgo: "1w ago",
      type: "Full-time",
    },
    {
      _id: "role4",
      title: "Security Compliance Lead",
      dept: "Risk Mgmt • ISO/SOC2",
      salary: "$180k - $240k",
      postedAgo: "3d ago",
      type: "Contract",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 font-sans antialiased">
      {/* Top Panoramic Hero Cover */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
        <div className="h-56 sm:h-72 w-full relative overflow-hidden bg-slate-900">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&auto=format&fit=crop&q=80"
            alt="Company Campus"
            className="w-full h-full object-cover opacity-90"
          />
        </div>

        {/* Company Info Banner Header */}
        <div className="p-6 sm:p-8 pt-0 relative flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="flex items-end gap-5 -mt-12 sm:-mt-14">
            {/* Logo Box */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white border-2 border-white p-2 shadow-lg shrink-0 flex items-center justify-center">
              {company.logoUrl ? (
                <img src={company.logoUrl} alt={companyName} className="w-full h-full object-contain rounded-xl" />
              ) : (
                <div className="w-full h-full rounded-xl bg-blue-50 text-blue-600 font-extrabold flex items-center justify-center text-xl">
                  {companyName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Title & Info */}
            <div className="space-y-1 pt-2 min-w-0">
              <div className="flex items-center gap-2.5">
                <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                  {companyName}
                </h1>
                <span className="bg-emerald-100 text-emerald-800 font-bold text-xs px-3 py-0.5 rounded-full whitespace-nowrap">
                  {industry}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-500 font-medium">
                <a href={`https://${website.replace("https://", "")}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                  🌐 {website.replace("https://", "")}
                </a>
                <span>•</span>
                <span>📍 {location}</span>
              </div>
            </div>
          </div>

          {/* Follow Button */}
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto whitespace-nowrap">
            Follow Company
          </button>
        </div>
      </div>

      {/* Top 4 Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs text-left">
          <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">EMPLOYEES</span>
          <p className="text-2xl font-extrabold text-blue-600 tracking-tight mt-1">2,500+</p>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs text-left">
          <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">FOUNDED</span>
          <p className="text-2xl font-extrabold text-blue-600 tracking-tight mt-1">2012</p>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs text-left">
          <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">OPEN ROLES</span>
          <p className="text-2xl font-extrabold text-blue-600 tracking-tight mt-1">
            {companyJobs.length > 0 ? companyJobs.length : 42}
          </p>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs text-left">
          <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">RATING</span>
          <p className="text-2xl font-extrabold text-blue-600 tracking-tight mt-1">4.8 ⭐</p>
        </div>
      </div>

      {/* Main Split Grid Layout: Left About (~35%) and Right Open Roles (~65%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (5 cols): About & Culture Cards */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card 1: About the Company */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5">
            <h2 className="font-bold text-slate-900 text-lg tracking-tight">About the Company</h2>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              {company.about ||
                "Stellar Dynamics is a global leader in cloud infrastructure and enterprise-scale data management. We empower the world's most ambitious organizations to harness their data through intelligent automation and secure, scalable architecture. Founded in 2012 by a team of ex-NASA engineers, we maintain a culture of rigorous scientific inquiry coupled with rapid commercial iteration."}
            </p>

            <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Ownership</span>
                <span className="font-bold text-slate-900">Public (NASD: STLR)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Funding</span>
                <span className="font-bold text-slate-900">Series E ($450M)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Work Model</span>
                <span className="font-bold text-slate-900">Remote-First</span>
              </div>
            </div>
          </div>

          {/* Card 2: Our Culture */}
          <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
            <div className="relative h-48 bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80"
                alt="Our Culture"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent p-5 flex flex-col justify-end">
                <h3 className="font-bold text-white text-base">Our Culture</h3>
                <p className="text-xs text-slate-200 font-normal mt-0.5">Innovation through radical transparency.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Currently Open Roles */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-xl tracking-tight">
              Currently Open Roles ({sampleOpenRoles.length})
            </h2>
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white border border-slate-200">
                🔍
              </button>
            </div>
          </div>

          {/* 2x2 Grid of Job Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {sampleOpenRoles.map((role: any) => (
              <div
                key={role._id}
                className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                      💻
                    </div>
                    <span className="bg-slate-100 text-slate-600 font-semibold text-[11px] px-2.5 py-0.5 rounded-full">
                      {role.type || role.employmentType || "Full-time"}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{role.title}</h3>
                    <p className="text-xs text-slate-400 font-normal mt-0.5">{role.dept || role.location}</p>
                  </div>

                  <div className="text-xs font-semibold text-slate-600">
                    💰 {role.salary || role.salaryRange || "$150k - $220k"} • 🕒 {role.postedAgo || "2d ago"}
                  </div>
                </div>

                <Link
                  href={`/openings/${role.slug || role._id}`}
                  className="w-full border border-blue-200 hover:bg-blue-50 text-blue-600 font-bold text-xs py-2.5 rounded-xl transition-all text-center block"
                >
                  Apply Now
                </Link>
              </div>
            ))}
          </div>

          {/* View All Positions Link */}
          <div className="text-center pt-4">
            <Link href="/openings" className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1">
              <span>View all positions</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
