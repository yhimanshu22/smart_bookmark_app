# Smart Bookmark App Architecture

This document provides a technical overview of the system architecture, data flow, and security model of the Smart Bookmark App.

## 🏗️ High-Level System Overview

The application follows a modern Serverless / BaaS (Backend-as-a-Service) architecture using **Next.js 15**, **Tailwind CSS**, and **Supabase**.

```mermaid
graph TD
    subgraph Client ["Client (Browser)"]
        UI["Next.js App Components"]
        RT["Realtime Hook (useBookmarks)"]
        AuthClient["Supabase Auth Client"]
    end

    subgraph Server ["Next.js Server Side"]
        MW["Middleware (Auth Guard)"]
        SSR["Server Actions / Dashboard SSR"]
    end

    subgraph Supabase ["Supabase Backend"]
        Auth["Supabase Auth (Google OAuth)"]
        DB[(PostgreSQL Database)]
        Realtime["Realtime Engine (CDC)"]
    end

    UI -- OAuth Request --> Auth
    Auth -- JWT/Session --> MW
    MW -- Redirects --> UI
    
    UI -- CRUD Ops --> DB
    DB -- DB Change --> Realtime
    Realtime -- Events --> RT
    RT -- UI Refresh --> UI
```

---

## 🔐 Data Security & RLS Flow

Row Level Security (RLS) ensures that the database itself is the source of truth for security, preventing any unauthorized access.

```mermaid
sequenceDiagram
    participant User as User
    participant App as Next.js Dashboard
    participant PG as PostgreSQL (RLS)
    participant Auth as Supabase Auth

    User->>App: Request Bookmarks
    App->>PG: SELECT * FROM bookmarks
    Note over PG: Check policy: auth.uid() == user_id
    PG->>Auth: Request verified UID from JWT
    Auth-->>PG: Returns UUID
    alt Policy Matches
        PG-->>App: Return User's Bookmarks
    else Policy Fails
        PG-->>App: Return Empty Set / Denied
    end
    App-->>User: Display Bookmarks
```

---

## 🔥 Real-time Data Flow

The real-time synchronization uses PostgreSQL's replication log (via Supabase Realtime) to push changes to connected clients.

```mermaid
graph LR
    UserA[User A] -- Add/Delete --> DB[(PostgreSQL)]
    DB -- Change Event --> Realtime[Supabase Realtime]
    Realtime -- Broadcast --> UserA_Tab2[User A - Tab 2]
    Realtime -- Broadcast --> UserA_Tab3[User A - Tab 3]
    
    subgraph Privacy ["Secure Filtering"]
        Realtime -.-> Filter((Filtered by user_id))
    end
```

## 🛠️ Tech Stack Breakdown

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS (Modern Glassmorphism)
- **Authentication:** Supabase SSR (Google Provider)
- **Database:** PostgreSQL on Supabase
- **Real-time:** Supabase Realtime (CDC)
- **Deployment:** GitHub -> Vercel
