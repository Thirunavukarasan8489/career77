"use client";

import { useState, useEffect } from "react";
import { showToast } from "@/components/common/Toast";

interface KanbanCard {
  id: string;
  name: string;
  role: string;
  avatar: string;
  tags?: string[];
  badge?: string;
  stageBadge?: string;
  interviewers?: string;
  highlight?: string;
  hasAttachment?: boolean;
  timeAgo: string;
}

interface KanbanColumn {
  id: string;
  title: string;
  dotColor: string;
  bgTint: string;
  count: number;
  cards: KanbanCard[];
}

export default function RecruiterPipelinePage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch("/api/applications");
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications || []);
      }
    } catch {
      // Fallback handles UI smoothly
    } finally {
      setLoading(false);
    }
  };

  const updateStage = async (appId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/applications/${appId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        showToast(`Candidate moved to ${newStatus}`);
        setApplications((prev) =>
          prev.map((app) => (app._id === appId ? { ...app, status: newStatus } : app))
        );
      }
    } catch {
      showToast("Failed to move candidate.");
    }
  };

  // Preset sample Kanban board cards matching Image 3 UI design
  const kanbanColumns: KanbanColumn[] = [
    {
      id: "APPLIED",
      title: "APPLIED",
      dotColor: "bg-blue-500",
      bgTint: "bg-blue-50/40 border-blue-100",
      count: 12,
      cards: [
        {
          id: "card1",
          name: "Alex Rivera",
          role: "Senior Designer",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
          tags: ["Figma", "React"],
          timeAgo: "2h ago",
        },
        {
          id: "card2",
          name: "Sarah Chen",
          role: "Lead Designer",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
          tags: ["Design Ops"],
          badge: "TOP MATCH",
          timeAgo: "5h ago",
        },
      ],
    },
    {
      id: "SCREENING",
      title: "SCREENING",
      dotColor: "bg-amber-500",
      bgTint: "bg-blue-50/40 border-blue-100",
      count: 4,
      cards: [
        {
          id: "card3",
          name: "Marcus Thorne",
          role: "Product Architect",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
          highlight: "Interview scheduled for tomorrow",
          hasAttachment: true,
          timeAgo: "1d ago",
        },
      ],
    },
    {
      id: "INTERVIEW",
      title: "INTERVIEW",
      dotColor: "bg-emerald-500",
      bgTint: "bg-blue-50/40 border-blue-100",
      count: 2,
      cards: [
        {
          id: "card4",
          name: "Elena Gilbert",
          role: "UX Director",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
          stageBadge: "STAGE 3/4",
          interviewers: "JD AM",
          badge: "GOOD VIBE",
          timeAgo: "3d ago",
        },
      ],
    },
    {
      id: "OFFER",
      title: "OFFER",
      dotColor: "bg-purple-500",
      bgTint: "bg-blue-50/40 border-blue-100",
      count: 1,
      cards: [
        {
          id: "card5",
          name: "Jennifer Lopez",
          role: "Marketing Lead",
          avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
          stageBadge: "OFFER SENT",
          timeAgo: "1d ago",
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Hiring Pipeline</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage your active candidate journey for Senior Product Designer
          </p>
        </div> */}

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => showToast("Filter pipeline by role or stage")}
            className="bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl border border-slate-200/80 inline-flex items-center gap-2 shadow-xs transition-colors"
          >
            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>Filter</span>
          </button>

          <button
            onClick={() => showToast("Opening add candidate form...")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Candidate</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
        {kanbanColumns.map((col) => (
          <div
            key={col.id}
            className={`bg-blue-50/30 border border-slate-200/60 rounded-2xl p-4 flex flex-col gap-4 min-h-[550px] shadow-xs`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${col.dotColor}`} />
                <h2 className="font-bold text-xs text-slate-800 uppercase tracking-wider">{col.title}</h2>
                <span className="bg-slate-200/70 text-slate-700 font-bold text-[11px] px-2 py-0.5 rounded-full leading-none">
                  {col.count}
                </span>
              </div>
              <button
                onClick={() => showToast(`Column options for ${col.title}`)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </button>
            </div>

            {/* Candidate Cards List */}
            <div className="space-y-3 flex-1 overflow-y-auto">
              {col.cards.map((card: KanbanCard) => (
                <div
                  key={card.id}
                  onClick={() => showToast(`Selected candidate: ${card.name}`)}
                  className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs hover:shadow-md transition-all space-y-3 cursor-pointer group"
                >
                  {/* Candidate Header */}
                  <div className="flex items-center gap-3">
                    <img
                      src={card.avatar}
                      alt={card.name}
                      className="w-9 h-9 rounded-full object-cover shrink-0 ring-2 ring-white shadow-xs"
                    />
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-900 text-sm truncate group-hover:text-blue-600 transition-colors">
                        {card.name}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium truncate mt-0.5">{card.role}</p>
                    </div>
                  </div>

                  {/* Highlight Banner (if screening) */}
                  {card.highlight && (
                    <div className="bg-amber-50/80 border border-amber-200/60 rounded-lg p-2 text-[11px] font-semibold text-amber-800 text-center">
                      {card.highlight}
                    </div>
                  )}

                  {/* Skill Tags / Badges */}
                  {card.tags && card.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {card.tags.map((tag: string, idx: number) => (
                        <span
                          key={idx}
                          className="bg-slate-100 text-slate-600 font-medium text-[11px] px-2 py-0.5 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Stage Badge & Interviewer initials */}
                  {(card.stageBadge || card.interviewers) && (
                    <div className="flex items-center gap-2 pt-1">
                      {card.stageBadge && (
                        <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded-md">
                          {card.stageBadge}
                        </span>
                      )}
                      {card.interviewers && (
                        <span className="text-slate-400 font-bold text-[10px] tracking-wider">
                          {card.interviewers}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Footer Row (Special Badge + Time) */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                    <div className="flex items-center gap-1">
                      {card.badge === "TOP MATCH" && (
                        <span className="text-blue-600 font-bold text-[10px] flex items-center gap-1">
                          ✓ TOP MATCH
                        </span>
                      )}
                      {card.badge === "GOOD VIBE" && (
                        <span className="text-emerald-700 font-bold text-[10px] flex items-center gap-1">
                          👍 GOOD VIBE
                        </span>
                      )}
                      {card.hasAttachment && (
                        <span className="text-slate-400">
                          📎
                        </span>
                      )}
                      {!card.badge && !card.hasAttachment && (
                        <span className="text-slate-400">
                          👤
                        </span>
                      )}
                    </div>
                    <span className="text-slate-400 font-medium">{card.timeAgo}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
