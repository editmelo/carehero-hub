import { useState } from 'react';
import { Trash2, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type LeadStatus = Database['public']['Enums']['lead_status'];

const statusOptions: { value: LeadStatus; label: string }[] = [
  { value: 'new_inquiry', label: 'New Inquiry' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'education_provided', label: 'Education Provided' },
  { value: 'consent_pending', label: 'Consent Pending' },
  { value: 'consent_received', label: 'Consent Received' },
  { value: 'referral_submitted', label: 'Referral Submitted' },
  { value: 'assessment_scheduled', label: 'Assessment Scheduled' },
  { value: 'approved', label: 'Approved' },
  { value: 'denied', label: 'Denied' },
  { value: 'service_started', label: 'Service Started' },
  { value: 'lost_not_eligible', label: 'Lost / Not Eligible' },
];

interface BulkActionsBarProps {
  selectedCount: number;
  selectedIds: string[];
  onClearSelection: () => void;
  onSuccess: () => void;
  canModifyData: boolean;
  isAdmin: boolean;
}

export function BulkActionsBar({
  selectedCount,
  selectedIds,
  onClearSelection,
  onSuccess,
  canModifyData,
  isAdmin,
}: BulkActionsBarProps) {
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<LeadStatus | ''>('');
  const [loading, setLoading] = useState(false);

  const handleBulkStatusUpdate = async () => {
    if (!newStatus || selectedIds.length === 0) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('client_leads')
        .update({ lead_status: newStatus })
        .in('id', selectedIds);

      if (error) throw error;

      toast({
        title: 'Status updated',
        description: `Updated ${selectedIds.length} lead(s) to "${statusOptions.find(s => s.value === newStatus)?.label}"`,
      });
      setStatusDialogOpen(false);
      setNewStatus('');
      onClearSelection();
      onSuccess();
    } catch (error) {
      console.error('Error updating leads:', error);
      toast({
        title: 'Error',
        description: 'Failed to update lead statuses',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('client_leads')
        .delete()
        .in('id', selectedIds);

      if (error) throw error;

      toast({
        title: 'Leads deleted',
        description: `Deleted ${selectedIds.length} lead(s)`,
      });
      setDeleteDialogOpen(false);
      onClearSelection();
      onSuccess();
    } catch (error) {
      console.error('Error deleting leads:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete leads',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (selectedCount === 0) return null;

  return (
    <>
      <div className="flex items-center gap-4 p-4 bg-muted/50 border rounded-lg mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {selectedCount} lead{selectedCount !== 1 ? 's' : ''} selected
          </span>
          <Button variant="ghost" size="sm" onClick={onClearSelection}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {canModifyData && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStatusDialogOpen(true)}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Update Status
            </Button>
          )}

          {isAdmin && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected
            </Button>
          )}
        </div>
      </div>

      {/* Bulk Status Update Dialog */}
      <AlertDialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Lead Status</AlertDialogTitle>
            <AlertDialogDescription>
              Change the status for {selectedCount} selected lead{selectedCount !== 1 ? 's' : ''}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Select value={newStatus} onValueChange={(value) => setNewStatus(value as LeadStatus)}>
              <SelectTrigger>
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkStatusUpdate}
              disabled={!newStatus || loading}
            >
              {loading ? 'Updating...' : 'Update Status'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Selected Leads</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedCount} lead{selectedCount !== 1 ? 's' : ''}?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              disabled={loading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading ? 'Deleting...' : 'Delete All'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
