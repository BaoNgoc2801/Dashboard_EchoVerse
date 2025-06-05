"use client";

import { useState } from 'react';
import { format } from 'date-fns';
import { Livestream } from '@/lib/data';
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
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Eye, Trash2, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserLivestreamsProps {
  livestreams: Livestream[];
}

export function UserLivestreams({ livestreams }: UserLivestreamsProps) {
  const [userLivestreams, setUserLivestreams] = useState<Livestream[]>(livestreams);
  const [selectedLivestream, setSelectedLivestream] = useState<Livestream | null>(null);
  const { toast } = useToast();

  const handleDeleteLivestream = (livestreamId: string) => {
    // In a real app, this would call an API to delete the livestream
    const updatedLivestreams = userLivestreams.filter(livestream => livestream.id !== livestreamId);
    setUserLivestreams(updatedLivestreams);
    
    toast({
      title: "Livestream deleted",
      description: "The livestream has been successfully deleted.",
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours === 0) {
      return `${remainingMinutes}m`;
    }
    
    return `${hours}h ${remainingMinutes}m`;
  };

  if (userLivestreams.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">
            This user has not created any livestreams yet.
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
              <TableHead className="hidden md:table-cell">Started</TableHead>
              <TableHead className="hidden md:table-cell">Duration</TableHead>
              <TableHead className="hidden lg:table-cell">Viewers</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userLivestreams.map((livestream) => (
              <TableRow key={livestream.id}>
                <TableCell className="font-medium">
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-left justify-start font-medium"
                    onClick={() => setSelectedLivestream(livestream)}
                  >
                    {livestream.title}
                  </Button>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {format(livestream.startedAt, 'PPp')}
                </TableCell>
                <TableCell className="hidden md:table-cell">
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
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setSelectedLivestream(livestream)}
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
                          <AlertDialogTitle>Delete Livestream</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this livestream? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteLivestream(livestream.id)}
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

      <Dialog open={!!selectedLivestream} onOpenChange={(open) => !open && setSelectedLivestream(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedLivestream?.title}</DialogTitle>
            <DialogDescription>
              Started on {selectedLivestream && format(selectedLivestream.startedAt, 'PPp')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="rounded-md overflow-hidden">
              <img 
                src={selectedLivestream?.thumbnailUrl} 
                alt={selectedLivestream?.title} 
                className="w-full h-auto object-cover"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                <Badge variant={selectedLivestream?.isActive ? "default" : "secondary"} className="mt-1">
                  {selectedLivestream?.isActive ? "Currently Live" : "Stream Ended"}
                </Badge>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Duration</h4>
                <p>{selectedLivestream && formatDuration(selectedLivestream.duration)}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Viewers</h4>
                <p>{selectedLivestream?.viewers.toLocaleString()}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  {selectedLivestream?.isActive ? "Started" : "Timeframe"}
                </h4>
                <p>
                  {selectedLivestream?.startedAt && format(selectedLivestream.startedAt, 'PPp')}
                  {selectedLivestream?.endedAt && !selectedLivestream.isActive && (
                    <> to {format(selectedLivestream.endedAt, 'PPp')}</>
                  )}
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}