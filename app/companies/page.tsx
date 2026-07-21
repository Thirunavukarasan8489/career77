import Link from "next/link";
import { connectToDatabase } from "@/lib/db";
import { Company } from "@/models/Company";

export const revalidate = 60;

export default async function CompaniesDirectoryPage() {
  await connectToDatabase();
  const rawCompanies = await Company.find().limit(12).lean();
  const companies = JSON.parse(JSON.stringify(rawCompanies));

  const sampleCompanies = companies.length > 0 ? companies : [
    {
      _id: "comp1",
      slug: "stellar-dynamics",
      name: "Stellar Dynamics",
      industry: "Enterprise Software",
      location: "San Francisco, CA",
      website: "stellardynamics.tech",
      employees: "2,500+",
      openRoles: 42,
      rating: "4.8 ⭐",
    },
    {
      _id: "comp2",
      slug: "techflow-systems",
      name: "TechFlow Systems",
      industry: "Financial Technology",
      location: "New York, NY",
      website: "techflow.io",
      employees: "1,200+",
      openRoles: 18,
      rating: "4.7 ⭐",
    },
    {
      _id: "comp3",
      slug: "ecoconsult-global",
      name: "EcoConsult Global",
      industry: "Green Technology",
      location: "Austin, TX",
      website: "ecoconsult.com",
      employees: "800+",
      openRoles: 12,
      rating: "4.9 ⭐",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8 font-sans antialiased">
      <div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
          Top Hiring Companies
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          Explore world-class employers hiring exceptional talent on Career77.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sampleCompanies.map((comp: any) => (
          <Link
            key={comp._id}
            href={`/companies/${comp.slug}`}
            className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between space-y-6 group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 font-extrabold flex items-center justify-center text-sm border border-blue-100">
                  {comp.name.charAt(0).toUpperCase()}
                </div>
                <span className="bg-emerald-100 text-emerald-800 font-bold text-xs px-2.5 py-0.5 rounded-full">
                  {comp.industry}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">
                  {comp.name}
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">📍 {comp.location}</p>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Employees</span>
                  <span className="text-xs font-bold text-slate-800">{comp.employees || "1,000+"}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Open Roles</span>
                  <span className="text-xs font-bold text-blue-600">{comp.openRoles || 24}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Rating</span>
                  <span className="text-xs font-bold text-slate-800">{comp.rating || "4.8 ⭐"}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 text-xs font-bold text-blue-600 group-hover:underline flex items-center justify-between">
              <span>View Company Profile</span>
              <span>&rarr;</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
