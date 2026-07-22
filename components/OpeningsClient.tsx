"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { showToast } from "@/components/Toast";
import SaveJobButton from "@/components/SaveJobButton";

interface OpeningsClientProps {
  initialJobs: any[];
  savedJobIds?: string[];
}

export default function OpeningsClient({ initialJobs, savedJobIds }: OpeningsClientProps) {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("query") || "";
  const expParam = searchParams.get("experience") || "";
  const locParam = searchParams.get("location") || "";

  const [query, setQuery] = useState(queryParam);
  const [location, setLocation] = useState(locParam);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>(["Full-time"]);
  const [selectedExp, setSelectedExp] = useState<string[]>(expParam ? [expParam] : ["Mid-Level"]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(["React"]);
  const [sortBy, setSortBy] = useState("Newest");

  // Sample mock job list if initial DB count is low to match reference image UI
  const displayJobs = initialJobs.length > 0 ? initialJobs : [
    {
      _id: "job1",
      title: "Senior Frontend Engineer",
      company: "TechFlow Systems",
      location: "San Francisco, CA (Remote)",
      salaryRange: "$140,000 - $180,000",
      employmentType: "Full-time",
      isNew: true,
      postedAgo: "Posted 2 hours ago",
    },
    {
      _id: "job2",
      title: "Product Designer (Design Systems)",
      company: "EcoConsult Global",
      location: "New York, NY",
      salaryRange: "$120,000 - $160,000",
      employmentType: "Full-time",
      isNew: false,
      postedAgo: "Posted 1 day ago",
    },
    {
      _id: "job3",
      title: "Full Stack Developer",
      company: "Prime Ledger",
      location: "Austin, TX",
      salaryRange: "$110,000 - $150,000",
      employmentType: "Contract",
      isNew: false,
      postedAgo: "Posted 3 days ago",
    },
    {
      _id: "job4",
      title: "UX Researcher",
      company: "Avenue Creative",
      location: "Remote",
      salaryRange: "$90,000 - $130,000",
      employmentType: "Full-time",
      isNew: false,
      postedAgo: "Posted 1 week ago",
    },
  ];

  const handleToggleType = (type: string) => {
    setSelectedJobTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleToggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleClearFilters = () => {
    setQuery("");
    setLocation("");
    setSelectedJobTypes([]);
    setSelectedExp([]);
    setSelectedSkills([]);
    showToast("Filters cleared.");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 font-sans antialiased">
      {/* Top Search Bar & Sort Row */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for jobs, skills, or companies..."
              className="w-full bg-white border border-slate-200/80 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-xs"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Sort by</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
            >
              <option value="Newest">Newest</option>
              <option value="Relevant">Most Relevant</option>
              <option value="Salary">Highest Salary</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
          <span>Showing <strong>124</strong> jobs</span>
        </div>
      </div>

      {/* Main Split Grid Layout: Filters Left (~25%) and Job Cards Right (~75%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (3 cols): Filters Sidebar Card */}
        <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="font-bold text-slate-900 text-base">Filters</h3>
            <button
              onClick={handleClearFilters}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Clear All
            </button>
          </div>

          {/* Filter: Location */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">Location</label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City or Remote"
                className="w-full bg-white border border-slate-200/80 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Filter: Job Type */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold text-slate-700">Job Type</label>
            {["Full-time", "Contract", "Part-time"].map((type) => (
              <label key={type} className="flex items-center gap-2.5 text-xs font-medium text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectedJobTypes.includes(type)}
                  onChange={() => handleToggleType(type)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span>{type}</span>
              </label>
            ))}
          </div>

          {/* Filter: Experience Level */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold text-slate-700">Experience Level</label>
            {["Entry Level", "Mid-Level", "Senior"].map((exp) => (
              <label key={exp} className="flex items-center gap-2.5 text-xs font-medium text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectedExp.includes(exp)}
                  onChange={() =>
                    setSelectedExp((prev) =>
                      prev.includes(exp) ? prev.filter((e) => e !== exp) : [...prev, exp]
                    )
                  }
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span>{exp}</span>
              </label>
            ))}
          </div>

          {/* Filter: Salary Range */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">Salary Range</label>
            <select className="w-full bg-white border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="$80k - $120k">$80k - $120k</option>
              <option value="$120k - $160k">$120k - $160k</option>
              <option value="$160k+">$160k+</option>
            </select>
          </div>

          {/* Filter: Skills */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold text-slate-700">Skills</label>
            {["React", "TypeScript", "Node.js", "Python", "Design Systems"].map((skill) => (
              <label key={skill} className="flex items-center gap-2.5 text-xs font-medium text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectedSkills.includes(skill)}
                  onChange={() => handleToggleSkill(skill)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span>{skill}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Right Column (9 cols): Job Postings List */}
        <div className="lg:col-span-9 space-y-4">
          {displayJobs.map((job: any) => (
            <Link
              key={job._id}
              href={`/openings/${job.slug || job._id}`}
              className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group block"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 font-extrabold flex items-center justify-center text-xs shrink-0 border border-blue-100">
                  LOGO
                </div>

                <div className="space-y-2 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors truncate">
                      {job.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-500 font-medium">
                    🏢 {job.company || "TechFlow Systems"} • 📍 {job.location} • 💰 {job.salaryRange || "$140,000 - $180,000"}
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <span className="bg-blue-50 text-blue-700 font-semibold text-xs px-3 py-0.5 rounded-full">
                      {job.employmentType || "Full-time"}
                    </span>
                    {job.isNew && (
                      <span className="bg-emerald-100 text-emerald-800 font-bold text-xs px-2.5 py-0.5 rounded-full">
                        New
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                {savedJobIds ? (
                  <SaveJobButton
                    jobId={job._id}
                    initialSaved={savedJobIds.includes(job._id)}
                  />
                ) : (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      showToast("Please log in as a candidate to save jobs.");
                    }}
                    className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-50 transition-colors"
                    title="Bookmark Job"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                )}
                <span className="text-xs font-medium text-slate-400">{job.postedAgo || "Posted 2 hours ago"}</span>
              </div>
            </Link>
          ))}

          {/* Pagination Controls */}
          <div className="pt-6 flex items-center justify-center gap-1.5">
            <button className="w-8 h-8 rounded-lg border border-slate-200/80 text-slate-400 hover:bg-slate-50 flex items-center justify-center text-xs">
              &lt;
            </button>
            <button className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              1
            </button>
            <button className="w-8 h-8 rounded-lg border border-slate-200/80 text-slate-600 hover:bg-slate-50 font-semibold text-xs flex items-center justify-center">
              2
            </button>
            <button className="w-8 h-8 rounded-lg border border-slate-200/80 text-slate-600 hover:bg-slate-50 font-semibold text-xs flex items-center justify-center">
              3
            </button>
            <span className="text-xs text-slate-400 px-1">...</span>
            <button className="w-8 h-8 rounded-lg border border-slate-200/80 text-slate-600 hover:bg-slate-50 font-semibold text-xs flex items-center justify-center">
              12
            </button>
            <button className="w-8 h-8 rounded-lg border border-slate-200/80 text-slate-600 hover:bg-slate-50 flex items-center justify-center text-xs">
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
