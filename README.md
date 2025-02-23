stablo/
├── app/
│   ├── (sanity)/
│   │     ├── studio/
│   │     └── layout.tsx
│   ├── (web)/
│   │     ├── about/
│   │     ├── archive/
│   │     ├── contact/
│   │     ├── post/
│   │     ├── home.js
│   │     ├── page.js
│   │     └── layout.tsx
│   ├── (auth)/          # ➡️ New: Auth Pages
│   │     ├── login.tsx  # Login Page
│   │     ├── logout.tsx # Logout Page
│   ├── (dashboard)/      # ➡️ New: Dashboard Pages
│   │     ├── layout.tsx  
│   │     ├── page.tsx    # General Dashboard Page
│   │     ├── user/       # User Dashboard
│   │     │    └── page.tsx
│   │     ├── admin/      # Admin Dashboard
│   │     │    └── page.tsx
│   ├── favicon.ico
│   ├── layout.tsx
│   ├── page.tsx          # ➡️ New: Landing Page
│   └── providers.jsx
├── components/
│   ├── Navbar.tsx        # ➡️ New: Navbar Component
│   ├── Footer.tsx
├── lib/
│   ├── sanity.js
│   ├── supabase.js       # ➡️ New: Supabase Client
│   ├── auth.js           # ➡️ New: Auth Helper Functions
├── public/
├── styles/
└── utils/

🔹 1. Set Up Supabase in Your Project
Install Supabase SDK:

npm install @supabase/supabase-js

Create lib/supabase.js:

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

🔹 2. Add Authentication Functions
Create lib/auth.js:
import { supabase } from './supabase';

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
  if (error) console.error('Auth Error:', error);
}

export async function signOut() {
  await supabase.auth.signOut();
}

🔹 3. Create Login & Logout Pages
Create app/auth/login.tsx:

"use client";
import { signInWithGoogle } from "@/lib/auth";

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center h-screen">
      <button onClick={signInWithGoogle} className="bg-blue-500 text-white p-3 rounded">
        Sign in with Google
      </button>
    </div>
  );
}

Create app/auth/logout.tsx:

"use client";
import { signOut } from "@/lib/auth";

export default function LogoutPage() {
  return (
    <div className="flex justify-center items-center h-screen">
      <button onClick={signOut} className="bg-red-500 text-white p-3 rounded">
        Sign Out
      </button>
    </div>
  );
}

🔹 4. Add Navbar with Auth & Blog Links
Create components/Navbar.tsx:


"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  return (
    <nav className="flex justify-between p-4 bg-gray-800 text-white">
      <div>
        <Link href="/">Home</Link>
        <Link href="/blog" className="ml-4">Blog</Link>
      </div>
      <div>
        {user ? (
          <>
            <Link href="/dashboard" className="mr-4">Dashboard</Link>
            <Link href="/auth/logout">Logout</Link>
          </>
        ) : (
          <Link href="/auth/login">Login</Link>
        )}
      </div>
    </nav>
  );
}


🔹 5. Create User & Admin Dashboards
Create app/dashboard/layout.tsx:

export default function DashboardLayout({ children }) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {children}
    </div>
  );
}

Create app/dashboard/page.tsx:

"use client";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  return (
    <div>
      {user ? <p>Welcome, {user.email}</p> : <p>Loading...</p>}
    </div>
  );
}

Create app/dashboard/admin/page.tsx (For Admin):

export default function AdminDashboard() {
  return <div>Admin Dashboard - Only for Admins</div>;
}


🔹 6. Protect Routes with Middleware
Create middleware.ts:

import { NextResponse } from "next/server";
import { supabase } from "./lib/supabase";

export async function middleware(req) {
  const { data: { session } } = await supabase.auth.getSession();
  const isAdminRoute = req.nextUrl.pathname.startsWith("/dashboard/admin");

  if (!session) return NextResponse.redirect(new URL("/auth/login", req.url));

  if (isAdminRoute) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email !== "admin@example.com") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

