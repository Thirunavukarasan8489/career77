"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CandidateProfile {
  _id: string;
  name: string;
  mobile?: string;
  email?: string;
  experience?: string;
  city?: string;
  skills: string[];
  lookingFor?: string;
  bio?: string;
  resumeUrl?: string;
  resumePublicId?: string;
}

interface AppContextType {
  candidate: CandidateProfile | null;
  loading: boolean;
  loginCandidate: (cand: CandidateProfile) => void;
  logoutCandidate: () => Promise<void>;
  refreshCandidate: () => Promise<void>;
  unreadCount: number;
  setUnreadCount: (count: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [candidate, setCandidate] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshCandidate = async () => {
    try {
      const res = await fetch("/api/candidates");
      if (res.ok) {
        const data = await res.json();
        setCandidate(data.candidate);

        const notifRes = await fetch("/api/notifications");
        if (notifRes.ok) {
          const notifData = await notifRes.json();
          const unread = notifData.notifications.filter((n: any) => !n.read).length;
          setUnreadCount(unread);
        }
      } else {
        setCandidate(null);
        setUnreadCount(0);
      }
    } catch {
      setCandidate(null);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCandidate();
  }, []);

  const loginCandidate = (cand: CandidateProfile) => {
    setCandidate(cand);
    refreshCandidate();
  };

  const logoutCandidate = async () => {
    try {
      await fetch("/api/candidates/logout", { method: "POST" });
    } catch (e) {
      console.error("Error logging out:", e);
    }
    setCandidate(null);
    setUnreadCount(0);
    window.location.href = "/";
  };

  return (
    <AppContext.Provider
      value={{
        candidate,
        loading,
        loginCandidate,
        logoutCandidate,
        refreshCandidate,
        unreadCount,
        setUnreadCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
