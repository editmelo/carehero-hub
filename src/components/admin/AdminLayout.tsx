import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from './AdminSidebar';
import { useAuth } from '@/hooks/useAuth';
import { Menu } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useLocation } from 'react-router-dom';

const routeLabels: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/leads': 'Client Leads',
  '/admin/pipeline': 'Enrollment Pipeline',
  '/admin/tasks': 'Follow-up Tasks',
  '/admin/referrals': 'Referral Tracking',
  '/admin/users': 'User Management',
  '/admin/settings': 'Settings',
};

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, hasPortalAccess } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!loading && user && !hasPortalAccess) {
      // User is logged in but doesn't have portal access
      // They can still view the portal but with limited functionality
    }
  }, [loading, user, hasPortalAccess]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const currentPath = location.pathname;
  const pageTitle = routeLabels[currentPath] || 'Admin';

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
            <SidebarTrigger className="-ml-1">
              <Menu className="h-5 w-5" />
            </SidebarTrigger>
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/admin">Admin Portal</BreadcrumbLink>
                </BreadcrumbItem>
                {currentPath !== '/admin' && (
                  <>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <main className="flex-1 p-6 bg-secondary/30">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
