import { motion } from 'framer-motion';
import { Settings, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

export default function SettingsPage() {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-heading font-bold text-foreground mb-2">Admin Only</h2>
        <p className="text-muted-foreground">
          Only administrators can access settings.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Configure portal settings and integrations</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings Coming Soon
          </CardTitle>
          <CardDescription>
            Portal configuration options will be available here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This feature is under development. Check back soon for webhook settings, 
            notification preferences, and more.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
