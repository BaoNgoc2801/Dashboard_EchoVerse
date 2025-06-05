"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { 
  getUserById, 
  getPostsByUserId, 
  getLivestreamsByUserId, 
  User,
  Post,
  Livestream
} from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserLivestreams } from '@/components/dashboard/user-livestreams';
import { UserPosts } from '@/components/dashboard/user-posts';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ArrowLeft, FileText, Trash2, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function UserDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [livestreams, setLivestreams] = useState<Livestream[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const userData = getUserById(id as string);
      if (userData) {
        setUser(userData);
        setPosts(getPostsByUserId(id as string));
        setLivestreams(getLivestreamsByUserId(id as string));
      }
      setIsLoading(false);
    }, 800);
  }, [id]);

  const handleDeleteUser = () => {
    // In a real app, this would call an API to delete the user
    toast({
      title: "User deleted",
      description: "The user has been successfully deleted.",
    });
    
    router.push('/dashboard/users');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="flex items-center gap-2">
          <div className="h-10 w-20 rounded-md bg-muted"></div>
          <div className="h-8 w-48 rounded-md bg-muted"></div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-40 rounded-lg bg-muted"></div>
          <div className="h-40 rounded-lg bg-muted"></div>
        </div>
        <div className="h-10 w-full max-w-xs rounded-md bg-muted"></div>
        <div className="h-[400px] w-full rounded-lg bg-muted"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The user you are looking for does not exist or has been deleted.
        </p>
        <Button onClick={() => router.push('/dashboard/users')}>
          Return to Users
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => router.push('/dashboard/users')}
          >
            <ArrowLeft size={18} />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">User Details</h1>
        </div>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" className="gap-1">
              <Trash2 size={16} />
              Delete User
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will permanently delete the user &quot;{user.channelName}&quot; and all associated data.
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteUser}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar} alt={user.channelName} />
              <AvatarFallback className="text-lg">
                {user.firstName.charAt(0)}
                {user.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{user.channelName}</CardTitle>
              <CardDescription>
                {user.firstName} {user.middleName ? `${user.middleName} ` : ''}{user.lastName}
              </CardDescription>
              <Badge variant={user.isActive ? "default" : "secondary"} className="mt-1">
                {user.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                <p>{user.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Created At</h3>
                <p>{format(user.createdAt, 'PPP')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Content Statistics</CardTitle>
            <CardDescription>
              Overview of user content and engagement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Total Posts</span>
              </div>
              <span className="text-2xl font-bold">{user.totalPosts}</span>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Total Livestreams</span>
              </div>
              <span className="text-2xl font-bold">{user.totalLivestreams}</span>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Content Distribution</h3>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary" 
                  style={{ 
                    width: `${Math.round((user.totalPosts / (user.totalPosts + user.totalLivestreams)) * 100)}%` 
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Posts</span>
                <span>Livestreams</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="livestreams">Livestreams</TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts">
          <UserPosts posts={posts} />
        </TabsContent>
        
        <TabsContent value="livestreams">
          <UserLivestreams livestreams={livestreams} />
        </TabsContent>
      </Tabs>
    </div>
  );
}