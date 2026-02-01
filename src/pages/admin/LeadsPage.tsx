import { useEffect, useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Phone, 
  Mail, 
  MapPin,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { CreateLeadDialog, EditLeadDialog } from '@/components/admin/leads';
import type { Tables, Database } from '@/integrations/supabase/types';

type ClientLead = Tables<'client_leads'>;

const leadStatuses = [
  { value: 'all', label: 'All Statuses' },
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

export default function LeadsPage() {
  const { hasPortalAccess, canModifyData, isAdmin } = useAuth();
  const { toast } = useToast();
  const [leads, setLeads] = useState<ClientLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState<ClientLead | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    if (hasPortalAccess) {
      fetchLeads();
    }
  }, [hasPortalAccess, currentPage, statusFilter]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('client_leads')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);

      if (statusFilter !== 'all') {
        query = query.eq('lead_status', statusFilter as Database['public']['Enums']['lead_status']);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      setLeads(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch client leads',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      lead.client_first_name.toLowerCase().includes(search) ||
      lead.client_last_name.toLowerCase().includes(search) ||
      lead.phone_number.includes(search) ||
      lead.email?.toLowerCase().includes(search) ||
      lead.county.toLowerCase().includes(search)
    );
  });

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new_inquiry: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      education_provided: 'bg-indigo-100 text-indigo-800',
      consent_pending: 'bg-orange-100 text-orange-800',
      consent_received: 'bg-teal-100 text-teal-800',
      referral_submitted: 'bg-purple-100 text-purple-800',
      assessment_scheduled: 'bg-pink-100 text-pink-800',
      approved: 'bg-green-100 text-green-800',
      denied: 'bg-red-100 text-red-800',
      service_started: 'bg-emerald-100 text-emerald-800',
      lost_not_eligible: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!isAdmin) return;

    try {
      const { error } = await supabase
        .from('client_leads')
        .delete()
        .eq('id', leadId);

      if (error) throw error;

      toast({
        title: 'Lead deleted',
        description: 'The client lead has been removed.',
      });
      fetchLeads();
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete lead',
        variant: 'destructive',
      });
    }
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  if (!hasPortalAccess) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">You don't have access to this section.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Client Leads</h1>
          <p className="text-muted-foreground">Manage and track all client inquiries</p>
        </div>
        {canModifyData && (
          <CreateLeadDialog onSuccess={fetchLeads} />
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, phone, email, or county..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {leadStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {totalCount} Lead{totalCount !== 1 ? 's' : ''} Found
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-pulse text-primary">Loading leads...</div>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No leads found matching your criteria.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>County</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">
                          {lead.client_first_name} {lead.client_last_name}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <span className="flex items-center gap-1 text-sm">
                              <Phone className="h-3 w-3" /> {lead.phone_number}
                            </span>
                            {lead.email && (
                              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Mail className="h-3 w-3" /> {lead.email}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {lead.county}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(lead.lead_status)}>
                            {formatStatus(lead.lead_status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm capitalize">
                            {lead.referral_source.replace(/_/g, ' ')}
                          </span>
                        </TableCell>
                        <TableCell>
                          {format(new Date(lead.created_at), 'MMM d, yyyy')}
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
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedLead(lead);
                                  setViewDialogOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" /> View Details
                              </DropdownMenuItem>
                              {canModifyData && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedLead(lead);
                                    setEditDialogOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4 mr-2" /> Edit Lead
                                </DropdownMenuItem>
                              )}
                              {isAdmin && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => handleDeleteLead(lead.id)}
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                    {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} leads
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* View Lead Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
            <DialogDescription>
              Full information about this client lead
            </DialogDescription>
          </DialogHeader>
          {selectedLead && (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                  <p className="font-medium">
                    {selectedLead.client_first_name} {selectedLead.client_last_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge className={getStatusColor(selectedLead.lead_status)}>
                    {formatStatus(selectedLead.lead_status)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p>{selectedLead.phone_number}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p>{selectedLead.email || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">County</p>
                  <p>{selectedLead.county}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">City</p>
                  <p>{selectedLead.city || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Insurance Status</p>
                  <p className="capitalize">{selectedLead.insurance_status.replace(/_/g, ' ')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Initial Need</p>
                  <p className="capitalize">{selectedLead.initial_need.replace(/_/g, ' ')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Contact Type</p>
                  <p className="capitalize">{selectedLead.contact_type.replace(/_/g, ' ')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Referral Source</p>
                  <p className="capitalize">{selectedLead.referral_source.replace(/_/g, ' ')}</p>
                </div>
              </div>
              {selectedLead.home_address && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Home Address</p>
                  <p>{selectedLead.home_address}</p>
                </div>
              )}
              {selectedLead.notes && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Notes</p>
                  <p className="whitespace-pre-wrap">{selectedLead.notes}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created</p>
                  <p>{format(new Date(selectedLead.created_at), 'PPpp')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                  <p>{format(new Date(selectedLead.updated_at), 'PPpp')}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Lead Dialog */}
      <EditLeadDialog
        lead={selectedLead}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={fetchLeads}
      />
    </div>
  );
}
