'use client';

import { createClient } from '@/utils/supabase/client';
import { LogOut, Bookmark as BookmarkIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function Header({ userEmail }: { userEmail?: string }) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => router.push('/dashboard')}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/20 transition-transform group-hover:scale-105">
            <BookmarkIcon className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Smart Bookmark</h1>
        </div>
        <div className="flex items-center gap-4">
          {userEmail && (
            <span className="hidden text-xs font-bold text-slate-500 sm:block bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
              {userEmail}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl border border-slate-100 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition-all hover:bg-red-50 hover:text-red-600 active:scale-95"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}


