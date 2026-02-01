import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Tables } from '@/integrations/supabase/types';

type FollowUpTask = Tables<'follow_up_tasks'> & {
  client_leads?: {
    client_first_name: string;
    client_last_name: string;
    phone_number?: string;
    email?: string | null;
  } | null;
};

interface ViewTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: FollowUpTask | null;
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

export function ViewTaskDialog({ open, onOpenChange, task }: ViewTaskDialogProps) {
  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Task Details</DialogTitle>
          <DialogDescription>Full information about this task</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Client</p>
              <p className="font-medium">
                {task.client_leads
                  ? `${task.client_leads.client_first_name} ${task.client_leads.client_last_name}`
                  : 'Unknown'}
              </p>
              {task.client_leads?.phone_number && (
                <p className="text-sm text-muted-foreground">{task.client_leads.phone_number}</p>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Task Type</p>
              <p>{formatTaskType(task.task_type)}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Description</p>
            <p>{task.task_description}</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Priority</p>
              <Badge className={getPriorityColor(task.priority)}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge className={getStatusColor(task.status)}>
                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Due Date</p>
              <p>{format(new Date(task.due_date), 'MMM d, yyyy')}</p>
            </div>
          </div>

          {task.notes && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Notes</p>
              <p className="whitespace-pre-wrap">{task.notes}</p>
            </div>
          )}

          {task.completed_date && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Completed Date</p>
              <p>{format(new Date(task.completed_date), 'MMM d, yyyy')}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Created</p>
              <p>{format(new Date(task.created_at), 'PPpp')}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
              <p>{format(new Date(task.updated_at), 'PPpp')}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
