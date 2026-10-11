import React from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/authentication/server.session';
import getPromtbyuser from '@/lib/actions/promts/getpromtsbyuser';
import Addpromts from '@/components/dashboard/shared/addpromts/Addpromts';

export const metadata = {
  title: 'Add New Prompt | Dashboard - PromptMatrix',
  description: 'Create and submit a new AI prompt template for community moderation and marketplace listing.',
};

export default async function AddPromptPage() {
  const session = await getServerSession();
  if (!session) redirect('/login');

  const user = session?.user;
  const userType = user?.userType || 'user';
  const plan = user?.plan || 'free';
  const isPro = plan === 'pro' || user?.isPremium;

  const userPrompts = await getPromtbyuser(user?.id || user?._id);
  const promptCount = Array.isArray(userPrompts) ? userPrompts.length : 0;

  // Free user limit is 3 prompts
  const isLimitReached = userType === 'user' && !isPro && promptCount >= 3;

  return (
    <div className="w-full">
      <Addpromts
        session={session}
        isLimitReached={isLimitReached}
        promptCount={promptCount}
      />
    </div>
  );
}