import { useState } from "react";
import { motion } from "framer-motion";
import { 
  User, FileText, Heart, CheckCircle, Send, Phone,
  Shield, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

const counties = [
  "Marion",
  "Hamilton",
  "Hendricks",
  "Johnson",
  "Hancock",
  "Other",
];

const insuranceOptions = [
  { value: "medicaid", label: "Medicaid" },
  { value: "medicare", label: "Medicare" },
  { value: "medicaid_medicare", label: "Both Medicaid and Medicare" },
  { value: "unknown", label: "Not Sure" },
];

const careNeeds = [
  "Personal Care (bathing, dressing, grooming)",
  "Medication Reminders",
  "Mobility Assistance",
  "Meal Preparation",
  "Light Housekeeping",
  "Companionship",
  "Transportation",
  "Respite Care",
];

const steps = [
  { id: 1, title: "Client Info", icon: User },
  { id: 2, title: "Insurance", icon: FileText },
  { id: 3, title: "Care Needs", icon: Heart },
  { id: 4, title: "Consent", icon: Shield },
];

export default function GetStartedPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    // Client Info
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    county: "",
    zipCode: "",
    // Insurance
    insuranceStatus: "",
    medicaidId: "",
    medicareId: "",
    currentProvider: "",
    // Care Needs
    selectedNeeds: [] as string[],
    otherNeeds: "",
    // Consent
    consentAgreed: false,
    signatureName: "",
    signatureDate: "",
  });

  const handleNeedToggle = (need: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedNeeds: prev.selectedNeeds.includes(need)
        ? prev.selectedNeeds.filter((n) => n !== need)
        : [...prev.selectedNeeds, need],
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.consentAgreed) {
      toast({
        title: "Consent Required",
        description: "Please agree to the consent to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create lead
      const { data: leadData, error: leadError } = await supabase
        .from("client_leads")
        .insert({
          client_first_name: formData.firstName,
          client_last_name: formData.lastName,
          phone_number: formData.phone,
          email: formData.email,
          home_address: formData.address,
          city: formData.city,
          county: formData.county,
          zip_code: formData.zipCode,
          contact_type: "client",
          referral_source: "website",
          insurance_status: formData.insuranceStatus as any || "unknown",
          initial_need: "unsure",
          lead_status: "consent_received",
          notes: `Care needs: ${formData.selectedNeeds.join(", ")}. ${formData.otherNeeds ? `Other: ${formData.otherNeeds}` : ""}\nMedicaid ID: ${formData.medicaidId}\nMedicare ID: ${formData.medicareId}\nDOB: ${formData.dateOfBirth}`,
        })
        .select()
        .single();

      if (leadError) throw leadError;

      // Create enrollment record with consent
      if (leadData) {
        const { error: enrollmentError } = await supabase
          .from("enrollment_pipeline")
          .insert({
            client_lead_id: leadData.id,
            consent_signed: true,
            consent_date: formData.signatureDate || new Date().toISOString().split("T")[0],
          });

        if (enrollmentError) throw enrollmentError;
      }

      toast({
        title: "Application Submitted!",
        description: "Thank you for choosing CareHero. We'll contact you within 24-48 hours.",
      });

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        county: "",
        zipCode: "",
        insuranceStatus: "",
        medicaidId: "",
        medicareId: "",
        currentProvider: "",
        selectedNeeds: [],
        otherNeeds: "",
        consentAgreed: false,
        signatureName: "",
        signatureDate: "",
      });
      setCurrentStep(1);
    } catch (error) {
      console.error("Error submitting form:", error);
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
      <section className="py-16 hero-gradient">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-primary-foreground max-w-3xl mx-auto"
          >
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Client Intake & Consent
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Complete this form to begin your journey with CareHero Home Care Services.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Progress Steps */}
            <div className="mb-10">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors ${
                        currentStep >= step.id
                          ? "bg-accent border-accent text-accent-foreground"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      <step.icon className="w-5 h-5" />
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`hidden sm:block w-16 md:w-24 h-0.5 mx-2 ${
                          currentStep > step.id ? "bg-accent" : "bg-border"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2">
                {steps.map((step) => (
                  <span
                    key={step.id}
                    className={`text-xs font-medium ${
                      currentStep >= step.id ? "text-accent" : "text-muted-foreground"
                    }`}
                  >
                    {step.title}
                  </span>
                ))}
              </div>
            </div>

            {/* Form Card */}
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="card-elevated p-8"
            >
              <form onSubmit={handleSubmit}>
                {/* Step 1: Client Info */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
                      Client Information
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
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
                    <div>
                      <Label htmlFor="email">Email (optional)</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Home Address *</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="county">County *</Label>
                        <Select
                          value={formData.county}
                          onValueChange={(value) => setFormData({ ...formData, county: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select county" />
                          </SelectTrigger>
                          <SelectContent>
                            {counties.map((county) => (
                              <SelectItem key={county} value={county}>
                                {county}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="zipCode">ZIP Code *</Label>
                        <Input
                          id="zipCode"
                          value={formData.zipCode}
                          onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Insurance */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
                      Insurance Information
                    </h2>
                    <div>
                      <Label>Insurance Status *</Label>
                      <Select
                        value={formData.insuranceStatus}
                        onValueChange={(value) => setFormData({ ...formData, insuranceStatus: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select insurance type" />
                        </SelectTrigger>
                        <SelectContent>
                          {insuranceOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {(formData.insuranceStatus === "medicaid" || formData.insuranceStatus === "medicaid_medicare") && (
                      <div>
                        <Label htmlFor="medicaidId">Medicaid ID (if known)</Label>
                        <Input
                          id="medicaidId"
                          value={formData.medicaidId}
                          onChange={(e) => setFormData({ ...formData, medicaidId: e.target.value })}
                          placeholder="Enter Medicaid ID"
                        />
                      </div>
                    )}
                    {(formData.insuranceStatus === "medicare" || formData.insuranceStatus === "medicaid_medicare") && (
                      <div>
                        <Label htmlFor="medicareId">Medicare ID (if known)</Label>
                        <Input
                          id="medicareId"
                          value={formData.medicareId}
                          onChange={(e) => setFormData({ ...formData, medicareId: e.target.value })}
                          placeholder="Enter Medicare ID"
                        />
                      </div>
                    )}
                    <div>
                      <Label htmlFor="currentProvider">Current Home Care Provider (if any)</Label>
                      <Input
                        id="currentProvider"
                        value={formData.currentProvider}
                        onChange={(e) => setFormData({ ...formData, currentProvider: e.target.value })}
                        placeholder="Enter current provider name"
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Care Needs */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
                      Care Needs
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      Select all services that apply to your care needs.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {careNeeds.map((need) => (
                        <div
                          key={need}
                          className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                            formData.selectedNeeds.includes(need)
                              ? "border-accent bg-accent/5"
                              : "border-border hover:border-accent/50"
                          }`}
                          onClick={() => handleNeedToggle(need)}
                        >
                          <Checkbox
                            checked={formData.selectedNeeds.includes(need)}
                            onCheckedChange={() => handleNeedToggle(need)}
                          />
                          <Label className="text-sm cursor-pointer">{need}</Label>
                        </div>
                      ))}
                    </div>
                    <div>
                      <Label htmlFor="otherNeeds">Other Care Needs</Label>
                      <Textarea
                        id="otherNeeds"
                        value={formData.otherNeeds}
                        onChange={(e) => setFormData({ ...formData, otherNeeds: e.target.value })}
                        placeholder="Describe any additional care needs..."
                        rows={3}
                      />
                    </div>
                  </div>
                )}

                {/* Step 4: Consent */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
                      Consent & Authorization
                    </h2>
                    <div className="bg-secondary p-6 rounded-lg text-sm text-muted-foreground space-y-4">
                      <p>
                        I authorize CareHero Home Care Services to submit a referral on my behalf 
                        to CICOA (Central Indiana Council on Aging) or the appropriate Area Agency 
                        on Aging to begin the Medicaid waiver enrollment process.
                      </p>
                      <p>
                        I understand that this referral may result in a Level of Care (LOC) 
                        assessment conducted by Maximus to determine eligibility for 
                        Medicaid waiver services.
                      </p>
                      <p>
                        I consent to the sharing of my personal and health information as 
                        necessary to facilitate the enrollment process and provision of 
                        home care services.
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="signatureName">Typed Signature *</Label>
                        <Input
                          id="signatureName"
                          value={formData.signatureName}
                          onChange={(e) => setFormData({ ...formData, signatureName: e.target.value })}
                          required
                          placeholder="Type your full legal name"
                          className="font-serif italic"
                        />
                      </div>
                      <div>
                        <Label htmlFor="signatureDate">Date *</Label>
                        <Input
                          id="signatureDate"
                          type="date"
                          value={formData.signatureDate}
                          onChange={(e) => setFormData({ ...formData, signatureDate: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-accent/5 border border-accent/20 rounded-lg">
                      <Checkbox
                        id="consent"
                        checked={formData.consentAgreed}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, consentAgreed: checked as boolean })
                        }
                      />
                      <div className="space-y-1 leading-none">
                        <Label
                          htmlFor="consent"
                          className="text-sm font-medium cursor-pointer"
                        >
                          I agree to the above consent and authorization *
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          By checking this box and signing above, I confirm that I understand 
                          and agree to the terms stated.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                  >
                    Back
                  </Button>
                  
                  {currentStep < 4 ? (
                    <Button type="button" variant="cta" onClick={nextStep}>
                      Continue
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      variant="cta"
                      disabled={isSubmitting || !formData.consentAgreed}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                      <Send className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </form>
            </motion.div>

            {/* Contact Info */}
            <div className="mt-8 text-center">
              <p className="text-muted-foreground">
                Questions? Call us at{" "}
                <a href="tel:+18556227324" className="text-accent hover:underline font-medium">
                  (855) 6CARE24
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
