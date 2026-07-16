"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";

interface Notification {
  _id: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const { refreshCandidate } = useApp();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
    markNotificationsRead();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (e) {
      console.error("Error loading notifications:", e);
    } finally {
      setLoading(false);
    }
  };

  const markNotificationsRead = async () => {
    try {
      const res = await fetch("/api/notifications", { method: "PATCH" });
      if (res.ok) {
        refreshCandidate(); // Clear notification count on header
      }
    } catch (e) {
      console.error("Error marking notifications as read:", e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 grow w-full">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center gap-1"
        >
          &larr; Back to Dashboard
        </Link>
      </div>

      <h1 className="font-display font-extrabold text-2xl text-slate-900 mb-6">
        Notifications
      </h1>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : notifications.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {notifications.map((notif) => (
              <div key={notif._id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center text-lg flex-shrink-0">
                  🎯
                </div>
                <div className="grow">
                  <p className="text-sm text-slate-800 font-medium">
                    {notif.message}
                  </p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-1">
                    {new Date(notif.createdAt).toLocaleString()}
                  </p>
                </div>
                {!notif.read && (
                  <div className="w-2.5 h-2.5 bg-blue-600 rounded-full self-center flex-shrink-0 animate-pulse" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-slate-400">
            <span className="block text-3xl mb-2">🔔</span>
            <p className="text-sm font-semibold text-slate-500">No notifications yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
