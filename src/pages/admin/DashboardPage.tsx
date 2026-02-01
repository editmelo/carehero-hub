import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  ClipboardCheck, 
  Clock, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  UserPlus,
  Calendar,
  FileCheck,
  ArrowRight,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format, addDays, parseISO, isBefore, subWeeks, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

interface DashboardStats {
  totalLeads: number;
  newInquiries: number;
  pendingTasks: number;
  activeEnrollments: number;
  approvedThisMonth: number;
  serviceStartedThisMonth: number;
}

interface RecentLead {
  id: string;
  client_first_name: string;
  client_last_name: string;
  lead_status: string;
  created_at: string;
  county: string;
}

interface UpcomingTask {
  id: string;
  task_description: string;
  due_date: string;
  priority: string;
  client_lead_id: string;
}

interface PendingAssessment {
  id: string;
  client_name: string;
  county: string;
  assessment_scheduled_date: string | null;
  referral_submitted_to: string;
  loc_status: string | null;
}

interface WeeklyData {
  week: string;
  referrals: number;
  leads: number;
  approved: number;
}

interface StatusData {
  name: string;
  value: number;
  color: string;
}

export default function DashboardPage() {
  const { hasPortalAccess } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    newInquiries: 0,
    pendingTasks: 0,
    activeEnrollments: 0,
    approvedThisMonth: 0,
    serviceStartedThisMonth: 0,
  });
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<UpcomingTask[]>([]);
  const [pendingAssessments, setPendingAssessments] = useState<PendingAssessment[]>([]);
  const [weeklyTrends, setWeeklyTrends] = useState<WeeklyData[]>([]);
  const [statusDistribution, setStatusDistribution] = useState<StatusData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hasPortalAccess) {
      fetchDashboardData();
    }
  }, [hasPortalAccess]);

  const fetchDashboardData = async () => {
    try {
      // Fetch all stats in parallel
      const [
        leadsResult,
        newInquiriesResult,
        pendingTasksResult,
        activeEnrollmentsResult,
        recentLeadsResult,
        upcomingTasksResult,
        pendingAssessmentsResult,
        allLeadsResult,
        allReferralsResult,
      ] = await Promise.all([
        supabase.from('client_leads').select('id', { count: 'exact', head: true }),
        supabase.from('client_leads').select('id', { count: 'exact', head: true }).eq('lead_status', 'new_inquiry'),
        supabase.from('follow_up_tasks').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('enrollment_pipeline').select('id', { count: 'exact', head: true }),
        supabase.from('client_leads').select('id, client_first_name, client_last_name, lead_status, created_at, county').order('created_at', { ascending: false }).limit(5),
        supabase.from('follow_up_tasks').select('id, task_description, due_date, priority, client_lead_id').eq('status', 'pending').order('due_date', { ascending: true }).limit(5),
        supabase.from('internal_referral_tracking')
          .select('id, client_name, county, assessment_scheduled_date, referral_submitted_to, loc_status')
          .eq('loc_status', 'pending')
          .eq('maximus_assessment_required', true)
          .order('assessment_scheduled_date', { ascending: true }),
        supabase.from('client_leads').select('id, lead_status, created_at'),
        supabase.from('internal_referral_tracking').select('id, date_referral_submitted, loc_status'),
      ]);

      setStats({
        totalLeads: leadsResult.count || 0,
        newInquiries: newInquiriesResult.count || 0,
        pendingTasks: pendingTasksResult.count || 0,
        activeEnrollments: activeEnrollmentsResult.count || 0,
        approvedThisMonth: 0,
        serviceStartedThisMonth: 0,
      });

      if (recentLeadsResult.data) {
        setRecentLeads(recentLeadsResult.data);
      }

      if (upcomingTasksResult.data) {
        setUpcomingTasks(upcomingTasksResult.data);
      }

      if (pendingAssessmentsResult.data) {
        const now = new Date();
        const nextWeek = addDays(now, 7);
        
        const upcomingAssessments = pendingAssessmentsResult.data.filter((assessment) => {
          if (!assessment.assessment_scheduled_date) return true;
          const assessmentDate = parseISO(assessment.assessment_scheduled_date);
          return !isBefore(assessmentDate, now) && isBefore(assessmentDate, nextWeek);
        });
        
        setPendingAssessments(upcomingAssessments.slice(0, 5));
      }

      // Calculate weekly trends (last 6 weeks)
      if (allLeadsResult.data && allReferralsResult.data) {
        const trends: WeeklyData[] = [];
        const now = new Date();
        
        for (let i = 5; i >= 0; i--) {
          const weekStart = startOfWeek(subWeeks(now, i), { weekStartsOn: 0 });
          const weekEnd = endOfWeek(subWeeks(now, i), { weekStartsOn: 0 });
          
          const weekLeads = allLeadsResult.data.filter((lead) => {
            const date = new Date(lead.created_at);
            return isWithinInterval(date, { start: weekStart, end: weekEnd });
          });
          
          const weekReferrals = allReferralsResult.data.filter((ref) => {
            const date = new Date(ref.date_referral_submitted);
            return isWithinInterval(date, { start: weekStart, end: weekEnd });
          });
          
          const weekApproved = allReferralsResult.data.filter((ref) => {
            const date = new Date(ref.date_referral_submitted);
            return isWithinInterval(date, { start: weekStart, end: weekEnd }) && ref.loc_status === 'approved';
          });
          
          trends.push({
            week: format(weekStart, 'MMM d'),
            leads: weekLeads.length,
            referrals: weekReferrals.length,
            approved: weekApproved.length,
          });
        }
        
        setWeeklyTrends(trends);
      }

      // Calculate lead status distribution
      if (allLeadsResult.data) {
        const statusCounts: Record<string, number> = {};
        allLeadsResult.data.forEach((lead) => {
          statusCounts[lead.lead_status] = (statusCounts[lead.lead_status] || 0) + 1;
        });

        const statusColors: Record<string, string> = {
          new_inquiry: '#3B82F6',
          contacted: '#F59E0B',
          education_provided: '#6366F1',
          consent_pending: '#F97316',
          consent_received: '#14B8A6',
          referral_submitted: '#8B5CF6',
          assessment_scheduled: '#EC4899',
          approved: '#22C55E',
          denied: '#EF4444',
          service_started: '#10B981',
          lost_not_eligible: '#6B7280',
        };

        const distribution = Object.entries(statusCounts).map(([status, count]) => ({
          name: status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          value: count,
          color: statusColors[status] || '#6B7280',
        }));

        setStatusDistribution(distribution);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-gray-100 text-gray-800',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  if (!hasPortalAccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-heading font-bold text-foreground mb-2">Access Pending</h2>
        <p className="text-muted-foreground max-w-md">
          Your account is awaiting role assignment from an administrator.
          Please contact your supervisor for access.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-primary">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Overview of enrollment operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalLeads}</div>
              <p className="text-xs text-muted-foreground">All time client leads</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Inquiries</CardTitle>
              <UserPlus className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.newInquiries}</div>
              <p className="text-xs text-muted-foreground">Awaiting first contact</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pendingTasks}</div>
              <p className="text-xs text-muted-foreground">Follow-ups needed</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Enrollments</CardTitle>
              <ClipboardCheck className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.activeEnrollments}</div>
              <p className="text-xs text-muted-foreground">In pipeline</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Weekly Trends Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Weekly Activity Trends
            </CardTitle>
            <CardDescription>Leads and referrals over the last 6 weeks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyTrends} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="week" 
                    className="text-xs fill-muted-foreground"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    className="text-xs fill-muted-foreground"
                    tick={{ fontSize: 12 }}
                    allowDecimals={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Legend />
                  <Bar dataKey="leads" name="New Leads" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="referrals" name="Referrals" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="approved" name="Approved" fill="#22C55E" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Lead Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Lead Status Distribution
              </CardTitle>
              <CardDescription>Current breakdown of all leads by status</CardDescription>
            </CardHeader>
            <CardContent>
              {statusDistribution.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-8">
                  No lead data available yet.
                </p>
              ) : (
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        labelLine={false}
                      >
                        {statusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Tasks
              </CardTitle>
              <CardDescription>Pending follow-ups</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingTasks.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-8">
                  No pending tasks. Great job staying on top of things!
                </p>
              ) : (
                <div className="space-y-4">
                  {upcomingTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium line-clamp-1">{task.task_description}</p>
                        <p className="text-sm text-muted-foreground">
                          Due: {format(new Date(task.due_date), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Leads */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Recent Leads
              </CardTitle>
              <CardDescription>Latest client inquiries</CardDescription>
            </CardHeader>
            <CardContent>
              {recentLeads.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-8">
                  No leads yet. New inquiries will appear here.
                </p>
              ) : (
                <div className="space-y-4">
                  {recentLeads.map((lead) => (
                    <div key={lead.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium">
                          {lead.client_first_name} {lead.client_last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {lead.county} County • {format(new Date(lead.created_at), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <Badge className={getStatusColor(lead.lead_status)}>
                        {formatStatus(lead.lead_status)}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Pending Assessments This Week */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5" />
                  Assessments This Week
                </CardTitle>
                <CardDescription>Referrals pending Maximus assessment</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/referrals" className="flex items-center gap-1">
                  View All <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {pendingAssessments.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-8">
                  No assessments pending this week.
                </p>
              ) : (
                <div className="space-y-4">
                  {pendingAssessments.map((assessment) => (
                    <div key={assessment.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium">{assessment.client_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {assessment.county} County • {assessment.referral_submitted_to}
                        </p>
                      </div>
                      <div className="text-right">
                        {assessment.assessment_scheduled_date ? (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {format(parseISO(assessment.assessment_scheduled_date), 'EEE, MMM d')}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                            Not Scheduled
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
