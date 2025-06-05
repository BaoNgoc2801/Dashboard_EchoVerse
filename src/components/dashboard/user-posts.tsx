"use client";

import { useState } from 'react';
import { format } from 'date-fns';
import { Post } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Eye, Heart, MessageSquare, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserPostsProps {
  posts: Post[];
}

export function UserPosts({ posts }: UserPostsProps) {
  const [userPosts, setUserPosts] = useState<Post[]>(posts);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const { toast } = useToast();

  const handleDeletePost = (postId: string) => {
    // In a real app, this would call an API to delete the post
    const updatedPosts = userPosts.filter(post => post.id !== postId);
    setUserPosts(updatedPosts);
    
    toast({
      title: "Post deleted",
      description: "The post has been successfully deleted.",
    });
  };

  if (userPosts.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">
            This user has not created any posts yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Created</TableHead>
              <TableHead className="hidden lg:table-cell">Engagement</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userPosts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-left justify-start font-medium"
                    onClick={() => setSelectedPost(post)}
                  >
                    {post.title}
                  </Button>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {format(post.createdAt, 'PPP')}
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
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setSelectedPost(post)}
                    >
                      <Eye size={16} />
                      <span className="sr-only">View</span>
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 size={16} className="text-destructive" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Post</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this post? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeletePost(post.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={!!selectedPost} onOpenChange={(open) => !open && setSelectedPost(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedPost?.title}</DialogTitle>
            <DialogDescription>
              Posted on {selectedPost && format(selectedPost.createdAt, 'PPP')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedPost?.imageUrl && (
              <div className="rounded-md overflow-hidden">
                <img 
                  src={selectedPost.imageUrl} 
                  alt={selectedPost.title} 
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
            
            <p className="text-sm leading-relaxed">
              {selectedPost?.content}
            </p>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Heart size={14} />
                <span>{selectedPost?.likes} likes</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare size={14} />
                <span>{selectedPost?.comments} comments</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}