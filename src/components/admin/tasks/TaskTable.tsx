import { format, isToday, isPast } from 'date-fns';
import { MoreHorizontal, Eye, Edit, Trash2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Tables, Database } from '@/integrations/supabase/types';

type FollowUpTask = Tables<'follow_up_tasks'> & {
  client_leads?: {
    client_first_name: string;
    client_last_name: string;
    phone_number?: string;
    email?: string | null;
  } | null;
};

interface TaskTableProps {
  tasks: FollowUpTask[];
  canModifyData: boolean;
  isAdmin: boolean;
  onView: (task: FollowUpTask) => void;
  onEdit: (task: FollowUpTask) => void;
  onComplete: (task: FollowUpTask) => void;
  onDelete: (taskId: string) => void;
}

const formatTaskType = (type: string) => {
  return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

const getPriorityColor = (priority: string) => {
  const colors: Record<string, string> = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800',
  };
  return colors[priority] || 'bg-gray-100 text-gray-800';
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    escalated: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

const getDueDateStyle = (dueDate: string, status: string) => {
  if (status === 'completed') return 'text-muted-foreground';
  const date = new Date(dueDate);
  if (isPast(date) && !isToday(date)) return 'text-red-600 font-medium';
  if (isToday(date)) return 'text-orange-600 font-medium';
  return '';
};

export function TaskTable({
  tasks,
  canModifyData,
  isAdmin,
  onView,
  onEdit,
  onComplete,
  onDelete,
}: TaskTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell className="max-w-[200px]">
                <p className="truncate font-medium">{task.task_description}</p>
              </TableCell>
              <TableCell>
                {task.client_leads ? (
                  `${task.client_leads.client_first_name} ${task.client_leads.client_last_name}`
                ) : (
                  <span className="text-muted-foreground">Unknown</span>
                )}
              </TableCell>
              <TableCell>
                <span className="text-sm">{formatTaskType(task.task_type)}</span>
              </TableCell>
              <TableCell>
                <Badge className={getPriorityColor(task.priority)}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(task.status)}>
                  {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                <span className={getDueDateStyle(task.due_date, task.status)}>
                  {format(new Date(task.due_date), 'MMM d, yyyy')}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onView(task)}>
                      <Eye className="h-4 w-4 mr-2" /> View Details
                    </DropdownMenuItem>
                    {canModifyData && task.status !== 'completed' && (
                      <>
                        <DropdownMenuItem onClick={() => onEdit(task)}>
                          <Edit className="h-4 w-4 mr-2" /> Edit Task
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onComplete(task)}>
                          <CheckCircle className="h-4 w-4 mr-2" /> Mark Complete
                        </DropdownMenuItem>
                      </>
                    )}
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => onDelete(task.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
