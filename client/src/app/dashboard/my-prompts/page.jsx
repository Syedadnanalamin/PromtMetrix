import React from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/authentication/server.session';
import UserMyPromts from '@/components/dashboard/user/mypromts/Mypromts';
import CreatorMyPromts from '@/components/dashboard/creator/mypromts/Mypromts';
import getPromtbyuser from '@/lib/actions/promts/getpromtsbyuser';

export const metadata = {
  title: 'My Prompts | PromptMatrix Dashboard',
  description: 'Manage, edit, and track the status and engagement of your submitted AI prompts.',
};

const MyPromptsPage = async () => {
  const session = await getServerSession();

  // 1. Unauthenticated users redirected to login
  if (!session) {
    redirect('/login');
  }

  const userType = session?.user?.userType || 'user';

  const userId = session?.user?.id || session?.user?._id;
  const data = await getPromtbyuser(userId);
  console.log(" this is the server data", data);

  // 2. Prevent admin manual URL access by redirecting to Admin Prompt Moderation
  if (userType === 'admin') {
    redirect('/dashboard/all-prompts');
  }

  // 3. Render Creator prompt portfolio
  if (userType === 'creator') {
    return <CreatorMyPromts session={session} data={data} />;
  }

  // 4. Render User prompt management
  return <UserMyPromts session={session} data={data} />;
};

export default MyPromptsPage;