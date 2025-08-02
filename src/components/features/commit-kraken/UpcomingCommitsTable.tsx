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
import { MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type ScheduledCommit = {
    message: string;
    date: string;
    time: string;
    status: 'Scheduled' | 'Done';
};

type UpcomingCommitsTableProps = {
    scheduledCommits: ScheduledCommit[];
};

export function UpcomingCommitsTable({ scheduledCommits }: UpcomingCommitsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Commits</CardTitle>
        <CardDescription>
          A list of your scheduled and recent commits.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
            {scheduledCommits.map((commit, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{commit.message}</TableCell>
                <TableCell className="hidden sm:table-cell">{commit.date}</TableCell>
                <TableCell className="hidden md:table-cell">{commit.time}</TableCell>
                <TableCell>
                  <Badge variant={commit.status === 'Done' ? 'secondary' : 'default'}>
                    {commit.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Cancel</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
