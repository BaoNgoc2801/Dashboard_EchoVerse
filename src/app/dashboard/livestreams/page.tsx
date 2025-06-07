"use client";


import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchLivestreamRooms } from '@/service/livestream.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Users, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


interface Livestream {
  id: number;
  title: string;
  isActive: boolean;
  thumbnailUrl: string;
  startedAt: Date;
  streamerId: number;
  categoryId: number;
  maxParticipants: number;
}


export default function LivestreamsPage() {
  const [livestreams, setLivestreams] = useState<Livestream[]>([]);
  const [filteredLivestreams, setFilteredLivestreams] = useState<Livestream[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const loadLivestreams = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const rooms = await fetchLivestreamRooms();
        console.log('Fetched rooms:', rooms);

        const mapped = rooms.map((room) => ({
          id: room.id,
          title: room.roomName,
          isActive: room.status === "active",
          thumbnailUrl: room.thumbnail || '',
          startedAt: new Date(room.createdAt),
          streamerId: room.streamerId,
          categoryId: room.categoryId,
          maxParticipants: room.maxParticipants,
        }));


        setLivestreams(mapped);
        setFilteredLivestreams(mapped);
      } catch (err) {
        setError('Failed to load livestreams. Please try again later.');
        console.error('Error loading livestreams:', err);
      } finally {
        setIsLoading(false);
      }
    };


    loadLivestreams();
  }, []);


  useEffect(() => {
    if (searchTerm) {
      const filtered = livestreams.filter(l =>
          l.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLivestreams(filtered);
    } else {
      setFilteredLivestreams(livestreams);
    }
  }, [searchTerm, livestreams]);


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
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


  if (error) {
    return (
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-bold tracking-tight">Livestreams</h1>
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <p className="text-destructive">{error}</p>
            <Button
                variant="outline"
                className="mt-2"
                onClick={() => window.location.reload()}
            >
              Retry
            </Button>
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
            <TabsTrigger value="all">
              All Livestreams ({filteredLivestreams.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              Currently Live
              <Badge variant="outline" className="ml-2">
                {filteredLivestreams.filter(l => l.isActive).length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="ended">
              Ended ({filteredLivestreams.filter(l => !l.isActive).length})
            </TabsTrigger>
          </TabsList>


          <TabsContent value="all">
            <LivestreamsTable livestreams={filteredLivestreams} />
          </TabsContent>
          <TabsContent value="active">
            <LivestreamsTable livestreams={filteredLivestreams.filter(l => l.isActive)} />
          </TabsContent>
          <TabsContent value="ended">
            <LivestreamsTable livestreams={filteredLivestreams.filter(l => !l.isActive)} />
          </TabsContent>
        </Tabs>
      </div>
  );
}


interface LivestreamsTableProps {
  livestreams: Livestream[];
}


function LivestreamsTable({ livestreams }: LivestreamsTableProps) {
  const calculateDuration = (startedAt: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - startedAt.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));


    if (diffMinutes < 60) {
      return `${diffMinutes}m`;
    }


    const hours = Math.floor(diffMinutes / 60);
    const remainingMinutes = diffMinutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };


  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
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
              <TableHead className="hidden lg:table-cell">Max Participants</TableHead>
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
                livestreams.map((stream) => (
                    <TableRow key={stream.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="relative flex-shrink-0 h-10 w-16 overflow-hidden rounded">
                            <img
                                src={stream.thumbnailUrl}
                                alt={stream.title}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/placeholder-thumbnail.jpg';
                                }}
                            />
                            {stream.isActive && (
                                <div className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 rounded">
                                  LIVE
                                </div>
                            )}
                          </div>
                          <Link
                              href={`/dashboard/livestreams/${stream.id}`}
                              className="hover:underline line-clamp-1 text-sm"
                          >
                            {stream.title}
                          </Link>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link
                            href={`/dashboard/users/${stream.streamerId}`}
                            className="flex items-center gap-2 hover:underline"
                        >
                          <span className="text-sm">Streamer #{stream.streamerId}</span>
                        </Link>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm">
                        {formatDate(stream.startedAt)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">
                        {stream.isActive ? calculateDuration(stream.startedAt) : '-'}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">
                        <div className="flex items-center gap-1">
                          <Users size={14} />
                          <span>{stream.maxParticipants}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={stream.isActive ? "default" : "secondary"}>
                          {stream.isActive ? "Live" : "Ended"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>
  );
}



