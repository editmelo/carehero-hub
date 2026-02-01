import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Check, X, FileImage } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Tables } from '@/integrations/supabase/types';

type InternalReferral = Tables<'internal_referral_tracking'>;

interface ViewReferralDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  referral: InternalReferral | null;
}

const getLocColor = (status: string | null) => {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    denied: 'bg-red-100 text-red-800',
  };
  return colors[status || 'pending'] || 'bg-gray-100 text-gray-800';
};

const formatLocStatus = (status: string | null) => {
  if (!status) return 'Pending';
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const formatCareHeroStatus = (status: string | null) => {
  if (!status) return 'Not set';
  const map: Record<string, string> = {
    yes: 'Yes',
    no: 'No',
    pending: 'Pending',
  };
  return map[status.toLowerCase()] || status;
};

export function ViewReferralDialog({ open, onOpenChange, referral }: ViewReferralDialogProps) {
  if (!referral) return null;

  const isImageUrl = (url: string | null) => {
    if (!url) return false;
    return url.match(/\.(jpg|jpeg|png|gif|webp)$/i);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Referral Details</DialogTitle>
          <DialogDescription>Full information about this referral submission</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Client Name</p>
              <p className="font-medium">{referral.client_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">County</p>
              <p>{referral.county}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Submitted To</p>
              <div className="flex items-center gap-1">
                {referral.referral_submitted_to}
                {referral.referral_submitted_online && (
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                )}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date Submitted</p>
              <p>{format(new Date(referral.date_referral_submitted), 'MMMM d, yyyy')}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Confirmation Number</p>
            <p className="font-mono">{referral.confirmation_number_or_notes || 'Not provided'}</p>
          </div>

          {/* Screenshot Display */}
          {referral.screenshot_url && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Screenshot / Confirmation</p>
              {isImageUrl(referral.screenshot_url) ? (
                <a
                  href={referral.screenshot_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <img
                    src={referral.screenshot_url}
                    alt="Referral confirmation"
                    className="max-h-48 rounded border hover:opacity-90 transition-opacity"
                  />
                </a>
              ) : (
                <a
                  href={referral.screenshot_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <FileImage className="h-5 w-5" />
                  View uploaded file
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          )}

          <div className="p-4 border rounded-lg bg-muted/50 space-y-3">
            <h4 className="font-medium">Assessment Status</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Maximus Required</p>
                <div className="flex items-center gap-1">
                  {referral.maximus_assessment_required ? (
                    <>
                      <Check className="h-4 w-4 text-green-600" /> Yes
                    </>
                  ) : (
                    <>
                      <X className="h-4 w-4 text-muted-foreground" /> No
                    </>
                  )}
                </div>
              </div>
              {referral.maximus_assessment_required && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Assessment Date</p>
                  <p>
                    {referral.assessment_scheduled_date
                      ? format(new Date(referral.assessment_scheduled_date), 'MMMM d, yyyy')
                      : 'Not scheduled'}
                  </p>
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">LOC Status</p>
              <Badge className={getLocColor(referral.loc_status)}>
                {formatLocStatus(referral.loc_status)}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Client Selected CareHero?</p>
              <p>{formatCareHeroStatus(referral.client_selected_carehero)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Est. Service Start</p>
              <p>
                {referral.estimated_service_start_date
                  ? format(new Date(referral.estimated_service_start_date), 'MMMM d, yyyy')
                  : 'Not set'}
              </p>
            </div>
          </div>

          {referral.internal_notes && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Internal Notes</p>
              <p className="whitespace-pre-wrap">{referral.internal_notes}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Created</p>
              <p>{format(new Date(referral.created_at), 'PPpp')}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
              <p>{format(new Date(referral.updated_at), 'PPpp')}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
