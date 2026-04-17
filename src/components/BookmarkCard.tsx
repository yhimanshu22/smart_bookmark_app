import type { Bookmark } from '@/types';
import { ExternalLink, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';

export function BookmarkCard({
  bookmark,
  onDelete,
}: {
  bookmark: Bookmark;
  onDelete: (id: string) => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getFaviconUrl = (url: string) => {
    try {
      const { hostname } = new URL(url);
      return `https://s2.googleusercontent.com/s2/favicons?domain=${hostname}&sz=64`;
    } catch {
      return '';
    }
  };

  const handleDelete = () => {
    setIsDeleting(true);
    onDelete(bookmark.id);
  };

  return (
    <div className={`group relative flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-slate-200 ${isDeleting ? 'opacity-50' : ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-1 items-center gap-4 overflow-hidden">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 shadow-sm overflow-hidden">
            <img
              src={getFaviconUrl(bookmark.url)}
              alt=""
              className="h-7 w-7 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          <div className="overflow-hidden min-w-0 flex-1">
            <h3 className="truncate text-sm font-bold text-slate-900" title={bookmark.title}>
              {bookmark.title}
            </h3>
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-0.5 block truncate text-xs text-blue-600 font-medium hover:underline"
              title={bookmark.url}
            >
              {bookmark.url}
            </a>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={isDeleting}
          className="flex-shrink-0 rounded-lg p-2 text-slate-300 hover:bg-red-50 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 active:scale-90"
          aria-label="Delete bookmark"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>

      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title={bookmark.title}
      />
    </div>
  );
}

