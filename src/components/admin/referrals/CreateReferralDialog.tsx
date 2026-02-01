import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Tables, Database } from '@/integrations/supabase/types';

type ClientLead = Tables<'client_leads'>;
type LocOutcome = Database['public']['Enums']['loc_outcome'];

interface CreateReferralDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clients: ClientLead[];
  onSubmit: (data: {
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
  }) => Promise<void>;
}

const agencies = ['CICOA', 'LifeStream', 'REAL Services', 'Area 10', 'Other'];

export function CreateReferralDialog({
  open,
  onOpenChange,
  clients,
  onSubmit,
}: CreateReferralDialogProps) {
  const [loading, setLoading] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [formData, setFormData] = useState({
    client_name: '',
    county: '',
    date_referral_submitted: new Date().toISOString().split('T')[0],
    referral_submitted_to: 'CICOA',
    referral_submitted_online: true,
    confirmation_number_or_notes: '',
    maximus_assessment_required: false,
    assessment_scheduled_date: '',
    loc_status: 'pending' as LocOutcome,
    client_selected_carehero: '',
    estimated_service_start_date: '',
    internal_notes: '',
  });

  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId);
    const client = clients.find((c) => c.id === clientId);
    if (client) {
      setFormData((prev) => ({
        ...prev,
        client_name: `${client.client_first_name} ${client.client_last_name}`,
        county: client.county,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        client_lead_id: selectedClientId || undefined,
        ...formData,
        confirmation_number_or_notes: formData.confirmation_number_or_notes || undefined,
        assessment_scheduled_date: formData.assessment_scheduled_date || undefined,
        client_selected_carehero: formData.client_selected_carehero || undefined,
        estimated_service_start_date: formData.estimated_service_start_date || undefined,
        internal_notes: formData.internal_notes || undefined,
      });
      // Reset form
      setSelectedClientId('');
      setFormData({
        client_name: '',
        county: '',
        date_referral_submitted: new Date().toISOString().split('T')[0],
        referral_submitted_to: 'CICOA',
        referral_submitted_online: true,
        confirmation_number_or_notes: '',
        maximus_assessment_required: false,
        assessment_scheduled_date: '',
        loc_status: 'pending',
        client_selected_carehero: '',
        estimated_service_start_date: '',
        internal_notes: '',
      });
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit New Referral</DialogTitle>
          <DialogDescription>
            Record a referral submission to CICOA or another agency
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Link to Client (Optional)</Label>
            <Select value={selectedClientId} onValueChange={handleClientSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select existing client..." />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.client_first_name} {client.client_last_name} - {client.county}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client_name">Client Name *</Label>
              <Input
                id="client_name"
                value={formData.client_name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, client_name: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="county">County *</Label>
              <Input
                id="county"
                value={formData.county}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, county: e.target.value }))
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="agency">Submitted To *</Label>
              <Select
                value={formData.referral_submitted_to}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, referral_submitted_to: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {agencies.map((agency) => (
                    <SelectItem key={agency} value={agency}>
                      {agency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date_submitted">Date Submitted *</Label>
              <Input
                id="date_submitted"
                type="date"
                value={formData.date_referral_submitted}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, date_referral_submitted: e.target.value }))
                }
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="online"
              checked={formData.referral_submitted_online}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, referral_submitted_online: checked as boolean }))
              }
            />
            <Label htmlFor="online">Submitted via online portal</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmation">Confirmation Number / Notes</Label>
            <Input
              id="confirmation"
              value={formData.confirmation_number_or_notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, confirmation_number_or_notes: e.target.value }))
              }
              placeholder="e.g., REF-2024-12345"
            />
          </div>

          <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
            <h4 className="font-medium">Assessment Information</h4>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="maximus"
                checked={formData.maximus_assessment_required}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, maximus_assessment_required: checked as boolean }))
                }
              />
              <Label htmlFor="maximus">Maximus assessment required</Label>
            </div>

            {formData.maximus_assessment_required && (
              <div className="space-y-2">
                <Label htmlFor="assessment_date">Assessment Scheduled Date</Label>
                <Input
                  id="assessment_date"
                  type="date"
                  value={formData.assessment_scheduled_date}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, assessment_scheduled_date: e.target.value }))
                  }
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="loc_status">LOC Status</Label>
              <Select
                value={formData.loc_status}
                onValueChange={(value: LocOutcome) =>
                  setFormData((prev) => ({ ...prev, loc_status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="denied">Denied</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="carehero">Selected CareHero</Label>
              <Input
                id="carehero"
                value={formData.client_selected_carehero}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, client_selected_carehero: e.target.value }))
                }
                placeholder="Provider name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="start_date">Est. Service Start</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.estimated_service_start_date}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, estimated_service_start_date: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Internal Notes</Label>
            <Textarea
              id="notes"
              value={formData.internal_notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, internal_notes: e.target.value }))
              }
              placeholder="Any additional notes..."
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.client_name || !formData.county}
            >
              {loading ? 'Submitting...' : 'Submit Referral'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
