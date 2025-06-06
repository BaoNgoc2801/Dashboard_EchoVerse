"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AreaChart, BarChart } from '@/components/dashboard/charts';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { fetchAllUsers } from "@/service/user.service";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null); // 👈 sửa lại nếu cần
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const users = await fetchAllUsers();
      const totalUsers = users.length;
      const activeUsers = users.filter((u) => u.roles.some(r => r.name === "active")).length;

      setStats({
        totalUsers,
        activeUsers,
        totalLivestreams: 0, // 👈 nếu chưa có API thì giữ 0
        activeLivestreams: 0,
        totalPosts: 0,
        postsPerDay: [],
        livestreamsPerDay: [],
      });

      setIsLoading(false);
    };

    fetchData();
  }, []);

  if (isLoading || !stats) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 rounded-lg bg-muted"></div>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4 h-[300px] rounded-lg bg-muted"></div>
          <div className="col-span-3 h-[300px] rounded-lg bg-muted"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      <StatsCards stats={stats} />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Posts Activity</CardTitle>
                <CardDescription>
                  Number of posts created over the last 7 days
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <AreaChart
                  data={stats.postsPerDay}
                  xAxisKey="date"
                  yAxisKey="count"
                  categories={["count"]}
                  colors={["chart-1"]}
                  showLegend={false}
                />
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Livestream Activity</CardTitle>
                <CardDescription>
                  Number of livestreams started over the last 7 days
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <BarChart
                  data={stats.livestreamsPerDay}
                  xAxisKey="date"
                  yAxisKey="count"
                  categories={["count"]}
                  colors={["chart-2"]}
                  showLegend={false}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-7">
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>
                  Analysis of user activity and growth trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Detailed analytics will be displayed here. This section can be expanded
                  to include more detailed metrics and visualizations.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}