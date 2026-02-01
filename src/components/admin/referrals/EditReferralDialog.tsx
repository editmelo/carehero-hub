import { useState, useEffect } from 'react';
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

type InternalReferral = Tables<'internal_referral_tracking'>;
type LocOutcome = Database['public']['Enums']['loc_outcome'];

interface EditReferralDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  referral: InternalReferral | null;
  onSubmit: (
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
    }>
  ) => Promise<void>;
}

const agencies = ['CICOA', 'LifeStream', 'REAL Services', 'Area 10', 'Other'];

export function EditReferralDialog({
  open,
  onOpenChange,
  referral,
  onSubmit,
}: EditReferralDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    client_name: '',
    county: '',
    date_referral_submitted: '',
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

  useEffect(() => {
    if (referral) {
      setFormData({
        client_name: referral.client_name,
        county: referral.county,
        date_referral_submitted: referral.date_referral_submitted,
        referral_submitted_to: referral.referral_submitted_to,
        referral_submitted_online: referral.referral_submitted_online,
        confirmation_number_or_notes: referral.confirmation_number_or_notes || '',
        maximus_assessment_required: referral.maximus_assessment_required,
        assessment_scheduled_date: referral.assessment_scheduled_date || '',
        loc_status: referral.loc_status || 'pending',
        client_selected_carehero: referral.client_selected_carehero || '',
        estimated_service_start_date: referral.estimated_service_start_date || '',
        internal_notes: referral.internal_notes || '',
      });
    }
  }, [referral]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referral) return;
    setLoading(true);
    try {
      await onSubmit(referral.id, {
        ...formData,
        confirmation_number_or_notes: formData.confirmation_number_or_notes || null,
        assessment_scheduled_date: formData.assessment_scheduled_date || null,
        client_selected_carehero: formData.client_selected_carehero || null,
        estimated_service_start_date: formData.estimated_service_start_date || null,
        internal_notes: formData.internal_notes || null,
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
          <DialogTitle>Edit Referral</DialogTitle>
          <DialogDescription>Update referral information</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client_name">Client Name</Label>
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
              <Label htmlFor="county">County</Label>
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
              <Label htmlFor="agency">Submitted To</Label>
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
              <Label htmlFor="date_submitted">Date Submitted</Label>
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
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
