'use client';

import { createClient } from '@/utils/supabase/client';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

export function AddBookmarkModal({
  isOpen,
  onClose,
  onSuccess,
  userId,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
}) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setUrl('');
      setTitle('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    let formattedUrl = url.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    try {
      new URL(formattedUrl);
    } catch {
      setError('Please enter a valid URL.');
      return;
    }

    if (!title.trim()) {
      setError('Title is required.');
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();
    
    const { error: insertError } = await supabase.from('bookmarks').insert({
      user_id: userId,
      title: title.trim(),
      url: formattedUrl,
    });

    setIsSubmitting(false);

    if (insertError) {
      setError(insertError.message);
    } else {
      onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/10 p-4 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Add Bookmark</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-50 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="url" className="text-sm font-bold text-slate-700 ml-1">
              URL
            </label>
            <input
              id="url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g., github.com"
              className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-3 text-sm font-medium text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder-slate-400"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-bold text-slate-700 ml-1">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., GitHub"
              className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-3 text-sm font-medium text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder-slate-400"
              required
            />
          </div>

          {error && <p className="text-xs font-bold text-red-500 bg-red-50 px-4 py-3 rounded-xl border border-red-100">{error}</p>}

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-2xl bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-xl shadow-blue-500/20 hover:bg-blue-500 transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Bookmark'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
