import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Heart, Users, CheckCircle, Send, ArrowRight, Gift
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const relationships = [
  "Family Member",
  "Friend",
  "Neighbor",
  "Healthcare Provider",
  "Social Worker",
  "Other",
];

export default function ReferPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    yourName: "",
    yourPhone: "",
    referralName: "",
    referralPhone: "",
    relationship: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hasPermission) {
      toast({
        title: "Permission Required",
        description: "Please confirm you have permission to share this person's information.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("client_leads").insert({
        client_first_name: formData.referralName.split(" ")[0] || formData.referralName,
        client_last_name: formData.referralName.split(" ").slice(1).join(" ") || "",
        phone_number: formData.referralPhone,
        county: "Unknown",
        contact_type: "referral_source",
        referral_source: "word_of_mouth",
        referral_source_notes: `Referred by: ${formData.yourName} (${formData.yourPhone}). Relationship: ${formData.relationship}`,
        lead_status: "new_inquiry",
      });

      if (error) throw error;

      toast({
        title: "Referral Submitted!",
        description: "Thank you for your referral. We'll reach out to them soon.",
      });

      setFormData({
        yourName: "",
        yourPhone: "",
        referralName: "",
        referralPhone: "",
        relationship: "",
      });
      setHasPermission(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem submitting your referral. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="py-20 hero-gradient">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-primary-foreground max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-gold text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Gift className="w-4 h-4" />
              Help Someone You Care About
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              Refer Someone to CareHero
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Know someone who could benefit from quality home care? 
              Let us help them live more comfortably and independently.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Refer Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                Compassionate Care
              </h3>
              <p className="text-sm text-muted-foreground">
                We treat every client like family with personalized, compassionate care.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                Trusted Caregivers
              </h3>
              <p className="text-sm text-muted-foreground">
                All caregivers are thoroughly vetted and trained to provide excellent care.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                Easy Process
              </h3>
              <p className="text-sm text-muted-foreground">
                We handle all the paperwork and guide families through every step.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Referral Form Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="card-elevated p-8 lg:p-10">
                <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
                  Referral Form
                </h2>
                <p className="text-muted-foreground mb-8">
                  Fill out the form below and we'll reach out to the person you're referring.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Your Information */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-4">Your Information</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="yourName">Your Name *</Label>
                        <Input
                          id="yourName"
                          value={formData.yourName}
                          onChange={(e) => setFormData({ ...formData, yourName: e.target.value })}
                          required
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="yourPhone">Your Phone *</Label>
                        <Input
                          id="yourPhone"
                          type="tel"
                          value={formData.yourPhone}
                          onChange={(e) => setFormData({ ...formData, yourPhone: e.target.value })}
                          required
                          placeholder="(317) 555-0123"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Referral Information */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-4">Person You're Referring</h3>
                    <div className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="referralName">Their Name *</Label>
                          <Input
                            id="referralName"
                            value={formData.referralName}
                            onChange={(e) => setFormData({ ...formData, referralName: e.target.value })}
                            required
                            placeholder="Their full name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="referralPhone">Their Phone *</Label>
                          <Input
                            id="referralPhone"
                            type="tel"
                            value={formData.referralPhone}
                            onChange={(e) => setFormData({ ...formData, referralPhone: e.target.value })}
                            required
                            placeholder="(317) 555-0123"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="relationship">Your Relationship *</Label>
                        <Select
                          value={formData.relationship}
                          onValueChange={(value) => setFormData({ ...formData, relationship: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select relationship" />
                          </SelectTrigger>
                          <SelectContent>
                            {relationships.map((rel) => (
                              <SelectItem key={rel} value={rel}>
                                {rel}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Permission Checkbox */}
                  <div className="flex items-start space-x-3 p-4 bg-secondary rounded-lg">
                    <Checkbox
                      id="permission"
                      checked={hasPermission}
                      onCheckedChange={(checked) => setHasPermission(checked as boolean)}
                    />
                    <div className="space-y-1 leading-none">
                      <Label
                        htmlFor="permission"
                        className="text-sm font-medium cursor-pointer"
                      >
                        I have permission to share this person's contact information *
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        By checking this box, you confirm that you have obtained permission 
                        from the person you are referring to share their information with CareHero.
                      </p>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="cta"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting || !hasPermission}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Referral"}
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 hero-gradient">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-primary-foreground max-w-3xl mx-auto"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Need Care for Yourself?
            </h2>
            <p className="text-primary-foreground/80 mb-8">
              If you're looking for home care services for yourself, 
              we're here to help. Start the intake process today.
            </p>
            <Link to="/get-started">
              <Button variant="gold" size="xl">
                Start Intake Process
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
