"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import {
  LayoutDashboard,
  Users,
  VideoIcon,
  FileTextIcon,
  LogOut,
  LogIn,
  Menu,
  X
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  isActive: boolean;
}

function NavItem({ href, icon, title, isActive }: NavItemProps) {
  return (
      <Link href={href} className="w-full">
        <Button
            variant="ghost"
            className={cn(
                "w-full justify-start gap-2 px-2",
                isActive && "bg-accent text-accent-foreground"
            )}
        >
          {icon}
          <span>{title}</span>
        </Button>
      </Link>
  );
}

function LoginDialog() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <LogIn size={16} />
            Login
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login to Dashboard</DialogTitle>
            <DialogDescription>
              Enter your credentials to access the admin dashboard.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="admin@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
  );
}

export default function DashboardLayout({
                                          children,
                                        }: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const routes = [
    {
      href: '/dashboard',
      icon: <LayoutDashboard size={20} />,
      title: 'Dashboard',
    },
    {
      href: '/dashboard/users',
      icon: <Users size={20} />,
      title: 'Users',
    },
    {
      href: '/dashboard/livestreams',
      icon: <VideoIcon size={20} />,
      title: 'Livestreams',
    },
    {
      href: '/dashboard/posts',
      icon: <FileTextIcon size={20} />,
      title: 'Posts',
    }
  ];

  return (
      <div className="flex min-h-screen flex-col md:flex-row">
        {/* Mobile sidebar toggle */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-background border-b">
          <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
          <h1 className="font-bold text-lg">Livestream Admin</h1>
          <div className="flex items-center gap-2">
            {isLoggedIn ? (
                <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-destructive"
                    onClick={() => setIsLoggedIn(false)}
                >
                  <LogOut size={16} />
                  Logout
                </Button>
            ) : (
                <LoginDialog />
            )}
            <ModeToggle />
          </div>
        </div>

        {/* Sidebar for mobile (overlay) */}
        <div
            className={cn(
                "fixed inset-0 z-40 md:hidden transition-opacity duration-300",
                sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
        >
          <div className="absolute inset-0 bg-black/20" onClick={() => setSidebarOpen(false)} />
          <div className={cn(
              "absolute top-0 left-0 h-full w-64 bg-background border-r shadow-lg transition-transform duration-300 transform",
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}>
            <div className="p-4 mt-16 space-y-2">
              {routes.map((route) => (
                  <NavItem
                      key={route.href}
                      href={route.href}
                      icon={route.icon}
                      title={route.title}
                      isActive={pathname === route.href}
                  />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar for desktop */}
        <div className="hidden md:flex flex-col w-64 border-r bg-background h-screen sticky top-0">
          <div className="p-4 border-b flex items-center justify-between">
            <h1 className="font-bold text-xl">Livestream Admin</h1>
          </div>
          <div className="flex flex-col flex-1 p-4 space-y-2">
            {routes.map((route) => (
                <NavItem
                    key={route.href}
                    href={route.href}
                    icon={route.icon}
                    title={route.title}
                    isActive={pathname === route.href}
                />
            ))}
          </div>
          <div className="p-4 border-t flex items-center justify-between gap-2">
            {isLoggedIn ? (
                <Button
                    variant="ghost"
                    className="gap-2 text-destructive"
                    onClick={() => setIsLoggedIn(false)}
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </Button>
            ) : (
                <LoginDialog />
            )}
            <ModeToggle />
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 md:h-screen md:overflow-y-auto">
          <div className="p-6 md:p-8 pt-20 md:pt-8">
            {children}
          </div>
        </div>
      </div>
  );
}