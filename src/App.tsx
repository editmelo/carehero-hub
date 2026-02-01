import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { PublicLayout } from "./components/layout/PublicLayout";
import { AdminLayout } from "./components/admin/AdminLayout";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import MedicaidPage from "./pages/MedicaidPage";
import CareersPage from "./pages/CareersPage";
import ContactPage from "./pages/ContactPage";
import ReferPage from "./pages/ReferPage";
import GetStartedPage from "./pages/GetStartedPage";
import HipaaPage from "./pages/HipaaPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/admin/DashboardPage";
import LeadsPage from "./pages/admin/LeadsPage";
import PipelinePage from "./pages/admin/PipelinePage";
import TasksPage from "./pages/admin/TasksPage";
import ReferralsPage from "./pages/admin/ReferralsPage";
import UsersPage from "./pages/admin/UsersPage";
import SettingsPage from "./pages/admin/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/medicaid" element={<MedicaidPage />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/refer" element={<ReferPage />} />
              <Route path="/get-started" element={<GetStartedPage />} />
              <Route path="/hipaa" element={<HipaaPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
            </Route>

            {/* Auth Route */}
            <Route path="/auth" element={<AuthPage />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="leads" element={<LeadsPage />} />
              <Route path="pipeline" element={<PipelinePage />} />
              <Route path="tasks" element={<TasksPage />} />
              <Route path="referrals" element={<ReferralsPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
