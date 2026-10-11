import React from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/authentication/server.session';
import { getAllReports } from '@/lib/actions/admin/reports';
import AdminReports from '@/components/dashboard/admin/reports/AdminReports';

export const metadata = {
  title: 'Reported Prompts | Admin - PromptMatrix',
  description: 'Audit and resolve community flagged prompts for platform safety.',
};

export default async function ReportsPage() {
  const session = await getServerSession();
  if (!session) redirect('/login');

  const userType = session?.user?.userType || 'user';
  if (userType !== 'admin') redirect('/dashboard');

  const reports = await getAllReports();

  return (
    <div className="w-full">
      <AdminReports initialReports={Array.isArray(reports) ? reports : []} />
    </div>
  );
}
