import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

export default function PipelinePage() {
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
        <h1 className="text-3xl font-heading font-bold text-foreground">Enrollment Pipeline</h1>
        <p className="text-muted-foreground">Track Medicaid enrollment progress for each client</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Pipeline Coming Soon
          </CardTitle>
          <CardDescription>
            The enrollment pipeline view will show CICOA referrals, Maximus assessments, and LOC outcomes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This feature is under development. Check back soon for a complete enrollment tracking view.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
