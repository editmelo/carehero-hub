import { format } from 'date-fns';
import { MoreHorizontal, Eye, Edit, Trash2, ExternalLink, Calendar } from 'lucide-react';
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
import type { Tables } from '@/integrations/supabase/types';

type InternalReferral = Tables<'internal_referral_tracking'>;

interface ReferralTableProps {
  referrals: InternalReferral[];
  canModifyData: boolean;
  isAdmin: boolean;
  onView: (referral: InternalReferral) => void;
  onEdit: (referral: InternalReferral) => void;
  onDelete: (referralId: string) => void;
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

export function ReferralTable({
  referrals,
  canModifyData,
  isAdmin,
  onView,
  onEdit,
  onDelete,
}: ReferralTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>County</TableHead>
            <TableHead>Submitted To</TableHead>
            <TableHead>Date Submitted</TableHead>
            <TableHead>Confirmation #</TableHead>
            <TableHead>LOC Status</TableHead>
            <TableHead>Assessment</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {referrals.map((referral) => (
            <TableRow key={referral.id}>
              <TableCell className="font-medium">{referral.client_name}</TableCell>
              <TableCell>{referral.county}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {referral.referral_submitted_to}
                  {referral.referral_submitted_online && (
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  )}
                </div>
              </TableCell>
              <TableCell>
                {format(new Date(referral.date_referral_submitted), 'MMM d, yyyy')}
              </TableCell>
              <TableCell>
                <span className="font-mono text-sm">
                  {referral.confirmation_number_or_notes || '—'}
                </span>
              </TableCell>
              <TableCell>
                <Badge className={getLocColor(referral.loc_status)}>
                  {formatLocStatus(referral.loc_status)}
                </Badge>
              </TableCell>
              <TableCell>
                {referral.maximus_assessment_required ? (
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar className="h-3 w-3" />
                    {referral.assessment_scheduled_date
                      ? format(new Date(referral.assessment_scheduled_date), 'MMM d')
                      : 'Pending'}
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">N/A</span>
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
                    <DropdownMenuItem onClick={() => onView(referral)}>
                      <Eye className="h-4 w-4 mr-2" /> View Details
                    </DropdownMenuItem>
                    {canModifyData && (
                      <DropdownMenuItem onClick={() => onEdit(referral)}>
                        <Edit className="h-4 w-4 mr-2" /> Edit Referral
                      </DropdownMenuItem>
                    )}
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => onDelete(referral.id)}
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
