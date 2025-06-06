"use client";

import { useState, useEffect } from 'react';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { fetchAllUsers } from "@/service/user.service";
import { fetchImages } from "@/service/post.service";

export default function DashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            const [users, images] = await Promise.all([
                fetchAllUsers(),
                fetchImages(),
            ]);

            const totalUsers = users.length;
            const activeUsers = users.filter((u) => u.roles.some(r => r.name === "active")).length;
            const totalPosts = images.length;

            setStats({
                totalUsers,
                activeUsers,
                totalLivestreams: 0,
                activeLivestreams: 0,
                totalPosts,
            });

            setIsLoading(false);
        };

        fetchData();
    }, []);

    if (isLoading || !stats) {
        return (
            <div className="flex flex-col gap-6 animate-pulse">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-32 rounded-lg bg-muted"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <StatsCards stats={stats} />
            </div>
        </div>
    );
}
