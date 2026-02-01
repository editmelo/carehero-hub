import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

export default function ReferralsPage() {
  const { hasPortalAccess } = useAuth();

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
        <h1 className="text-3xl font-heading font-bold text-foreground">Referral Tracking</h1>
        <p className="text-muted-foreground">Track internal Medicaid and AAA referral submissions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Referral Tracking Coming Soon
          </CardTitle>
          <CardDescription>
            This view will track referrals submitted to CICOA and other agencies.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This feature is under development. Check back soon for complete referral tracking.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
