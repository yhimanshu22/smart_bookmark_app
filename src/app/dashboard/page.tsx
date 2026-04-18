'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { Bookmark } from '@/types';
import { Header } from '@/components/Header';
import { BookmarkCard } from '@/components/BookmarkCard';
import { AddBookmarkModal } from '@/components/AddBookmarkModal';
import { Toast, ToastType } from '@/components/Toast';
import { Plus, Search, Loader2 } from 'lucide-react';
import { User } from '@supabase/supabase-js';

export default function DashboardPage() {
  const [supabase] = useState(() => createClient());
  const [user, setUser] = useState<User | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  useEffect(() => {
    const fetchUserAndBookmarks = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data } = await supabase
          .from('bookmarks')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (data) {
          setBookmarks(data);
        }
      }
      setIsLoading(false);
    };

    fetchUserAndBookmarks();
  }, [supabase]);

  useEffect(() => {
    if (!user) {
      console.log('Realtime: Waiting for user...');
      return;
    }

    console.log('Realtime: Initializing subscription for user:', user.id);

    // Supabase Realtime Subscription
    const channel = supabase
      .channel('db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Realtime: Bookmark change received!', payload);
          if (payload.eventType === 'INSERT') {
            setBookmarks((prev) => {
              if (prev.find((b) => b.id === payload.new.id)) return prev;
              return [payload.new as Bookmark, ...prev];
            });
          } else if (payload.eventType === 'DELETE') {
            setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setBookmarks((prev) =>
              prev.map((b) => (b.id === payload.new.id ? (payload.new as Bookmark) : b))
            );
          }
        }
      )
      .subscribe((status, err) => {
        console.log('Realtime: Subscription status changed:', status);
        if (err) console.error('Realtime: Subscription error:', err);
        if (status === 'CHANNEL_ERROR') {
          console.error('Realtime: Channel error occurred.');
        }
      });

    return () => {
      console.log('Realtime: Cleaning up subscription');
      supabase.removeChannel(channel);
    };
  }, [user, supabase]);

  const handleDelete = async (id: string) => {
    // Optimistic UI updates
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
    const { error } = await supabase.from('bookmarks').delete().eq('id', id);
    if (!error) {
      setToast({ message: 'Bookmark deleted successfully', type: 'success' });
    } else {
      setToast({ message: 'Failed to delete bookmark', type: 'error' });
    }
  };

  const handleAddSuccess = () => {
    setToast({ message: 'Bookmark added successfully!', type: 'success' });
  };

  const filteredBookmarks = bookmarks.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="pointer-events-none absolute inset-0 grid-bg radial-mask opacity-100 translate-z-0"></div>
      
      <div className="relative z-10">
        <Header userEmail={user?.email} />
        
        <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Welcome back, <span className="green-clip-text truncate block sm:inline max-w-[200px]">{user?.email?.split('@')[0]}</span>
              </h1>
              <p className="text-slate-500 text-sm font-medium">
                You have <span className="text-blue-600 font-bold">{bookmarks.length}</span> active bookmarks
              </p>
            </div>
            
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-blue-500/20 transition-all hover:bg-blue-500 hover:shadow-blue-500/40 active:scale-95"
            >
              <Plus className="h-5 w-5" />
              Add Bookmark
            </button>
          </div>

          <div className="mb-10 relative group max-w-xl">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search your collection..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-border bg-white px-3 py-3 pl-12 pr-4 text-sm font-medium text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 placeholder-slate-400 transition-all shadow-sm group-hover:shadow-md"
            />
          </div>

          {bookmarks.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-24 text-center bg-white shadow-sm">
              <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                <Plus className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Start your collection</h3>
              <p className="mt-2 text-sm text-slate-500 max-w-xs mx-auto font-medium">
                Keep your favorite links in one place. Add your first bookmark now!
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-8 flex items-center gap-2 rounded-xl bg-blue-50 px-6 py-2.5 text-sm font-bold text-blue-600 transition hover:bg-blue-100"
              >
                Create Bookmark
              </button>
            </div>
          ) : filteredBookmarks.length === 0 ? (
            <div className="flex py-24 text-center justify-center">
              <p className="text-slate-500 font-bold bg-white px-6 py-3 rounded-full shadow-sm border border-slate-100">
                No bookmarks matched "<span className="text-blue-600">{searchQuery}</span>"
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredBookmarks.map((bookmark) => (
                <BookmarkCard key={bookmark.id} bookmark={bookmark} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </main>
      </div>

      {user && (
        <AddBookmarkModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleAddSuccess}
          userId={user.id}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}


