import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ClipboardList, 
  AlertCircle, 
  Search, 
  Filter,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  FileCheck,
  Building2,
  Stethoscope,
  ChevronRight,
  Edit,
  Eye,
  Plus,
  MoreHorizontal
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import type { Tables, Database } from '@/integrations/supabase/types';

type EnrollmentPipeline = Tables<'enrollment_pipeline'>;
type ClientLead = Tables<'client_leads'>;
type LocOutcome = Database['public']['Enums']['loc_outcome'];
type MceAssigned = Database['public']['Enums']['mce_assigned'];

interface PipelineWithClient extends EnrollmentPipeline {
  client_leads: ClientLead | null;
}

const locOutcomeColors: Record<LocOutcome, string> = {
  approved: 'bg-green-100 text-green-800',
  denied: 'bg-red-100 text-red-800',
  pending: 'bg-yellow-100 text-yellow-800',
};

const mceLabels: Record<MceAssigned, string> = {
  anthem: 'Anthem',
  humana: 'Humana',
  unitedhealthcare: 'UnitedHealthcare',
};

export default function PipelinePage() {
  const { hasPortalAccess, canModifyData } = useAuth();
  const { toast } = useToast();
  const [pipelines, setPipelines] = useState<PipelineWithClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [locFilter, setLocFilter] = useState('all');
  const [selectedPipeline, setSelectedPipeline] = useState<PipelineWithClient | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pendingConsent: 0,
    awaitingReferral: 0,
    assessmentScheduled: 0,
    approved: 0,
  });

  useEffect(() => {
    if (hasPortalAccess) {
      fetchPipelines();
    }
  }, [hasPortalAccess]);

  const fetchPipelines = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('enrollment_pipeline')
        .select(`
          *,
          client_leads (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const pipelineData = (data || []) as PipelineWithClient[];
      setPipelines(pipelineData);

      // Calculate stats
      const total = pipelineData.length;
      const pendingConsent = pipelineData.filter(p => !p.consent_signed).length;
      const awaitingReferral = pipelineData.filter(p => p.consent_signed && !p.cicoa_referral_submitted).length;
      const assessmentScheduled = pipelineData.filter(p => p.maximus_scheduled_date && !p.maximus_completed_date).length;
      const approved = pipelineData.filter(p => p.loc_outcome === 'approved').length;

      setStats({ total, pendingConsent, awaitingReferral, assessmentScheduled, approved });
    } catch (error) {
      console.error('Error fetching pipelines:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch enrollment pipeline data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredPipelines = pipelines.filter((pipeline) => {
    const client = pipeline.client_leads;
    const matchesSearch = !searchQuery || (
      client?.client_first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client?.client_last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pipeline.cicoa_confirmation_number?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const matchesLoc = locFilter === 'all' || pipeline.loc_outcome === locFilter;
    return matchesSearch && matchesLoc;
  });

  const calculateProgress = (pipeline: PipelineWithClient): number => {
    let progress = 0;
    if (pipeline.consent_signed) progress += 20;
    if (pipeline.cicoa_referral_submitted) progress += 20;
    if (pipeline.maximus_scheduled_date) progress += 15;
    if (pipeline.maximus_completed_date) progress += 15;
    if (pipeline.loc_outcome === 'approved') progress += 20;
    if (pipeline.carehero_start_date) progress += 10;
    return progress;
  };

  const getStageLabel = (pipeline: PipelineWithClient): string => {
    if (pipeline.carehero_start_date) return 'Service Started';
    if (pipeline.loc_outcome === 'approved') return 'Approved';
    if (pipeline.loc_outcome === 'denied') return 'Denied';
    if (pipeline.maximus_completed_date) return 'Assessment Complete';
    if (pipeline.maximus_scheduled_date) return 'Assessment Scheduled';
    if (pipeline.cicoa_referral_submitted) return 'Referral Submitted';
    if (pipeline.consent_signed) return 'Consent Received';
    return 'Pending Consent';
  };

  const getStageColor = (stage: string): string => {
    const colors: Record<string, string> = {
      'Service Started': 'bg-emerald-100 text-emerald-800',
      'Approved': 'bg-green-100 text-green-800',
      'Denied': 'bg-red-100 text-red-800',
      'Assessment Complete': 'bg-blue-100 text-blue-800',
      'Assessment Scheduled': 'bg-indigo-100 text-indigo-800',
      'Referral Submitted': 'bg-purple-100 text-purple-800',
      'Consent Received': 'bg-teal-100 text-teal-800',
      'Pending Consent': 'bg-orange-100 text-orange-800',
    };
    return colors[stage] || 'bg-gray-100 text-gray-800';
  };

  const handleUpdatePipeline = async (pipelineId: string, updates: Partial<EnrollmentPipeline>) => {
    try {
      const { error } = await supabase
        .from('enrollment_pipeline')
        .update(updates)
        .eq('id', pipelineId);

      if (error) throw error;

      toast({
        title: 'Updated',
        description: 'Pipeline record has been updated.',
      });
      fetchPipelines();
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating pipeline:', error);
      toast({
        title: 'Error',
        description: 'Failed to update pipeline record',
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
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">Enrollment Pipeline</h1>
        <p className="text-muted-foreground">Track Medicaid enrollment progress for each client</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total in Pipeline</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Consent</CardTitle>
              <FileCheck className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pendingConsent}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Awaiting Referral</CardTitle>
              <Building2 className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.awaitingReferral}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assessment Scheduled</CardTitle>
              <Stethoscope className="h-4 w-4 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600">{stats.assessmentScheduled}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by client name or confirmation number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={locFilter} onValueChange={setLocFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by LOC" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Outcomes</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="denied">Denied</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Pipeline Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            {filteredPipelines.length} Enrollment{filteredPipelines.length !== 1 ? 's' : ''} in Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-pulse text-primary">Loading pipeline data...</div>
            </div>
          ) : filteredPipelines.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No enrollments in the pipeline yet.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Pipeline records are created when clients provide consent.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>CICOA Referral</TableHead>
                    <TableHead>Maximus Assessment</TableHead>
                    <TableHead>LOC Outcome</TableHead>
                    <TableHead>MCE</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPipelines.map((pipeline) => {
                    const client = pipeline.client_leads;
                    const stage = getStageLabel(pipeline);
                    const progress = calculateProgress(pipeline);

                    return (
                      <TableRow key={pipeline.id}>
                        <TableCell className="font-medium">
                          {client ? (
                            <div>
                              <p>{client.client_first_name} {client.client_last_name}</p>
                              <p className="text-sm text-muted-foreground">{client.county} County</p>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Unknown Client</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStageColor(stage)}>{stage}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="w-24">
                            <Progress value={progress} className="h-2" />
                            <span className="text-xs text-muted-foreground">{progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {pipeline.cicoa_referral_submitted ? (
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle2 className="h-4 w-4" />
                              <span className="text-sm">
                                {pipeline.cicoa_submission_date && format(new Date(pipeline.cicoa_submission_date), 'MMM d')}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span className="text-sm">Pending</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {pipeline.maximus_assessment_required ? (
                            pipeline.maximus_completed_date ? (
                              <div className="flex items-center gap-1 text-green-600">
                                <CheckCircle2 className="h-4 w-4" />
                                <span className="text-sm">Completed</span>
                              </div>
                            ) : pipeline.maximus_scheduled_date ? (
                              <div className="flex items-center gap-1 text-indigo-600">
                                <Calendar className="h-4 w-4" />
                                <span className="text-sm">
                                  {format(new Date(pipeline.maximus_scheduled_date), 'MMM d')}
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-orange-600">
                                <Clock className="h-4 w-4" />
                                <span className="text-sm">Needs Scheduling</span>
                              </div>
                            )
                          ) : (
                            <span className="text-sm text-muted-foreground">Not Required</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {pipeline.loc_outcome ? (
                            <Badge className={locOutcomeColors[pipeline.loc_outcome]}>
                              {pipeline.loc_outcome.charAt(0).toUpperCase() + pipeline.loc_outcome.slice(1)}
                            </Badge>
                          ) : (
                            <span className="text-sm text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {pipeline.mce_assigned ? (
                            <span className="text-sm">{mceLabels[pipeline.mce_assigned]}</span>
                          ) : (
                            <span className="text-sm text-muted-foreground">—</span>
                          )}
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
                                  setSelectedPipeline(pipeline);
                                  setViewDialogOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" /> View Details
                              </DropdownMenuItem>
                              {canModifyData && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedPipeline(pipeline);
                                    setEditDialogOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4 mr-2" /> Edit Pipeline
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Enrollment Details</DialogTitle>
            <DialogDescription>
              Complete enrollment pipeline information
            </DialogDescription>
          </DialogHeader>
          {selectedPipeline && (
            <div className="space-y-6">
              {/* Client Info */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Client Information</h4>
                {selectedPipeline.client_leads ? (
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name:</span>{' '}
                      {selectedPipeline.client_leads.client_first_name} {selectedPipeline.client_leads.client_last_name}
                    </div>
                    <div>
                      <span className="text-muted-foreground">County:</span>{' '}
                      {selectedPipeline.client_leads.county}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Phone:</span>{' '}
                      {selectedPipeline.client_leads.phone_number}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Insurance:</span>{' '}
                      {selectedPipeline.client_leads.insurance_status.replace(/_/g, ' ')}
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Client information not available</p>
                )}
              </div>

              {/* Consent Section */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <FileCheck className="h-4 w-4" /> Consent Status
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Signed:</span>{' '}
                    {selectedPipeline.consent_signed ? (
                      <Badge className="bg-green-100 text-green-800">Yes</Badge>
                    ) : (
                      <Badge variant="outline">No</Badge>
                    )}
                  </div>
                  {selectedPipeline.consent_date && (
                    <div>
                      <span className="text-muted-foreground">Date:</span>{' '}
                      {format(new Date(selectedPipeline.consent_date), 'PPP')}
                    </div>
                  )}
                </div>
              </div>

              {/* CICOA Referral */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Building2 className="h-4 w-4" /> CICOA Referral
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Submitted:</span>{' '}
                    {selectedPipeline.cicoa_referral_submitted ? (
                      <Badge className="bg-green-100 text-green-800">Yes</Badge>
                    ) : (
                      <Badge variant="outline">No</Badge>
                    )}
                  </div>
                  {selectedPipeline.cicoa_submission_date && (
                    <div>
                      <span className="text-muted-foreground">Submission Date:</span>{' '}
                      {format(new Date(selectedPipeline.cicoa_submission_date), 'PPP')}
                    </div>
                  )}
                  {selectedPipeline.cicoa_confirmation_number && (
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Confirmation #:</span>{' '}
                      <code className="bg-muted px-2 py-1 rounded">{selectedPipeline.cicoa_confirmation_number}</code>
                    </div>
                  )}
                </div>
              </div>

              {/* Maximus Assessment */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Stethoscope className="h-4 w-4" /> Maximus Assessment
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Required:</span>{' '}
                    {selectedPipeline.maximus_assessment_required ? (
                      <Badge className="bg-blue-100 text-blue-800">Yes</Badge>
                    ) : (
                      <Badge variant="outline">No</Badge>
                    )}
                  </div>
                  {selectedPipeline.maximus_scheduled_date && (
                    <div>
                      <span className="text-muted-foreground">Scheduled:</span>{' '}
                      {format(new Date(selectedPipeline.maximus_scheduled_date), 'PPP')}
                    </div>
                  )}
                  {selectedPipeline.maximus_completed_date && (
                    <div>
                      <span className="text-muted-foreground">Completed:</span>{' '}
                      {format(new Date(selectedPipeline.maximus_completed_date), 'PPP')}
                    </div>
                  )}
                </div>
              </div>

              {/* LOC & MCE */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> Approval & Assignment
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">LOC Outcome:</span>{' '}
                    {selectedPipeline.loc_outcome ? (
                      <Badge className={locOutcomeColors[selectedPipeline.loc_outcome]}>
                        {selectedPipeline.loc_outcome.charAt(0).toUpperCase() + selectedPipeline.loc_outcome.slice(1)}
                      </Badge>
                    ) : (
                      <span>Pending</span>
                    )}
                  </div>
                  <div>
                    <span className="text-muted-foreground">MCE Assigned:</span>{' '}
                    {selectedPipeline.mce_assigned ? mceLabels[selectedPipeline.mce_assigned] : 'Not assigned'}
                  </div>
                  {selectedPipeline.medicaid_effective_date && (
                    <div>
                      <span className="text-muted-foreground">Medicaid Effective:</span>{' '}
                      {format(new Date(selectedPipeline.medicaid_effective_date), 'PPP')}
                    </div>
                  )}
                  {selectedPipeline.carehero_start_date && (
                    <div>
                      <span className="text-muted-foreground">CareHero Start:</span>{' '}
                      {format(new Date(selectedPipeline.carehero_start_date), 'PPP')}
                    </div>
                  )}
                </div>
                {selectedPipeline.approved_services && (
                  <div className="mt-3">
                    <span className="text-muted-foreground text-sm">Approved Services:</span>
                    <p className="mt-1">{selectedPipeline.approved_services}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <PipelineEditDialog
        pipeline={selectedPipeline}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleUpdatePipeline}
      />
    </div>
  );
}

interface PipelineEditDialogProps {
  pipeline: PipelineWithClient | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, updates: Partial<EnrollmentPipeline>) => void;
}

function PipelineEditDialog({ pipeline, open, onOpenChange, onSave }: PipelineEditDialogProps) {
  const [formData, setFormData] = useState({
    consent_signed: false,
    consent_date: '',
    cicoa_referral_submitted: false,
    cicoa_submission_date: '',
    cicoa_confirmation_number: '',
    maximus_assessment_required: false,
    maximus_scheduled_date: '',
    maximus_completed_date: '',
    loc_outcome: '' as LocOutcome | '',
    mce_assigned: '' as MceAssigned | '',
    medicaid_effective_date: '',
    carehero_start_date: '',
    approved_services: '',
  });

  useEffect(() => {
    if (pipeline) {
      setFormData({
        consent_signed: pipeline.consent_signed,
        consent_date: pipeline.consent_date || '',
        cicoa_referral_submitted: pipeline.cicoa_referral_submitted,
        cicoa_submission_date: pipeline.cicoa_submission_date || '',
        cicoa_confirmation_number: pipeline.cicoa_confirmation_number || '',
        maximus_assessment_required: pipeline.maximus_assessment_required,
        maximus_scheduled_date: pipeline.maximus_scheduled_date || '',
        maximus_completed_date: pipeline.maximus_completed_date || '',
        loc_outcome: pipeline.loc_outcome || '',
        mce_assigned: pipeline.mce_assigned || '',
        medicaid_effective_date: pipeline.medicaid_effective_date || '',
        carehero_start_date: pipeline.carehero_start_date || '',
        approved_services: pipeline.approved_services || '',
      });
    }
  }, [pipeline]);

  const handleSubmit = () => {
    if (!pipeline) return;

    const updates: Partial<EnrollmentPipeline> = {
      consent_signed: formData.consent_signed,
      consent_date: formData.consent_date || null,
      cicoa_referral_submitted: formData.cicoa_referral_submitted,
      cicoa_submission_date: formData.cicoa_submission_date || null,
      cicoa_confirmation_number: formData.cicoa_confirmation_number || null,
      maximus_assessment_required: formData.maximus_assessment_required,
      maximus_scheduled_date: formData.maximus_scheduled_date || null,
      maximus_completed_date: formData.maximus_completed_date || null,
      loc_outcome: formData.loc_outcome as LocOutcome || null,
      mce_assigned: formData.mce_assigned as MceAssigned || null,
      medicaid_effective_date: formData.medicaid_effective_date || null,
      carehero_start_date: formData.carehero_start_date || null,
      approved_services: formData.approved_services || null,
    };

    onSave(pipeline.id, updates);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Enrollment Pipeline</DialogTitle>
          <DialogDescription>
            Update the enrollment status and tracking information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Consent */}
          <div className="space-y-3">
            <h4 className="font-semibold">Consent</h4>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="consent_signed"
                checked={formData.consent_signed}
                onCheckedChange={(checked) => setFormData({ ...formData, consent_signed: !!checked })}
              />
              <Label htmlFor="consent_signed">Consent Signed</Label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="consent_date">Consent Date</Label>
                <Input
                  id="consent_date"
                  type="date"
                  value={formData.consent_date}
                  onChange={(e) => setFormData({ ...formData, consent_date: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* CICOA Referral */}
          <div className="space-y-3">
            <h4 className="font-semibold">CICOA Referral</h4>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="cicoa_submitted"
                checked={formData.cicoa_referral_submitted}
                onCheckedChange={(checked) => setFormData({ ...formData, cicoa_referral_submitted: !!checked })}
              />
              <Label htmlFor="cicoa_submitted">Referral Submitted</Label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cicoa_date">Submission Date</Label>
                <Input
                  id="cicoa_date"
                  type="date"
                  value={formData.cicoa_submission_date}
                  onChange={(e) => setFormData({ ...formData, cicoa_submission_date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="cicoa_confirm">Confirmation Number</Label>
                <Input
                  id="cicoa_confirm"
                  value={formData.cicoa_confirmation_number}
                  onChange={(e) => setFormData({ ...formData, cicoa_confirmation_number: e.target.value })}
                  placeholder="CICOA-XXXXX"
                />
              </div>
            </div>
          </div>

          {/* Maximus Assessment */}
          <div className="space-y-3">
            <h4 className="font-semibold">Maximus Assessment</h4>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="maximus_required"
                checked={formData.maximus_assessment_required}
                onCheckedChange={(checked) => setFormData({ ...formData, maximus_assessment_required: !!checked })}
              />
              <Label htmlFor="maximus_required">Assessment Required</Label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="maximus_scheduled">Scheduled Date</Label>
                <Input
                  id="maximus_scheduled"
                  type="date"
                  value={formData.maximus_scheduled_date}
                  onChange={(e) => setFormData({ ...formData, maximus_scheduled_date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="maximus_completed">Completed Date</Label>
                <Input
                  id="maximus_completed"
                  type="date"
                  value={formData.maximus_completed_date}
                  onChange={(e) => setFormData({ ...formData, maximus_completed_date: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* LOC & MCE */}
          <div className="space-y-3">
            <h4 className="font-semibold">Approval & Assignment</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="loc_outcome">LOC Outcome</Label>
                <Select
                  value={formData.loc_outcome}
                  onValueChange={(value) => setFormData({ ...formData, loc_outcome: value as LocOutcome })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select outcome" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="denied">Denied</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="mce_assigned">MCE Assigned</Label>
                <Select
                  value={formData.mce_assigned}
                  onValueChange={(value) => setFormData({ ...formData, mce_assigned: value as MceAssigned })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select MCE" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="anthem">Anthem</SelectItem>
                    <SelectItem value="humana">Humana</SelectItem>
                    <SelectItem value="unitedhealthcare">UnitedHealthcare</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="medicaid_effective">Medicaid Effective Date</Label>
                <Input
                  id="medicaid_effective"
                  type="date"
                  value={formData.medicaid_effective_date}
                  onChange={(e) => setFormData({ ...formData, medicaid_effective_date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="carehero_start">CareHero Start Date</Label>
                <Input
                  id="carehero_start"
                  type="date"
                  value={formData.carehero_start_date}
                  onChange={(e) => setFormData({ ...formData, carehero_start_date: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="approved_services">Approved Services</Label>
              <Input
                id="approved_services"
                value={formData.approved_services}
                onChange={(e) => setFormData({ ...formData, approved_services: e.target.value })}
                placeholder="e.g., Personal Care, Attendant Care"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
