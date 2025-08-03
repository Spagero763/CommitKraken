'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { MoreVertical, ListTodo, Edit, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { EditCommitDialog } from './EditCommitDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


export type ScheduledCommit = {
    id: string;
    message: string;
    date: string;
    time: string;
    status: 'Scheduled' | 'Done';
};

type UpcomingCommitsTableProps = {
    scheduledCommits: ScheduledCommit[];
    onEditCommit: (commit: ScheduledCommit) => Promise<void>;
    onDeleteCommit: (commitId: string) => Promise<void>;
};

export function UpcomingCommitsTable({ scheduledCommits, onEditCommit, onDeleteCommit }: UpcomingCommitsTableProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [editingCommit, setEditingCommit] = useState<ScheduledCommit | null>(null);

  const handleDelete = async (commitId: string) => {
    setIsDeleting(commitId);
    try {
      await onDeleteCommit(commitId);
      toast({
        title: 'Commit Canceled',
        description: 'The scheduled commit has been removed.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to cancel the commit. Please try again.',
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const handleUpdate = async (updatedCommit: ScheduledCommit) => {
    try {
      await onEditCommit(updatedCommit);
      toast({
        title: 'Commit Updated',
        description: 'Your scheduled commit has been updated.',
      });
      setEditingCommit(null);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update the commit. Please try again.',
      });
    }
  };

  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
            <ListTodo className="h-6 w-6 text-primary" />
            <CardTitle>Upcoming Commits</CardTitle>
        </div>
        <CardDescription>
          A list of your scheduled and recent commits.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Commit Message</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead className="hidden md:table-cell">Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {scheduledCommits.map((commit) => (
                <TableRow key={commit.id}>
                    <TableCell className="font-medium">{commit.message}</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">{commit.date}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{commit.time}</TableCell>
                    <TableCell>
                    <Badge variant={commit.status === 'Done' ? 'outline' : 'default'} className="capitalize">
                        {commit.status.toLowerCase()}
                    </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={isDeleting === commit.id}>
                            {isDeleting === commit.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreVertical className="h-4 w-4" />}
                            <span className="sr-only">Actions</span>
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem onSelect={() => setEditingCommit(commit)}>
                              <Edit className='mr-2' />
                              Edit
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <Trash2 className='mr-2 text-destructive' />
                                  <span className='text-destructive'>Cancel</span>
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently cancel your scheduled commit.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Back</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(commit.id)}>Continue</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </div>
        {scheduledCommits.length === 0 && (
            <div className="text-center p-8 text-muted-foreground">
                You have no scheduled commits yet.
            </div>
        )}
      </CardContent>
    </Card>
    {editingCommit && (
        <EditCommitDialog
            commit={editingCommit}
            isOpen={!!editingCommit}
            onClose={() => setEditingCommit(null)}
            onUpdate={handleUpdate}
        />
    )}
    </>
  );
}
