'use client';

import { createClient } from '@/utils/supabase/client';
import { Bookmark, LogIn, Shield, Zap, Globe } from 'lucide-react';

export default function LandingPage() {
  const handleGoogleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Background Decor */}
      <div className="pointer-events-none absolute inset-0 grid-bg radial-mask opacity-100 translate-z-0"></div>

      {/* Header */}
      <header className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg transition-transform group-hover:scale-105">
            <Bookmark className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">Smart Bookmark</span>
        </div>
        <button
          onClick={handleGoogleLogin}
          className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 active:scale-95"
        >
          Login
        </button>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 py-20 lg:py-32">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
           ✨ Real-time sync across all devices
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          The <span className="green-clip-text">Premium</span> Way to Organize the Web
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl animate-in fade-in slide-in-from-bottom-6 duration-1000">
          Save, organize, and access your favorite links with instant synchronization and a beautiful glassmorphism interface.
        </p>

        <button
          onClick={handleGoogleLogin}
          className="group relative flex items-center justify-center gap-3 overflow-hidden rounded-2xl bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-2xl shadow-blue-500/30 transition-all hover:bg-blue-500 active:scale-95 animate-in fade-in slide-in-from-bottom-8 duration-1000"
        >
          <LogIn className="h-6 w-6 transition-transform group-hover:translate-x-1" />
          Get Started for Free
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        </button>

        {/* Features Minimalist */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl px-4 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="flex flex-col items-center p-6 rounded-3xl border border-slate-100 bg-white/50 backdrop-blur-sm">
            <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-4 text-blue-600">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Instant Sync</h3>
            <p className="text-sm text-slate-500 text-center">Real-time updates across multiple tabs and devices without refresh.</p>
          </div>
          <div className="flex flex-col items-center p-6 rounded-3xl border border-slate-100 bg-white/50 backdrop-blur-sm">
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4 text-emerald-600">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Privacy First</h3>
            <p className="text-sm text-slate-500 text-center">Secure Row Level Security ensures only you can access your saved links.</p>
          </div>
          <div className="flex flex-col items-center p-6 rounded-3xl border border-slate-100 bg-white/50 backdrop-blur-sm">
            <div className="h-12 w-12 rounded-2xl bg-purple-50 flex items-center justify-center mb-4 text-purple-600">
              <Globe className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Auto-Favicons</h3>
            <p className="text-sm text-slate-500 text-center">Visual domain recognition makes finding your links effortless.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-10 text-center border-t border-slate-100">
        <p className="text-slate-400 text-sm">© 2026 Smart Bookmark. All rights reserved.</p>
      </footer>
    </div>
  );
}
