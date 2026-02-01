import { useEffect, useState } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { format, isToday } from 'date-fns';
import type { Tables, Database } from '@/integrations/supabase/types';
import { TaskFilters } from '@/components/admin/tasks/TaskFilters';
import { TaskStatsCards } from '@/components/admin/tasks/TaskStatsCards';
import { TaskTable } from '@/components/admin/tasks/TaskTable';
import { CreateTaskDialog } from '@/components/admin/tasks/CreateTaskDialog';
import { EditTaskDialog } from '@/components/admin/tasks/EditTaskDialog';
import { ViewTaskDialog } from '@/components/admin/tasks/ViewTaskDialog';

type FollowUpTask = Tables<'follow_up_tasks'> & {
  client_leads?: {
    client_first_name: string;
    client_last_name: string;
    phone_number?: string;
    email?: string | null;
  } | null;
};

type ClientLead = Tables<'client_leads'>;
type TaskType = Database['public']['Enums']['task_type'];
type TaskPriority = Database['public']['Enums']['task_priority'];
type TaskStatus = Database['public']['Enums']['task_status'];

export default function TasksPage() {
  const { hasPortalAccess, canModifyData, isAdmin } = useAuth();
  const { toast } = useToast();

  const [tasks, setTasks] = useState<FollowUpTask[]>([]);
  const [clients, setClients] = useState<ClientLead[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<FollowUpTask | null>(null);

  useEffect(() => {
    if (hasPortalAccess) {
      fetchTasks();
      fetchClients();
    }
  }, [hasPortalAccess]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('follow_up_tasks')
        .select(`
          *,
          client_leads (
            client_first_name,
            client_last_name,
            phone_number,
            email
          )
        `)
        .order('due_date', { ascending: true });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch tasks',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('client_leads')
        .select('*')
        .order('client_last_name', { ascending: true });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    // Status filter
    if (statusFilter !== 'all' && task.status !== statusFilter) return false;

    // Priority filter
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

    // Search filter
    if (searchQuery) {
      const search = searchQuery.toLowerCase();
      const clientName = task.client_leads
        ? `${task.client_leads.client_first_name} ${task.client_leads.client_last_name}`.toLowerCase()
        : '';
      return (
        task.task_description.toLowerCase().includes(search) ||
        clientName.includes(search)
      );
    }

    return true;
  });

  const stats = {
    pending: tasks.filter((t) => t.status === 'pending').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    escalated: tasks.filter((t) => t.status === 'escalated').length,
    dueToday: tasks.filter((t) => isToday(new Date(t.due_date)) && t.status !== 'completed').length,
  };

  const handleCreateTask = async (data: {
    client_lead_id: string;
    task_type: TaskType;
    task_description: string;
    due_date: string;
    priority: TaskPriority;
    notes?: string;
  }) => {
    try {
      const { error } = await supabase.from('follow_up_tasks').insert({
        client_lead_id: data.client_lead_id,
        task_type: data.task_type,
        task_description: data.task_description,
        due_date: data.due_date,
        priority: data.priority,
        notes: data.notes || null,
      });

      if (error) throw error;

      toast({
        title: 'Task created',
        description: 'The follow-up task has been added.',
      });
      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: 'Error',
        description: 'Failed to create task',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleEditTask = async (
    taskId: string,
    data: {
      task_type: TaskType;
      task_description: string;
      due_date: string;
      priority: TaskPriority;
      status: TaskStatus;
      notes?: string;
    }
  ) => {
    try {
      const updateData: Record<string, unknown> = {
        task_type: data.task_type,
        task_description: data.task_description,
        due_date: data.due_date,
        priority: data.priority,
        status: data.status,
        notes: data.notes || null,
      };

      // Set completed_date if status changed to completed
      if (data.status === 'completed') {
        updateData.completed_date = format(new Date(), 'yyyy-MM-dd');
      } else {
        updateData.completed_date = null;
      }

      const { error } = await supabase
        .from('follow_up_tasks')
        .update(updateData)
        .eq('id', taskId);

      if (error) throw error;

      toast({
        title: 'Task updated',
        description: 'The task has been updated.',
      });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: 'Error',
        description: 'Failed to update task',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleCompleteTask = async (task: FollowUpTask) => {
    try {
      const { error } = await supabase
        .from('follow_up_tasks')
        .update({
          status: 'completed' as TaskStatus,
          completed_date: format(new Date(), 'yyyy-MM-dd'),
        })
        .eq('id', task.id);

      if (error) throw error;

      toast({
        title: 'Task completed',
        description: 'The task has been marked as complete.',
      });
      fetchTasks();
    } catch (error) {
      console.error('Error completing task:', error);
      toast({
        title: 'Error',
        description: 'Failed to complete task',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!isAdmin) return;

    try {
      const { error } = await supabase.from('follow_up_tasks').delete().eq('id', taskId);

      if (error) throw error;

      toast({
        title: 'Task deleted',
        description: 'The task has been removed.',
      });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete task',
        variant: 'destructive',
      });
    }
  };

  if (!hasPortalAccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-heading font-bold text-foreground mb-2">Access Denied</h2>
        <p className="text-muted-foreground">You don't have access to this section.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Follow-up Tasks</h1>
          <p className="text-muted-foreground">Manage client follow-ups and action items</p>
        </div>
        {canModifyData && (
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        )}
      </div>

      <TaskStatsCards stats={stats} />

      <TaskFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityChange={setPriorityFilter}
      />

      <Card>
        <CardHeader>
          <CardTitle>
            {filteredTasks.length} Task{filteredTasks.length !== 1 ? 's' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-pulse text-primary">Loading tasks...</div>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {tasks.length === 0
                  ? 'No tasks yet. Create your first follow-up task.'
                  : 'No tasks match your filters.'}
              </p>
            </div>
          ) : (
            <TaskTable
              tasks={filteredTasks}
              canModifyData={canModifyData}
              isAdmin={isAdmin}
              onView={(task) => {
                setSelectedTask(task);
                setViewDialogOpen(true);
              }}
              onEdit={(task) => {
                setSelectedTask(task);
                setEditDialogOpen(true);
              }}
              onComplete={handleCompleteTask}
              onDelete={handleDeleteTask}
            />
          )}
        </CardContent>
      </Card>

      <CreateTaskDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        clients={clients}
        onSubmit={handleCreateTask}
      />

      <EditTaskDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        task={selectedTask}
        onSubmit={handleEditTask}
      />

      <ViewTaskDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        task={selectedTask}
      />
    </div>
  );
}
