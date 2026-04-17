'use client';

import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/10 p-4 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-sm rounded-3xl bg-white p-10 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 border border-red-100 shadow-sm">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-50 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Delete Bookmark?</h2>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed font-medium">
            Are you sure you want to delete <span className="font-bold text-slate-700">"{title}"</span>? 
            This action cannot be undone.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-2xl border border-slate-100 bg-white px-4 py-3 text-sm font-bold text-slate-600 transition-all hover:bg-slate-50 active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 rounded-2xl bg-red-600 px-4 py-3 text-sm font-bold text-white shadow-xl shadow-red-500/20 hover:bg-red-500 transition-all active:scale-95"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}


