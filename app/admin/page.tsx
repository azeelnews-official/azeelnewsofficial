import { FileText, Eye, Users, MessageSquare } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { TrafficChart } from "@/components/admin/TrafficChart";
import { RecentPostsTable } from "@/components/admin/RecentPostsTable";
import { QuickActions } from "@/components/admin/QuickActions";
import { getAdminPosts, getAdminStats } from "@/lib/data/posts";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();
  const posts = (await getAdminPosts()).slice(0, 6);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink-950">Dashboard</h1>
        <p className="text-sm text-ink-300">Here&apos;s what&apos;s happening across AZEEL NEWS today.</p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Posts" value={stats.totalPosts.toLocaleString("en-IN")} change={4.2} icon={FileText} />
        <StatCard
          label="Total Views"
          value={`${(stats.totalViews / 1000).toFixed(1)}K`}
          change={12.8}
          icon={Eye}
        />
        <StatCard
          label="Active Users"
          value={stats.activeUsers.toLocaleString("en-IN")}
          change={2.1}
          icon={Users}
        />
        <StatCard
          label="Pending Comments"
          value={String(stats.pendingComments)}
          change={-3.4}
          icon={MessageSquare}
        />
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_320px]">
        <TrafficChart />
        <QuickActions />
      </div>

      <RecentPostsTable posts={posts} />
    </div>
  );
}
