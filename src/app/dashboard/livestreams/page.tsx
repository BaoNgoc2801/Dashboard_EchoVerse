"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Livestream, livestreams, getUserById } from '@/lib/data';
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
import { Badge } from '@/components/ui/badge';
import { Search, Users, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function LivestreamsPage() {
  const [filteredLivestreams, setFilteredLivestreams] = useState<Livestream[]>(livestreams);
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
      const filtered = livestreams.filter(livestream => 
        livestream.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLivestreams(filtered);
    } else {
      setFilteredLivestreams(livestreams);
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
        <h1 className="text-3xl font-bold tracking-tight">Livestreams</h1>
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
        <h1 className="text-3xl font-bold tracking-tight">Livestreams</h1>
        
        <form onSubmit={handleSearch} className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search livestreams..."
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
          <TabsTrigger value="all">All Livestreams</TabsTrigger>
          <TabsTrigger value="active">
            Currently Live <Badge variant="outline" className="ml-2">{filteredLivestreams.filter(stream => stream.isActive).length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="ended">Ended</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <LivestreamsTable livestreams={filteredLivestreams} />
        </TabsContent>
        
        <TabsContent value="active">
          <LivestreamsTable 
            livestreams={filteredLivestreams.filter(stream => stream.isActive)} 
          />
        </TabsContent>
        
        <TabsContent value="ended">
          <LivestreamsTable 
            livestreams={filteredLivestreams.filter(stream => !stream.isActive)} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface LivestreamsTableProps {
  livestreams: Livestream[];
}

function LivestreamsTable({ livestreams }: LivestreamsTableProps) {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours === 0) {
      return `${remainingMinutes}m`;
    }
    
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Channel</TableHead>
            <TableHead className="hidden md:table-cell">Started</TableHead>
            <TableHead className="hidden lg:table-cell">Duration</TableHead>
            <TableHead className="hidden lg:table-cell">Viewers</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {livestreams.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No livestreams found.
              </TableCell>
            </TableRow>
          ) : (
            livestreams.map((livestream) => {
              const user = getUserById(livestream.userId);
              
              return (
                <TableRow key={livestream.id} className="group">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="relative flex-shrink-0 h-10 w-16 overflow-hidden rounded">
                        <img 
                          src={livestream.thumbnailUrl} 
                          alt={livestream.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <Link 
                          href={`/dashboard/users/${livestream.userId}`}
                          className="font-medium hover:underline line-clamp-1"
                        >
                          {livestream.title}
                        </Link>
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
                    {format(livestream.startedAt, 'MMM d, h:mm a')}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {formatDuration(livestream.duration)}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center gap-1">
                      <Users size={14} />
                      <span>{livestream.viewers.toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={livestream.isActive ? "default" : "secondary"}>
                      {livestream.isActive ? "Live" : "Ended"}
                    </Badge>
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