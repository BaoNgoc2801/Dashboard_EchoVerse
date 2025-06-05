"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { User, users } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { UserSearch } from '@/components/dashboard/user-search';
import { FileText, MoreHorizontal, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function UsersPage() {
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(user => 
        user.channelName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm]);

  const handleDeleteUser = (userId: string) => {
    // In a real app, this would call an API to delete the user
    const updatedUsers = filteredUsers.filter(user => user.id !== userId);
    setFilteredUsers(updatedUsers);
    
    toast({
      title: "User deleted",
      description: "The user has been successfully deleted.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <div className="h-10 w-full max-w-sm rounded-md bg-muted mb-4"></div>
        <div className="rounded-md border">
          <div className="h-10 w-full bg-muted"></div>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-16 w-full bg-card border-t"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <UserSearch onSearch={setSearchTerm} />
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <UsersTable users={filteredUsers} onDeleteUser={handleDeleteUser} />
        </TabsContent>
        
        <TabsContent value="active">
          <UsersTable 
            users={filteredUsers.filter(user => user.isActive)} 
            onDeleteUser={handleDeleteUser} 
          />
        </TabsContent>
        
        <TabsContent value="inactive">
          <UsersTable 
            users={filteredUsers.filter(user => !user.isActive)} 
            onDeleteUser={handleDeleteUser} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface UsersTableProps {
  users: User[];
  onDeleteUser: (userId: string) => void;
}

function UsersTable({ users, onDeleteUser }: UsersTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>Channel Name</TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead className="hidden md:table-cell">Created At</TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
            <TableHead className="hidden lg:table-cell">Content</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No users found.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id} className="group">
                <TableCell>
                  <Avatar>
                    <AvatarImage src={user.avatar} alt={user.channelName} />
                    <AvatarFallback>
                      {user.firstName.charAt(0)}
                      {user.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">
                  <Link 
                    href={`/dashboard/users/${user.id}`}
                    className="hover:underline"
                  >
                    {user.channelName}
                  </Link>
                </TableCell>
                <TableCell>
                  {user.firstName} {user.middleName ? `${user.middleName} ` : ''}{user.lastName}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {format(user.createdAt, 'MMM d, yyyy')}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant={user.isActive ? "default" : "secondary"}>
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <FileText size={12} />
                      {user.totalPosts}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Video size={12} />
                      {user.totalLivestreams}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                        <MoreHorizontal size={16} />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/users/${user.id}`}>
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
                        onClick={() => onDeleteUser(user.id)}
                      >
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}