"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Post, posts, getUserById } from '@/lib/data';
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
import { Heart, MessageSquare, Search, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function PostsPage() {
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(posts);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(posts);
    }
  }, [searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by the useEffect
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
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
        <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
        
        <form onSubmit={handleSearch} className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search posts..."
            className="w-full pl-8 pr-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-2"
              onClick={handleClearSearch}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear</span>
            </Button>
          )}
        </form>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="withImage">With Images</TabsTrigger>
          <TabsTrigger value="textOnly">Text Only</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <PostsTable posts={filteredPosts} />
        </TabsContent>
        
        <TabsContent value="withImage">
          <PostsTable 
            posts={filteredPosts.filter(post => post.imageUrl)} 
          />
        </TabsContent>
        
        <TabsContent value="textOnly">
          <PostsTable 
            posts={filteredPosts.filter(post => !post.imageUrl)} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface PostsTableProps {
  posts: Post[];
}

function PostsTable({ posts }: PostsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Channel</TableHead>
            <TableHead className="hidden md:table-cell">Created</TableHead>
            <TableHead className="hidden lg:table-cell">Engagement</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No posts found.
              </TableCell>
            </TableRow>
          ) : (
            posts.map((post) => {
              const user = getUserById(post.userId);
              
              return (
                <TableRow key={post.id} className="group">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      {post.imageUrl && (
                        <div className="relative flex-shrink-0 h-10 w-16 overflow-hidden rounded">
                          <img 
                            src={post.imageUrl} 
                            alt={post.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <Link 
                          href={`/dashboard/users/${post.userId}`}
                          className="font-medium hover:underline line-clamp-1"
                        >
                          {post.title}
                        </Link>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {post.content}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user && (
                      <Link 
                        href={`/dashboard/users/${user.id}`}
                        className="flex items-center gap-2 hover:underline"
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={user.avatar} alt={user.channelName} />
                          <AvatarFallback>
                            {user.firstName.charAt(0)}
                            {user.lastName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{user.channelName}</span>
                      </Link>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {format(post.createdAt, 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Heart size={14} />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare size={14} />
                        <span>{post.comments}</span>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}