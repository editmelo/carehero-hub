import { useEffect, useState } from 'react';
import { Plus, AlertCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { toCSV, downloadCSV, formatDateForCSV, formatStatusForCSV } from '@/lib/csv-export';
import type { Tables, Database } from '@/integrations/supabase/types';
import {
  ReferralStatsCards,
  ReferralFilters,
  ReferralTable,
  CreateReferralDialog,
  EditReferralDialog,
  ViewReferralDialog,
} from '@/components/admin/referrals';

type InternalReferral = Tables<'internal_referral_tracking'>;
type ClientLead = Tables<'client_leads'>;
type LocOutcome = Database['public']['Enums']['loc_outcome'];

export default function ReferralsPage() {
  const { hasPortalAccess, canModifyData, isAdmin, user } = useAuth();
  const { toast } = useToast();

  const [referrals, setReferrals] = useState<InternalReferral[]>([]);
  const [clients, setClients] = useState<ClientLead[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [locFilter, setLocFilter] = useState('all');
  const [agencyFilter, setAgencyFilter] = useState('all');

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState<InternalReferral | null>(null);

  useEffect(() => {
    if (hasPortalAccess) {
      fetchReferrals();
      fetchClients();
    }
  }, [hasPortalAccess]);

  const fetchReferrals = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('internal_referral_tracking')
        .select('*')
        .order('date_referral_submitted', { ascending: false });

      if (error) throw error;
      setReferrals(data || []);
    } catch (error) {
      console.error('Error fetching referrals:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch referrals',
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

  const filteredReferrals = referrals.filter((referral) => {
    // LOC status filter
    if (locFilter !== 'all' && referral.loc_status !== locFilter) return false;

    // Agency filter
    if (agencyFilter !== 'all' && referral.referral_submitted_to !== agencyFilter) return false;

    // Search filter
    if (searchQuery) {
      const search = searchQuery.toLowerCase();
      return (
        referral.client_name.toLowerCase().includes(search) ||
        referral.county.toLowerCase().includes(search) ||
        referral.confirmation_number_or_notes?.toLowerCase().includes(search)
      );
    }

    return true;
  });

  const stats = {
    total: referrals.length,
    pending: referrals.filter((r) => r.loc_status === 'pending' || !r.loc_status).length,
    approved: referrals.filter((r) => r.loc_status === 'approved').length,
    denied: referrals.filter((r) => r.loc_status === 'denied').length,
  };

  const handleCreateReferral = async (data: {
    client_lead_id?: string;
    client_name: string;
    county: string;
    date_referral_submitted: string;
    referral_submitted_to: string;
    referral_submitted_online: boolean;
    confirmation_number_or_notes?: string;
    maximus_assessment_required: boolean;
    assessment_scheduled_date?: string;
    loc_status: LocOutcome;
    client_selected_carehero?: string;
    estimated_service_start_date?: string;
    internal_notes?: string;
    screenshot_url?: string;
  }) => {
    try {
      const { error } = await supabase.from('internal_referral_tracking').insert({
        client_lead_id: data.client_lead_id || null,
        client_name: data.client_name,
        county: data.county,
        date_referral_submitted: data.date_referral_submitted,
        referral_submitted_to: data.referral_submitted_to,
        referral_submitted_online: data.referral_submitted_online,
        confirmation_number_or_notes: data.confirmation_number_or_notes || null,
        maximus_assessment_required: data.maximus_assessment_required,
        assessment_scheduled_date: data.assessment_scheduled_date || null,
        loc_status: data.loc_status,
        client_selected_carehero: data.client_selected_carehero || null,
        estimated_service_start_date: data.estimated_service_start_date || null,
        internal_notes: data.internal_notes || null,
        screenshot_url: data.screenshot_url || null,
        created_by: user?.id || null,
      });

      if (error) throw error;

      toast({
        title: 'Referral submitted',
        description: 'The referral has been recorded.',
      });
      fetchReferrals();
    } catch (error) {
      console.error('Error creating referral:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit referral',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleEditReferral = async (
    referralId: string,
    data: Partial<{
      client_name: string;
      county: string;
      date_referral_submitted: string;
      referral_submitted_to: string;
      referral_submitted_online: boolean;
      confirmation_number_or_notes: string | null;
      maximus_assessment_required: boolean;
      assessment_scheduled_date: string | null;
      loc_status: LocOutcome;
      client_selected_carehero: string | null;
      estimated_service_start_date: string | null;
      internal_notes: string | null;
      screenshot_url: string | null;
    }>
  ) => {
    try {
      const { error } = await supabase
        .from('internal_referral_tracking')
        .update(data)
        .eq('id', referralId);

      if (error) throw error;

      toast({
        title: 'Referral updated',
        description: 'The referral has been updated.',
      });
      fetchReferrals();
    } catch (error) {
      console.error('Error updating referral:', error);
      toast({
        title: 'Error',
        description: 'Failed to update referral',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleDeleteReferral = async (referralId: string) => {
    if (!isAdmin) return;

    try {
      const { error } = await supabase
        .from('internal_referral_tracking')
        .delete()
        .eq('id', referralId);

      if (error) throw error;

      toast({
        title: 'Referral deleted',
        description: 'The referral has been removed.',
      });
      fetchReferrals();
    } catch (error) {
      console.error('Error deleting referral:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete referral',
        variant: 'destructive',
      });
    }
  };

  const handleExportCSV = () => {
    try {
      const csvContent = toCSV(filteredReferrals, [
        { key: 'client_name', header: 'Client Name' },
        { key: 'county', header: 'County' },
        { key: 'referral_submitted_to', header: 'Submitted To' },
        { key: 'date_referral_submitted', header: 'Date Submitted', formatter: (v) => formatDateForCSV(v as string) },
        { key: 'referral_submitted_online', header: 'Online', formatter: (v) => v ? 'Yes' : 'No' },
        { key: 'confirmation_number_or_notes', header: 'Confirmation #' },
        { key: 'loc_status', header: 'LOC Status', formatter: (v) => formatStatusForCSV(v as string) },
        { key: 'maximus_assessment_required', header: 'Assessment Required', formatter: (v) => v ? 'Yes' : 'No' },
        { key: 'assessment_scheduled_date', header: 'Assessment Date', formatter: (v) => formatDateForCSV(v as string) },
        { key: 'client_selected_carehero', header: 'Selected CareHero' },
        { key: 'estimated_service_start_date', header: 'Est. Start Date', formatter: (v) => formatDateForCSV(v as string) },
        { key: 'internal_notes', header: 'Internal Notes' },
        { key: 'created_at', header: 'Created', formatter: (v) => formatDateForCSV(v as string) },
      ]);

      downloadCSV(csvContent, 'referrals');
      toast({
        title: 'Export successful',
        description: `Exported ${filteredReferrals.length} referrals to CSV`,
      });
    } catch (error) {
      console.error('Error exporting referrals:', error);
      toast({
        title: 'Export failed',
        description: 'Failed to export referrals to CSV',
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
          <h1 className="text-3xl font-heading font-bold text-foreground">Referral Tracking</h1>
          <p className="text-muted-foreground">Track internal Medicaid and AAA referral submissions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          {canModifyData && (
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Submit Referral
            </Button>
          )}
        </div>
      </div>

      <ReferralStatsCards stats={stats} />

      <ReferralFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        locFilter={locFilter}
        onLocChange={setLocFilter}
        agencyFilter={agencyFilter}
        onAgencyChange={setAgencyFilter}
      />

      <Card>
        <CardHeader>
          <CardTitle>
            {filteredReferrals.length} Referral{filteredReferrals.length !== 1 ? 's' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-pulse text-primary">Loading referrals...</div>
            </div>
          ) : filteredReferrals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {referrals.length === 0
                  ? 'No referrals yet. Submit your first referral.'
                  : 'No referrals match your filters.'}
              </p>
            </div>
          ) : (
            <ReferralTable
              referrals={filteredReferrals}
              canModifyData={canModifyData}
              isAdmin={isAdmin}
              onView={(referral) => {
                setSelectedReferral(referral);
                setViewDialogOpen(true);
              }}
              onEdit={(referral) => {
                setSelectedReferral(referral);
                setEditDialogOpen(true);
              }}
              onDelete={handleDeleteReferral}
            />
          )}
        </CardContent>
      </Card>

      <CreateReferralDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        clients={clients}
        onSubmit={handleCreateReferral}
      />

      <EditReferralDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        referral={selectedReferral}
        onSubmit={handleEditReferral}
      />

      <ViewReferralDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        referral={selectedReferral}
      />
    </div>
  );
}
