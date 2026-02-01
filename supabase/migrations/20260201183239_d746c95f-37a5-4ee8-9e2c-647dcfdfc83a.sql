-- Create app_role enum for role-based access
CREATE TYPE public.app_role AS ENUM ('admin', 'enrollment_staff', 'read_only');

-- Create lead_status enum
CREATE TYPE public.lead_status AS ENUM (
  'new_inquiry',
  'contacted',
  'education_provided',
  'consent_pending',
  'consent_received',
  'referral_submitted',
  'assessment_scheduled',
  'approved',
  'denied',
  'service_started',
  'lost_not_eligible'
);

-- Create contact_type enum
CREATE TYPE public.contact_type AS ENUM ('client', 'family_member', 'caregiver', 'referral_source');

-- Create referral_source enum
CREATE TYPE public.referral_source AS ENUM ('website', 'cicoa', 'hospital', 'word_of_mouth', 'caregiver_referral', 'event_outreach', 'other');

-- Create insurance_status enum
CREATE TYPE public.insurance_status AS ENUM ('medicaid', 'medicare', 'medicaid_medicare', 'private_pay', 'unknown');

-- Create initial_need enum
CREATE TYPE public.initial_need AS ENUM ('personal_care', 'attendant_care', 'respite', 'unsure');

-- Create task_type enum
CREATE TYPE public.task_type AS ENUM ('call', 'email', 'portal_follow_up', 'document_request');

-- Create task_priority enum
CREATE TYPE public.task_priority AS ENUM ('high', 'medium', 'low');

-- Create task_status enum
CREATE TYPE public.task_status AS ENUM ('pending', 'completed', 'escalated');

-- Create loc_outcome enum
CREATE TYPE public.loc_outcome AS ENUM ('approved', 'denied', 'pending');

-- Create mce_assigned enum
CREATE TYPE public.mce_assigned AS ENUM ('anthem', 'humana', 'unitedhealthcare');

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'read_only',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create client_leads table
CREATE TABLE public.client_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_first_name TEXT NOT NULL,
  client_last_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT,
  home_address TEXT,
  city TEXT,
  county TEXT NOT NULL,
  zip_code TEXT,
  contact_type contact_type NOT NULL DEFAULT 'client',
  referral_source referral_source NOT NULL DEFAULT 'website',
  referral_source_notes TEXT,
  insurance_status insurance_status NOT NULL DEFAULT 'unknown',
  initial_need initial_need NOT NULL DEFAULT 'unsure',
  lead_status lead_status NOT NULL DEFAULT 'new_inquiry',
  assigned_to UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create enrollment_pipeline table
CREATE TABLE public.enrollment_pipeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_lead_id UUID REFERENCES public.client_leads(id) ON DELETE CASCADE NOT NULL,
  consent_signed BOOLEAN NOT NULL DEFAULT false,
  consent_date DATE,
  cicoa_referral_submitted BOOLEAN NOT NULL DEFAULT false,
  cicoa_submission_date DATE,
  cicoa_confirmation_number TEXT,
  maximus_assessment_required BOOLEAN NOT NULL DEFAULT false,
  maximus_scheduled_date DATE,
  maximus_completed_date DATE,
  loc_outcome loc_outcome DEFAULT 'pending',
  mce_assigned mce_assigned,
  medicaid_effective_date DATE,
  approved_services TEXT,
  carehero_start_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create follow_up_tasks table
CREATE TABLE public.follow_up_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_lead_id UUID REFERENCES public.client_leads(id) ON DELETE CASCADE NOT NULL,
  task_type task_type NOT NULL DEFAULT 'call',
  task_description TEXT NOT NULL,
  due_date DATE NOT NULL,
  priority task_priority NOT NULL DEFAULT 'medium',
  status task_status NOT NULL DEFAULT 'pending',
  completed_date DATE,
  notes TEXT,
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create internal_referral_tracking table
CREATE TABLE public.internal_referral_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_lead_id UUID REFERENCES public.client_leads(id) ON DELETE SET NULL,
  county TEXT NOT NULL,
  referral_submitted_to TEXT NOT NULL DEFAULT 'CICOA',
  date_referral_submitted DATE NOT NULL,
  referral_submitted_online BOOLEAN NOT NULL DEFAULT false,
  confirmation_number_or_notes TEXT,
  screenshot_url TEXT,
  maximus_assessment_required BOOLEAN NOT NULL DEFAULT false,
  assessment_scheduled_date DATE,
  loc_status loc_outcome DEFAULT 'pending',
  client_selected_carehero TEXT DEFAULT 'pending',
  estimated_service_start_date DATE,
  internal_notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create activity_audit_log table
CREATE TABLE public.activity_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create webhook_settings table for Microsoft 365 integration
CREATE TABLE public.webhook_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  events TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create job_applications table for careers page
CREATE TABLE public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  experience TEXT,
  availability TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create contact_submissions table
CREATE TABLE public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_roles_updated_at BEFORE UPDATE ON public.user_roles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_client_leads_updated_at BEFORE UPDATE ON public.client_leads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_enrollment_pipeline_updated_at BEFORE UPDATE ON public.enrollment_pipeline FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_follow_up_tasks_updated_at BEFORE UPDATE ON public.follow_up_tasks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_internal_referral_tracking_updated_at BEFORE UPDATE ON public.internal_referral_tracking FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_webhook_settings_updated_at BEFORE UPDATE ON public.webhook_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Security definer function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Security definer function to check if user has any admin portal access
CREATE OR REPLACE FUNCTION public.has_portal_access(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin', 'enrollment_staff', 'read_only')
  )
$$;

-- Security definer function to check if user can modify data (admin or enrollment_staff)
CREATE OR REPLACE FUNCTION public.can_modify_data(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin', 'enrollment_staff')
  )
$$;

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollment_pipeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follow_up_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internal_referral_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- User roles policies (only admins can manage roles)
CREATE POLICY "Users can view own role" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert roles" ON public.user_roles FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update roles" ON public.user_roles FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Client leads policies
CREATE POLICY "Portal users can view leads" ON public.client_leads FOR SELECT USING (public.has_portal_access(auth.uid()));
CREATE POLICY "Portal users can insert leads" ON public.client_leads FOR INSERT WITH CHECK (public.can_modify_data(auth.uid()));
CREATE POLICY "Portal users can update leads" ON public.client_leads FOR UPDATE USING (public.can_modify_data(auth.uid()));
CREATE POLICY "Admins can delete leads" ON public.client_leads FOR DELETE USING (public.has_role(auth.uid(), 'admin'));
-- Allow anonymous inserts from public forms
CREATE POLICY "Public can submit leads" ON public.client_leads FOR INSERT WITH CHECK (true);

-- Enrollment pipeline policies
CREATE POLICY "Portal users can view pipeline" ON public.enrollment_pipeline FOR SELECT USING (public.has_portal_access(auth.uid()));
CREATE POLICY "Portal users can insert pipeline" ON public.enrollment_pipeline FOR INSERT WITH CHECK (public.can_modify_data(auth.uid()));
CREATE POLICY "Portal users can update pipeline" ON public.enrollment_pipeline FOR UPDATE USING (public.can_modify_data(auth.uid()));
CREATE POLICY "Admins can delete pipeline" ON public.enrollment_pipeline FOR DELETE USING (public.has_role(auth.uid(), 'admin'));
-- Allow anonymous inserts from public forms
CREATE POLICY "Public can submit enrollment" ON public.enrollment_pipeline FOR INSERT WITH CHECK (true);

-- Follow up tasks policies
CREATE POLICY "Portal users can view tasks" ON public.follow_up_tasks FOR SELECT USING (public.has_portal_access(auth.uid()));
CREATE POLICY "Portal users can insert tasks" ON public.follow_up_tasks FOR INSERT WITH CHECK (public.can_modify_data(auth.uid()));
CREATE POLICY "Portal users can update tasks" ON public.follow_up_tasks FOR UPDATE USING (public.can_modify_data(auth.uid()));
CREATE POLICY "Admins can delete tasks" ON public.follow_up_tasks FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Internal referral tracking policies
CREATE POLICY "Portal users can view referrals" ON public.internal_referral_tracking FOR SELECT USING (public.has_portal_access(auth.uid()));
CREATE POLICY "Portal users can insert referrals" ON public.internal_referral_tracking FOR INSERT WITH CHECK (public.can_modify_data(auth.uid()));
CREATE POLICY "Portal users can update referrals" ON public.internal_referral_tracking FOR UPDATE USING (public.can_modify_data(auth.uid()));
CREATE POLICY "Admins can delete referrals" ON public.internal_referral_tracking FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Activity audit log policies
CREATE POLICY "Portal users can view audit log" ON public.activity_audit_log FOR SELECT USING (public.has_portal_access(auth.uid()));
CREATE POLICY "System can insert audit log" ON public.activity_audit_log FOR INSERT WITH CHECK (true);

-- Webhook settings policies (admin only)
CREATE POLICY "Admins can view webhooks" ON public.webhook_settings FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert webhooks" ON public.webhook_settings FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update webhooks" ON public.webhook_settings FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete webhooks" ON public.webhook_settings FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Job applications policies (public can submit, portal users can view)
CREATE POLICY "Public can submit applications" ON public.job_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Portal users can view applications" ON public.job_applications FOR SELECT USING (public.has_portal_access(auth.uid()));

-- Contact submissions policies (public can submit, portal users can view)
CREATE POLICY "Public can submit contact" ON public.contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Portal users can view contacts" ON public.contact_submissions FOR SELECT USING (public.has_portal_access(auth.uid()));

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better query performance
CREATE INDEX idx_client_leads_status ON public.client_leads(lead_status);
CREATE INDEX idx_client_leads_county ON public.client_leads(county);
CREATE INDEX idx_client_leads_assigned_to ON public.client_leads(assigned_to);
CREATE INDEX idx_enrollment_pipeline_client ON public.enrollment_pipeline(client_lead_id);
CREATE INDEX idx_follow_up_tasks_due_date ON public.follow_up_tasks(due_date);
CREATE INDEX idx_follow_up_tasks_status ON public.follow_up_tasks(status);
CREATE INDEX idx_follow_up_tasks_priority ON public.follow_up_tasks(priority);
CREATE INDEX idx_activity_audit_log_table ON public.activity_audit_log(table_name);
CREATE INDEX idx_activity_audit_log_record ON public.activity_audit_log(record_id);