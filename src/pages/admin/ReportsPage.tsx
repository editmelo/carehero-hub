import { useEffect, useState } from 'react';
import { AlertCircle, FileText, TrendingUp, Clock, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format, startOfWeek, endOfWeek, subWeeks, isWithinInterval } from 'date-fns';
import type { Tables } from '@/integrations/supabase/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type InternalReferral = Tables<'internal_referral_tracking'>;

interface WeeklySummary {
  weekStart: Date;
  weekEnd: Date;
  total: number;
  pending: number;
  approved: number;
  denied: number;
  referrals: InternalReferral[];
}

export default function ReportsPage() {
  const { hasPortalAccess } = useAuth();
  const [referrals, setReferrals] = useState<InternalReferral[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState('0');

  useEffect(() => {
    if (hasPortalAccess) {
      fetchReferrals();
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
    } finally {
      setLoading(false);
    }
  };

  const getWeeklyData = (weeksAgo: number): WeeklySummary => {
    const now = new Date();
    const targetWeekStart = startOfWeek(subWeeks(now, weeksAgo), { weekStartsOn: 0 });
    const targetWeekEnd = endOfWeek(subWeeks(now, weeksAgo), { weekStartsOn: 0 });

    const weekReferrals = referrals.filter((r) => {
      const submitDate = new Date(r.date_referral_submitted);
      return isWithinInterval(submitDate, { start: targetWeekStart, end: targetWeekEnd });
    });

    return {
      weekStart: targetWeekStart,
      weekEnd: targetWeekEnd,
      total: weekReferrals.length,
      pending: weekReferrals.filter((r) => r.loc_status === 'pending' || !r.loc_status).length,
      approved: weekReferrals.filter((r) => r.loc_status === 'approved').length,
      denied: weekReferrals.filter((r) => r.loc_status === 'denied').length,
      referrals: weekReferrals,
    };
  };

  const weeklyData = getWeeklyData(parseInt(selectedWeek));

  const getLocBadge = (status: string | null) => {
    const config: Record<string, { className: string; label: string }> = {
      pending: { className: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      approved: { className: 'bg-green-100 text-green-800', label: 'Approved' },
      denied: { className: 'bg-red-100 text-red-800', label: 'Denied' },
    };
    const { className, label } = config[status || 'pending'] || config.pending;
    return <Badge className={className}>{label}</Badge>;
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
          <h1 className="text-3xl font-heading font-bold text-foreground">Weekly Reports</h1>
          <p className="text-muted-foreground">Summary of referral activity by week</p>
        </div>
        <Select value={selectedWeek} onValueChange={setSelectedWeek}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select week" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">This Week</SelectItem>
            <SelectItem value="1">Last Week</SelectItem>
            <SelectItem value="2">2 Weeks Ago</SelectItem>
            <SelectItem value="3">3 Weeks Ago</SelectItem>
            <SelectItem value="4">4 Weeks Ago</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">
              Week of {format(weeklyData.weekStart, 'MMM d')} - {format(weeklyData.weekEnd, 'MMM d, yyyy')}
            </CardTitle>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Submitted
            </CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{weeklyData.total}</div>
            <p className="text-xs text-muted-foreground">Referrals this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending LOC
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{weeklyData.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting determination</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Approved
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{weeklyData.approved}</div>
            <p className="text-xs text-muted-foreground">LOC approved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Denied
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{weeklyData.denied}</div>
            <p className="text-xs text-muted-foreground">LOC denied</p>
          </CardContent>
        </Card>
      </div>

      {weeklyData.total > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Approval Rate
            </CardTitle>
            <CardDescription>Based on completed determinations</CardDescription>
          </CardHeader>
          <CardContent>
            {weeklyData.approved + weeklyData.denied > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-600">
                    {Math.round((weeklyData.approved / (weeklyData.approved + weeklyData.denied)) * 100)}%
                  </span>
                  <span className="text-muted-foreground text-sm">
                    {weeklyData.approved} of {weeklyData.approved + weeklyData.denied} determinations
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className="bg-green-600 h-3 rounded-full transition-all"
                    style={{
                      width: `${(weeklyData.approved / (weeklyData.approved + weeklyData.denied)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No LOC determinations yet this week</p>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Referral Details</CardTitle>
          <CardDescription>
            All referrals submitted during this week
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-pulse text-primary">Loading...</div>
            </div>
          ) : weeklyData.referrals.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No referrals submitted during this week</p>
            </div>
          ) : (
            <div className="space-y-3">
              {weeklyData.referrals.map((referral) => (
                <div
                  key={referral.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{referral.client_name}</span>
                      {getLocBadge(referral.loc_status)}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {referral.county} • {referral.referral_submitted_to} •{' '}
                      {format(new Date(referral.date_referral_submitted), 'MMM d, yyyy')}
                    </div>
                  </div>
                  {referral.confirmation_number_or_notes && (
                    <span className="font-mono text-sm text-muted-foreground">
                      {referral.confirmation_number_or_notes}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
