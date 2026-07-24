import React from 'react';
import Card from '@/components/ui/Card';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Badge from '@/components/ui/Badge';

export interface AuditLog {
  id: string;
  action: string;
  actor: string;
  target: string;
  timestamp: string;
  status: 'success' | 'failure';
}

export interface AuditLogViewerProps {
  logs: AuditLog[];
}

export default function AuditLogViewer({ logs }: AuditLogViewerProps) {
  return (
    <Card className="flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg text-slate-900">System Audit Logs</h3>
        <button className="text-sm font-bold text-blue-600 hover:text-blue-700">Export CSV</button>
      </div>
      
      <div className="space-y-4">
        {logs.map(log => (
          <div key={log.id} className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
            <div className="mt-1">
              {log.status === 'success' ? (
                <div className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-red-500 ring-4 ring-red-100" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <p className="text-sm font-bold text-slate-900">{log.action}</p>
                <span className="text-xs text-slate-500 font-medium">{log.timestamp}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="font-semibold text-slate-800">{log.actor}</span>
                <span>→</span>
                <span>{log.target}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
