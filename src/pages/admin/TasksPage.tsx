import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

export default function TasksPage() {
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
        <h1 className="text-3xl font-heading font-bold text-foreground">Follow-up Tasks</h1>
        <p className="text-muted-foreground">Manage client follow-ups and action items</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Tasks Coming Soon
          </CardTitle>
          <CardDescription>
            The task management view will allow you to create, assign, and track follow-up tasks.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This feature is under development. Check back soon for complete task management.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
