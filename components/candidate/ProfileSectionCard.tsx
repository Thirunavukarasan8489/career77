import React, { ReactNode } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export interface ProfileSectionCardProps {
  title: string;
  children: ReactNode;
  onEdit?: () => void;
  onAdd?: () => void;
  isEmpty?: boolean;
  emptyMessage?: string;
}

export default function ProfileSectionCard({ title, children, onEdit, onAdd, isEmpty, emptyMessage = "No details added yet." }: ProfileSectionCardProps) {
  return (
    <Card className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
        <h3 className="font-bold text-lg text-slate-900">{title}</h3>
        <div className="flex gap-2">
          {onAdd && (
            <Button variant="ghost" size="sm" onClick={onAdd} className="text-blue-600">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add
            </Button>
          )}
          {onEdit && !isEmpty && (
            <Button variant="ghost" size="sm" onClick={onEdit} className="text-slate-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex-1">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-sm font-medium text-slate-500 mb-3">{emptyMessage}</p>
            {onAdd && (
              <Button variant="outline" size="sm" onClick={onAdd}>
                Add {title}
              </Button>
            )}
          </div>
        ) : (
          children
        )}
      </div>
    </Card>
  );
}
