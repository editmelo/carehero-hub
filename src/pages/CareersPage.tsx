import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Briefcase, DollarSign, Heart, Clock, Users, Award,
  ArrowRight, CheckCircle, Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const daysOfWeek = [
  "Monday",
  "Tuesday", 
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const scheduleOptions = [
  "Not Available",
  "Morning (6am-12pm)",
  "Afternoon (12pm-6pm)",
  "Evening (6pm-12am)",
  "All Day",
  "Flexible",
];

const hearAboutUsOptions = [
  "Google Search",
  "Facebook",
  "Indeed",
  "Other Job Site",
  "Friend or Family",
  "Current/Former Employee",
  "Community Event",
  "Other",
];

const benefits = [
  {
    icon: DollarSign,
    title: "Competitive Pay",
    description: "Earn up to $24/hr with opportunities for increases based on experience and performance.",
  },
  {
    icon: Clock,
    title: "Flexible Schedule",
    description: "Choose hours that work for your lifestyle. Full-time, part-time, and PRN options available.",
  },
  {
    icon: Heart,
    title: "Meaningful Work",
    description: "Make a real difference in people's lives every day. Be someone's hero.",
  },
  {
    icon: Users,
    title: "Supportive Team",
    description: "Join a family-oriented team that values and supports its caregivers.",
  },
  {
    icon: Award,
    title: "Training & Growth",
    description: "Ongoing training opportunities and career advancement paths.",
  },
  {
    icon: Briefcase,
    title: "Stable Employment",
    description: "Growing company with consistent work opportunities throughout Central Indiana.",
  },
];

const requirements = [
  "High school diploma or equivalent",
  "Valid driver's license and reliable transportation",
  "Pass background check and drug screening",
  "Compassionate and patient demeanor",
  "Strong communication skills",
  "Ability to assist with personal care tasks",
  "Previous caregiving experience preferred (not required)",
];

type ScheduleState = {
  [key: string]: string;
};

export default function CareersPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    zipCode: "",
    primaryLanguage: "",
    currentAgency: "",
    howDidYouHear: "",
  });
  const [schedule, setSchedule] = useState<ScheduleState>({
    Monday: "",
    Tuesday: "",
    Wednesday: "",
    Thursday: "",
    Friday: "",
    Saturday: "",
    Sunday: "",
  });

  const formatScheduleForSubmission = () => {
    const scheduleParts = Object.entries(schedule)
      .filter(([_, value]) => value && value !== "Not Available")
      .map(([day, value]) => `${day}: ${value}`);
    return scheduleParts.length > 0 ? scheduleParts.join("; ") : "Not specified";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const experienceInfo = [
        formData.city && `City: ${formData.city}`,
        formData.zipCode && `Zip: ${formData.zipCode}`,
        formData.primaryLanguage && `Language: ${formData.primaryLanguage}`,
        formData.currentAgency && `Current Agency: ${formData.currentAgency}`,
      ].filter(Boolean).join("; ");

      const { error } = await supabase.from("job_applications").insert({
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        experience: experienceInfo || null,
        availability: formatScheduleForSubmission(),
        notes: formData.howDidYouHear ? `How they heard about us: ${formData.howDidYouHear}` : null,
      });

      if (error) throw error;

      toast({
        title: "Application Submitted!",
        description: "Thank you for your interest. We'll be in touch soon!",
      });

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        city: "",
        zipCode: "",
        primaryLanguage: "",
        currentAgency: "",
        howDidYouHear: "",
      });
      setSchedule({
        Monday: "",
        Tuesday: "",
        Wednesday: "",
        Thursday: "",
        Friday: "",
        Saturday: "",
        Sunday: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem submitting your application. Please try again.",
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
              <DollarSign className="w-4 h-4" />
              Earn Up to $24/hr
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              Become a CareHero
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Make a difference in people's lives. Become a caregiver with CareHero 
              and help us provide compassionate home care throughout Central Indiana.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Work With CareHero?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We believe our caregivers are the heart of our company. That's why we invest in your success.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-elevated p-6"
              >
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements & Application */}
      <section className="py-20 subtle-gradient">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Requirements */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-3xl font-bold text-foreground mb-6">
                What We're Looking For
              </h2>
              <p className="text-muted-foreground mb-8">
                We're seeking compassionate individuals who are dedicated to making a 
                positive impact in the lives of others.
              </p>
              <ul className="space-y-4">
                {requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{req}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Application Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="card-elevated p-8">
                <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
                  Express Your Interest
                </h3>
                <p className="text-muted-foreground mb-6">
                  Fill out the form below and we'll be in touch about opportunities.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        placeholder="(317) 555-0123"
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        required
                        placeholder="Indianapolis"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">Zip Code *</Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                        required
                        placeholder="46204"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="primaryLanguage">Primary Language Spoken *</Label>
                    <Input
                      id="primaryLanguage"
                      value={formData.primaryLanguage}
                      onChange={(e) => setFormData({ ...formData, primaryLanguage: e.target.value })}
                      required
                      placeholder="e.g., English, Spanish"
                    />
                  </div>
                  <div>
                    <Label htmlFor="currentAgency">Current Agency</Label>
                    <Input
                      id="currentAgency"
                      value={formData.currentAgency}
                      onChange={(e) => setFormData({ ...formData, currentAgency: e.target.value })}
                      placeholder="Current or previous home care agency (if any)"
                    />
                  </div>

                  {/* Preferred Care Schedule */}
                  <div>
                    <Label className="mb-3 block">Preferred Care Schedule (Days & Hours) *</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {daysOfWeek.map((day) => (
                        <div key={day} className="flex items-center gap-2">
                          <span className="w-24 text-sm font-medium text-foreground">{day}</span>
                          <Select
                            value={schedule[day]}
                            onValueChange={(value) => setSchedule({ ...schedule, [day]: value })}
                          >
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder="Select hours" />
                            </SelectTrigger>
                            <SelectContent>
                              {scheduleOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* How Did You Hear About Us */}
                  <div>
                    <Label>How did you hear about CareHero? *</Label>
                    <Select
                      value={formData.howDidYouHear}
                      onValueChange={(value) => setFormData({ ...formData, howDidYouHear: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        {hearAboutUsOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="submit"
                    variant="cta"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
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
              Have Questions About Joining Our Team?
            </h2>
            <p className="text-primary-foreground/80 mb-8">
              We'd love to hear from you. Contact us to learn more about caregiver 
              opportunities at CareHero.
            </p>
            <Link to="/contact">
              <Button variant="gold" size="xl">
                Contact Us
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
