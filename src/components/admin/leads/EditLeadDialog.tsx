import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

type ClientLead = Tables<'client_leads'>;

const formSchema = z.object({
  client_first_name: z.string().min(1, 'First name is required').max(100),
  client_last_name: z.string().min(1, 'Last name is required').max(100),
  phone_number: z.string().min(1, 'Phone number is required').max(20),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  county: z.string().min(1, 'County is required').max(100),
  city: z.string().max(100).optional(),
  zip_code: z.string().max(10).optional(),
  home_address: z.string().max(500).optional(),
  contact_type: z.enum(['client', 'family_member', 'caregiver', 'referral_source']),
  insurance_status: z.enum(['medicaid', 'medicare', 'medicaid_medicare', 'private_pay', 'unknown']),
  initial_need: z.enum(['personal_care', 'attendant_care', 'respite', 'unsure']),
  referral_source: z.enum(['website', 'cicoa', 'hospital', 'word_of_mouth', 'caregiver_referral', 'event_outreach', 'other']),
  lead_status: z.enum(['new_inquiry', 'contacted', 'education_provided', 'consent_pending', 'consent_received', 'referral_submitted', 'assessment_scheduled', 'approved', 'denied', 'service_started', 'lost_not_eligible']),
  notes: z.string().max(2000).optional(),
  referral_source_notes: z.string().max(500).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditLeadDialogProps {
  lead: ClientLead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditLeadDialog({ lead, open, onOpenChange, onSuccess }: EditLeadDialogProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client_first_name: '',
      client_last_name: '',
      phone_number: '',
      email: '',
      county: '',
      city: '',
      zip_code: '',
      home_address: '',
      contact_type: 'client',
      insurance_status: 'unknown',
      initial_need: 'unsure',
      referral_source: 'website',
      lead_status: 'new_inquiry',
      notes: '',
      referral_source_notes: '',
    },
  });

  useEffect(() => {
    if (lead) {
      form.reset({
        client_first_name: lead.client_first_name,
        client_last_name: lead.client_last_name,
        phone_number: lead.phone_number,
        email: lead.email || '',
        county: lead.county,
        city: lead.city || '',
        zip_code: lead.zip_code || '',
        home_address: lead.home_address || '',
        contact_type: lead.contact_type,
        insurance_status: lead.insurance_status,
        initial_need: lead.initial_need,
        referral_source: lead.referral_source,
        lead_status: lead.lead_status,
        notes: lead.notes || '',
        referral_source_notes: lead.referral_source_notes || '',
      });
    }
  }, [lead, form]);

  const onSubmit = async (values: FormValues) => {
    if (!lead) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('client_leads')
        .update({
          client_first_name: values.client_first_name,
          client_last_name: values.client_last_name,
          phone_number: values.phone_number,
          email: values.email || null,
          county: values.county,
          city: values.city || null,
          zip_code: values.zip_code || null,
          home_address: values.home_address || null,
          contact_type: values.contact_type,
          insurance_status: values.insurance_status,
          initial_need: values.initial_need,
          referral_source: values.referral_source,
          lead_status: values.lead_status,
          notes: values.notes || null,
          referral_source_notes: values.referral_source_notes || null,
        })
        .eq('id', lead.id);

      if (error) throw error;

      toast({
        title: 'Lead updated',
        description: 'The client lead has been updated successfully.',
      });
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error('Error updating lead:', error);
      toast({
        title: 'Error',
        description: 'Failed to update lead. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Lead</DialogTitle>
          <DialogDescription>
            Update the client lead information
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="client_first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="client_last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="(555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="county"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>County *</FormLabel>
                    <FormControl>
                      <Input placeholder="Marion" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Indianapolis" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zip_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zip Code</FormLabel>
                    <FormControl>
                      <Input placeholder="46201" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="home_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Home Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main St" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contact_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select contact type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="client">Client</SelectItem>
                        <SelectItem value="family_member">Family Member</SelectItem>
                        <SelectItem value="caregiver">Caregiver</SelectItem>
                        <SelectItem value="referral_source">Referral Source</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="insurance_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Insurance Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select insurance" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="medicaid">Medicaid</SelectItem>
                        <SelectItem value="medicare">Medicare</SelectItem>
                        <SelectItem value="medicaid_medicare">Medicaid + Medicare</SelectItem>
                        <SelectItem value="private_pay">Private Pay</SelectItem>
                        <SelectItem value="unknown">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="initial_need"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Need</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select need" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="personal_care">Personal Care</SelectItem>
                        <SelectItem value="attendant_care">Attendant Care</SelectItem>
                        <SelectItem value="respite">Respite</SelectItem>
                        <SelectItem value="unsure">Unsure</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="referral_source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Referral Source</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="website">Website</SelectItem>
                        <SelectItem value="cicoa">CICOA</SelectItem>
                        <SelectItem value="hospital">Hospital</SelectItem>
                        <SelectItem value="word_of_mouth">Word of Mouth</SelectItem>
                        <SelectItem value="caregiver_referral">Caregiver Referral</SelectItem>
                        <SelectItem value="event_outreach">Event/Outreach</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="lead_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lead Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="new_inquiry">New Inquiry</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="education_provided">Education Provided</SelectItem>
                      <SelectItem value="consent_pending">Consent Pending</SelectItem>
                      <SelectItem value="consent_received">Consent Received</SelectItem>
                      <SelectItem value="referral_submitted">Referral Submitted</SelectItem>
                      <SelectItem value="assessment_scheduled">Assessment Scheduled</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="denied">Denied</SelectItem>
                      <SelectItem value="service_started">Service Started</SelectItem>
                      <SelectItem value="lost_not_eligible">Lost / Not Eligible</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="referral_source_notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Referral Source Notes</FormLabel>
                  <FormControl>
                    <Input placeholder="Additional referral details..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Additional notes about this lead..."
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
