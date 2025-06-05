export type User = {
  id: string;
  channelName: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  createdAt: Date;
  avatar: string;
  totalPosts: number;
  totalLivestreams: number;
  isActive: boolean;
};

export type Post = {
  id: string;
  userId: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: Date;
  likes: number;
  comments: number;
};

export type Livestream = {
  id: string;
  userId: string;
  title: string;
  thumbnailUrl: string;
  startedAt: Date;
  endedAt?: Date;
  duration: number; // in minutes
  viewers: number;
  isActive: boolean;
};

// Mock data for the dashboard
export const users: User[] = Array.from({ length: 50 }, (_, i) => ({
  id: `user-${i + 1}`,
  channelName: `Channel${i + 1}`,
  firstName: ['John', 'Jane', 'Robert', 'Sarah', 'Michael', 'Emma', 'David', 'Olivia'][i % 8],
  middleName: i % 3 === 0 ? ['Lee', 'Marie', 'John', 'Anne'][i % 4] : undefined,
  lastName: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Wilson'][i % 8],
  email: `user${i + 1}@example.com`,
  createdAt: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000),
  avatar: `https://i.pravatar.cc/150?img=${i + 1}`,
  totalPosts: Math.floor(Math.random() * 50),
  totalLivestreams: Math.floor(Math.random() * 20),
  isActive: Math.random() > 0.2,
}));

export const posts: Post[] = Array.from({ length: 120 }, (_, i) => {
  const userId = `user-${Math.floor(Math.random() * 50) + 1}`;
  return {
    id: `post-${i + 1}`,
    userId,
    title: `Post Title ${i + 1}`,
    content: `This is the content of post ${i + 1}. It can contain text and possibly links to images or other media.`,
    imageUrl: i % 3 === 0 ? `https://picsum.photos/id/${(i % 30) + 1}/500/300` : undefined,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000),
    likes: Math.floor(Math.random() * 1000),
    comments: Math.floor(Math.random() * 50),
  };
});

export const livestreams: Livestream[] = Array.from({ length: 80 }, (_, i) => {
  const userId = `user-${Math.floor(Math.random() * 50) + 1}`;
  const startedAt = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000);
  const duration = Math.floor(Math.random() * 180) + 15; // 15 to 195 minutes
  const isActive = i % 10 === 0;
  
  return {
    id: `livestream-${i + 1}`,
    userId,
    title: `Livestream Title ${i + 1}`,
    thumbnailUrl: `https://picsum.photos/id/${(i % 50) + 30}/500/300`,
    startedAt,
    endedAt: isActive ? undefined : new Date(startedAt.getTime() + duration * 60 * 1000),
    duration,
    viewers: Math.floor(Math.random() * 5000),
    isActive,
  };
});

// Aggregated stats for dashboard
export const getDashboardStats = () => {
  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.isActive).length;
  const totalPosts = posts.length;
  const totalLivestreams = livestreams.length;
  const activeLivestreams = livestreams.filter(stream => stream.isActive).length;
  
  // Get posts per day for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();
  
  const postsPerDay = last7Days.map(day => {
    const count = posts.filter(post => {
      const postDate = post.createdAt.toISOString().split('T')[0];
      return postDate === day;
    }).length;
    return { date: day, count };
  });
  
  // Get livestreams per day for the last 7 days
  const livestreamsPerDay = last7Days.map(day => {
    const count = livestreams.filter(stream => {
      const streamDate = stream.startedAt.toISOString().split('T')[0];
      return streamDate === day;
    }).length;
    return { date: day, count };
  });

  return {
    totalUsers,
    activeUsers,
    totalPosts,
    totalLivestreams,
    activeLivestreams,
    postsPerDay,
    livestreamsPerDay,
  };
};

// Get user by id
export const getUserById = (id: string) => {
  return users.find(user => user.id === id);
};

// Get posts by user id
export const getPostsByUserId = (userId: string) => {
  return posts.filter(post => post.userId === userId);
};

// Get livestreams by user id
export const getLivestreamsByUserId = (userId: string) => {
  return livestreams.filter(stream => stream.userId === userId);
};