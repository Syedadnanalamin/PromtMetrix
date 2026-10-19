import React from 'react';
import Sidebar from '@/components/dashboard/sidebar/Sidebar';
import { getServerSession } from '@/lib/authentication/server.session';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }) {
  const session = await getServerSession();

  if (!session) {

    redirect("/login");
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        {/* Sticky Sidebar Aligned with Navbar */}
        <Sidebar session={session} />

        {/* Dashboard Pages Content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
