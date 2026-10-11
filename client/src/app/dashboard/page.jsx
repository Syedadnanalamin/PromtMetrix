import React from 'react';
import { getServerSession } from '@/lib/authentication/server.session';
import UserDashboardAnalytics from '@/components/dashboard/user/DashboardAnalytics/DashboardAnalytics';
import CreatorDashboardAnalytics from '@/components/dashboard/creator/DashboardAnalytics/DashboardAnalytics';
import AdminDashboardAnalytics from '@/components/dashboard/admin/DashboardAnalytics/DashboardAnalytics';
import { getUserDashboardAnalytics } from '@/lib/actions/dashboard/userDashboardAnalytics';
import { getAdminDashboardAnalytics } from '@/lib/actions/dashboard/adminDashboardAnalytics';
import getPromtbyuser from '@/lib/actions/promts/getpromtsbyuser';

export const metadata = {
  title: 'Dashboard Overview | PromptMatrix',
  description: 'Manage your AI prompts, track real-time analytics, and explore prompt performance.',
};

const DashboardHomePage = async () => {
  const session = await getServerSession();
  const userType = session?.user?.userType || 'user';
  const userId = session?.user?.id || session?.user?._id;

  const userAnalytics = await getUserDashboardAnalytics(userId);
  console.log("🚀 ~ DashboardHomePage ~ userAnalytics:", userAnalytics);

  // Render role-specific analytical reports based on session userType
  if (userType === 'admin') {
    const adminAnalytics = await getAdminDashboardAnalytics();
    return <AdminDashboardAnalytics session={session} analytics={adminAnalytics?.data} />;
  }

  if (userType === 'creator') {
    const creatorPrompts = await getPromtbyuser(userId);
    return <CreatorDashboardAnalytics session={session} prompts={creatorPrompts} />;
  }

  return <UserDashboardAnalytics session={session} analytics={userAnalytics?.data} />;
};

export default DashboardHomePage;