import React from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/authentication/server.session';
import { getAllUsers } from '@/lib/actions/admin/users';
import AllUsers from '@/components/dashboard/admin/users/AllUsers';

export const metadata = {
  title: 'All Users | Admin Dashboard - PromptMatrix',
  description: 'Manage platform users, roles, account status, and subscription plans.',
};

export default async function UsersPage() {
  const session = await getServerSession();
  if (!session) redirect('/login');

  const userType = session?.user?.userType || 'user';
  if (userType !== 'admin') redirect('/dashboard');

  const users = await getAllUsers();

  return (
    <div className="w-full">
      <AllUsers session={session} initialUsers={Array.isArray(users) ? users : []} />
    </div>
  );
}
