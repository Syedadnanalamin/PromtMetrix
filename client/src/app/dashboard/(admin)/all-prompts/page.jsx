import React from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/authentication/server.session';
import { getAllPrompts } from '@/lib/actions/admin/prompts';
import AdminAllPrompts from '@/components/dashboard/admin/prompts/AdminAllPrompts';

export const metadata = {
  title: 'All Prompts Moderation | Admin - PromptMatrix',
  description: 'Review, approve, and manage community submitted AI prompt templates.',
};

export default async function AllPromptsPage() {
  const session = await getServerSession();
  if (!session) redirect('/login');

  const userType = session?.user?.userType || 'user';
  if (userType !== 'admin') redirect('/dashboard');

  const prompts = await getAllPrompts();

  return (
    <div className="w-full">
      <AdminAllPrompts initialPrompts={Array.isArray(prompts) ? prompts : []} />
    </div>
  );
}
