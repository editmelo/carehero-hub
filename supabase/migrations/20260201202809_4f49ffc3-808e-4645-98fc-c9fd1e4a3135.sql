-- Function to update lead status when referral is submitted
CREATE OR REPLACE FUNCTION public.update_lead_status_on_referral_submitted()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the linked client lead to "referral_submitted" status
  IF NEW.client_lead_id IS NOT NULL THEN
    UPDATE public.client_leads
    SET lead_status = 'referral_submitted'
    WHERE id = NEW.client_lead_id
    AND lead_status NOT IN ('approved', 'denied', 'service_started', 'lost_not_eligible');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to update lead status when LOC is approved
CREATE OR REPLACE FUNCTION public.update_lead_status_on_loc_approved()
RETURNS TRIGGER AS $$
BEGIN
  -- When LOC status changes to approved, update the linked lead
  IF NEW.loc_status = 'approved' AND (OLD.loc_status IS NULL OR OLD.loc_status != 'approved') THEN
    IF NEW.client_lead_id IS NOT NULL THEN
      UPDATE public.client_leads
      SET lead_status = 'approved'
      WHERE id = NEW.client_lead_id
      AND lead_status NOT IN ('service_started', 'lost_not_eligible');
    END IF;
  END IF;
  
  -- When LOC status changes to denied, update the linked lead
  IF NEW.loc_status = 'denied' AND (OLD.loc_status IS NULL OR OLD.loc_status != 'denied') THEN
    IF NEW.client_lead_id IS NOT NULL THEN
      UPDATE public.client_leads
      SET lead_status = 'denied'
      WHERE id = NEW.client_lead_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to update lead status when assessment is scheduled
CREATE OR REPLACE FUNCTION public.update_lead_status_on_assessment_scheduled()
RETURNS TRIGGER AS $$
BEGIN
  -- When assessment date is set, update lead to assessment_scheduled
  IF NEW.assessment_scheduled_date IS NOT NULL 
     AND (OLD.assessment_scheduled_date IS NULL OR OLD.assessment_scheduled_date != NEW.assessment_scheduled_date) THEN
    IF NEW.client_lead_id IS NOT NULL THEN
      UPDATE public.client_leads
      SET lead_status = 'assessment_scheduled'
      WHERE id = NEW.client_lead_id
      AND lead_status NOT IN ('approved', 'denied', 'service_started', 'lost_not_eligible');
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for new referral submissions
DROP TRIGGER IF EXISTS trigger_update_lead_on_referral_insert ON public.internal_referral_tracking;
CREATE TRIGGER trigger_update_lead_on_referral_insert
  AFTER INSERT ON public.internal_referral_tracking
  FOR EACH ROW
  EXECUTE FUNCTION public.update_lead_status_on_referral_submitted();

-- Trigger for LOC status changes on internal_referral_tracking
DROP TRIGGER IF EXISTS trigger_update_lead_on_loc_change ON public.internal_referral_tracking;
CREATE TRIGGER trigger_update_lead_on_loc_change
  AFTER UPDATE OF loc_status ON public.internal_referral_tracking
  FOR EACH ROW
  EXECUTE FUNCTION public.update_lead_status_on_loc_approved();

-- Trigger for assessment scheduling
DROP TRIGGER IF EXISTS trigger_update_lead_on_assessment_scheduled ON public.internal_referral_tracking;
CREATE TRIGGER trigger_update_lead_on_assessment_scheduled
  AFTER UPDATE OF assessment_scheduled_date ON public.internal_referral_tracking
  FOR EACH ROW
  EXECUTE FUNCTION public.update_lead_status_on_assessment_scheduled();

-- Also handle enrollment_pipeline LOC changes
DROP TRIGGER IF EXISTS trigger_update_lead_on_pipeline_loc_change ON public.enrollment_pipeline;
CREATE TRIGGER trigger_update_lead_on_pipeline_loc_change
  AFTER UPDATE OF loc_outcome ON public.enrollment_pipeline
  FOR EACH ROW
  EXECUTE FUNCTION public.update_lead_status_on_loc_approved();