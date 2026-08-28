import React from 'react';
import { getServerSession } from '@/lib/authentication/server.session';
import UserDashboardAnalytics from '@/components/dashboard/user/DashboardAnalytics/DashboardAnalytics';
import CreatorDashboardAnalytics from '@/components/dashboard/creator/DashboardAnalytics/DashboardAnalytics';
import AdminDashboardAnalytics from '@/components/dashboard/admin/DashboardAnalytics/DashboardAnalytics';
import { getUserDashboardAnalytics } from '@/lib/actions/dashboard/userDashboardAnalytics';

export const metadata = {
  title: 'Dashboard Overview | PromptMatrix',
  description: 'Manage your AI prompts, track real-time analytics, and explore prompt performance.',
};

const DashboardHomePage = async () => {
  const session = await getServerSession();
  const userType = session?.user?.userType || 'user';

  const userAnalytics = await getUserDashboardAnalytics(session?.user?.id);
  console.log("🚀 ~ DashboardHomePage ~ userAnalytics:", userAnalytics);

  // Render role-specific analytical reports based on session userType
  if (userType === 'admin') {
    return <AdminDashboardAnalytics session={session} />;
  }

  if (userType === 'creator') {
    return <CreatorDashboardAnalytics session={session} />;
  }

  return <UserDashboardAnalytics session={session} analytics={userAnalytics?.data} />;
};

export default DashboardHomePage;