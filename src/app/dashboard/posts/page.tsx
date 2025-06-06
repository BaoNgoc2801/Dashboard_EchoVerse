"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {  Search, X } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useImages } from "@/hooks/useImages";
import { ImageItem } from "@/service/post.service";
import { ImageDetail } from "@/service/post.service";
import { fetchImageDetail, fetchComments } from "@/service/post.service";

function useImageDetails(ids: string[]) {
  const [detailsMap, setDetailsMap] = useState<Record<string, ImageDetail>>({});
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const fetchedIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const newDetails: Record<string, ImageDetail> = {};
      const newComments: Record<string, number> = {};
      const newIds = ids.filter((id) => !fetchedIdsRef.current.has(id));

      await Promise.all(
          newIds.map(async (id) => {
            try {
              const detail = await fetchImageDetail(id);
              const comments = await fetchComments(id);
              if (detail) newDetails[id] = detail;
              newComments[id] = comments.length;
              fetchedIdsRef.current.add(id);
            } catch (err) {
              console.error(`❌ Failed to fetch data for ID ${id}:`, err);
            }
          })
      );

      setDetailsMap((prev) => ({ ...prev, ...newDetails }));
      setCommentCounts((prev) => ({ ...prev, ...newComments }));
      setLoading(false);
    };

    if (ids.length > 0) {
      fetchAll();
    }
  }, [ids.join(",")]);

  return { detailsMap, commentCounts, loading };
}

export default function PostsPage() {
  const { streams, loading } = useImages();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStreams, setFilteredStreams] = useState<ImageItem[]>([]);

  useEffect(() => {
    setFilteredStreams(streams);
  }, [streams]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = streams.filter((stream) =>
          stream.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStreams(filtered);
    } else {
      setFilteredStreams(streams);
    }
  }, [searchTerm, streams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const uniqueIds = Array.from(new Set(filteredStreams.map((s) => s.id)));
  const { detailsMap: imageDetailsMap, commentCounts, loading: detailLoading } = useImageDetails(uniqueIds);

  if (loading) {
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
            <PostsTable posts={filteredStreams} imageDetails={imageDetailsMap} commentCounts={commentCounts} loadingDetails={detailLoading} />
          </TabsContent>

          <TabsContent value="withImage">
            <PostsTable
                posts={filteredStreams.filter((p) => p.url)}
                imageDetails={imageDetailsMap}
                commentCounts={commentCounts}
                loadingDetails={detailLoading}
            />
          </TabsContent>

          <TabsContent value="textOnly">
            <PostsTable
                posts={filteredStreams.filter((p) => !p.url)}
                imageDetails={imageDetailsMap}
                commentCounts={commentCounts}
                loadingDetails={detailLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
  );
}

interface PostsTableProps {
  posts: ImageItem[];
  imageDetails: Record<string, ImageDetail>;
  commentCounts: Record<string, number>;
  loadingDetails: boolean;
}

function PostsTable({ posts, imageDetails, loadingDetails }: PostsTableProps) {
  return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Creator</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
                    No posts found.
                  </TableCell>
                </TableRow>
            ) : (
                posts.map((post) => {
                  const detail = imageDetails[post.id];
                  return (
                      <TableRow key={post.id} className="group">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            {post.url && (
                                <div className="relative flex-shrink-0 h-10 w-16 overflow-hidden rounded">
                                  <img
                                      src={post.url}
                                      alt={post.title}
                                      className="h-full w-full object-cover"
                                  />
                                </div>
                            )}
                            <div>
                              <Link
                                  href={`/dashboard/posts/image-detail/${post.id}`}
                                  className="font-medium hover:underline line-clamp-1"
                              >
                                {post.title}
                              </Link>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {loadingDetails ? (
                              <span className="text-muted-foreground text-xs">Loading...</span>
                          ) : (
                              <span>{detail?.creator?.name || post.creatorId}</span>
                          )}
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
