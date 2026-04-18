# Smart Bookmark App

A premium, high-performance bookmark manager built for developers and power users. Featuring a light-mode aesthetic, real-time synchronization, and secure private collections.

> [!TIP]
> **View the [Technical Architecture & Data Flow](architecture.md)** for a visual deep dive into the system!

## 🔐 Database Security & Auth

### Supabase Auth
We utilize **Google OAuth** for secure, passwordless authentication. This ensures that user identities are verified and persistent across sessions using Supabase SSR.

### Row Level Security (RLS)
Security is enforced at the database layer (not just the API). Every operation on the `bookmarks` table is protected by a policy:
```sql
CREATE POLICY "Users can only access their own bookmarks"
ON public.bookmarks
FOR ALL
USING (auth.uid() = user_id);
```
**Why this is correct:** This policy ensures that even if a malicious user tries to access another's ID via the API, Supabase automatically filters and rejects the request because `auth.uid()` (the verified sender's ID) will not match the requested `user_id`. It creates a "zero-trust" environment for user data.

## ⚡ Real-Time Synchronization

The app uses **Supabase Realtime** (`postgres_changes`) to keep the UI perfectly in sync across multiple browser tabs and windows.

- **Implementation:** We subscribe to the `bookmarks` table using a specific filter for the current `user_id`. This minimizes "noise" and ensures the client only receives events relevant to them.
- **Subscription Cleanup:** To prevent memory leaks and redundant listeners, we handle channel removal in the `useEffect` cleanup block:
  ```javascript
  return () => { supabase.removeChannel(channel); };
  ```

## 🛠️ Errors & Troubleshooting (Build & Runtime)

### 1. Realtime Status: TIMED_OUT
- **Problem:** When first connecting, the console showed `Realtime subscription status: TIMED_OUT`.
- **Cause:** This usually happens when the table hasn't been added to the `supabase_realtime` publication or the project is in a cold state.
- **Solution:** Ensured the `bookmarks` table was added to the publication and verified the Supabase URL/Key were correct in `.env.local`.

### 2. Deletion Not Syncing in Real-time
- **Problem:** Adding bookmarks worked instantly, but deletions did not trigger UI updates.
- **Solution:** Executed `ALTER TABLE public.bookmarks REPLICA IDENTITY FULL;` in the Supabase SQL editor. This ensures the `old` record data is sent with the DELETE event, allowing the frontend to identify which bookmark to remove.

### 3. Hydration Mismatch Warnings
- **Problem:** Browser console showed "Hydration failed" errors.
- **Solution:** Added `suppressHydrationWarning` to the `<html>` tag in `layout.tsx` to handle Next.js 15's strict hydration checks regarding system theme attributes.

### 4. CSS @theme Warnings
- **Problem:** Lint warnings about the `@theme` rule in `globals.css`.
- **Solution:** Confirmed this is a standard Tailwind 4 feature and doesn't affect the build. Suppressed or ignored the lint warning as the functionality is correct.

## 🎁 Bonus Features

- **Instant Search:** A high-speed, client-side filtering engine that updates your bookmark collection instantly as you type.
- **Auto-Favicons:** Automatically fetches high-quality favicons for every bookmark, providing instant visual recognition.

## 🚀 Future Improvements

If I had more time, I would implement **AI-Driven Auto-Categorization**. Using a Supabase Edge Function and the Gemini API, the app could automatically analyze the content of a saved link and assign it to folders or tags (e.g., "Development", "Design", "Articles") without any manual work from the user.
