import React from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/authentication/server.session';
import { getAllPayments } from '@/lib/actions/admin/payments';
import AdminPayments from '@/components/dashboard/admin/payments/AdminPayments';

export const metadata = {
  title: 'All Payments & Subscriptions | Admin - PromptMatrix',
  description: 'View customer Stripe checkout payments, Pro tier purchases, and transaction histories.',
};

export default async function PaymentsPage() {
  const session = await getServerSession();
  if (!session) redirect('/login');

  const userType = session?.user?.userType || 'user';
  if (userType !== 'admin') redirect('/dashboard');

  const payments = await getAllPayments();

  return (
    <div className="w-full">
      <AdminPayments initialPayments={Array.isArray(payments) ? payments : []} />
    </div>
  );
}
