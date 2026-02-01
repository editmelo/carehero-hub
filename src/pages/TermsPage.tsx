import { motion } from "framer-motion";
import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 hero-gradient">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-primary-foreground"
          >
            <div className="w-16 h-16 rounded-full bg-primary-foreground/10 flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-gold" />
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Terms of Service
            </h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">
              Please read these terms carefully before using our services.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="prose prose-lg max-w-none"
          >
            <div className="bg-card rounded-xl p-8 shadow-sm border border-border space-y-8">
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
                  Agreement to Terms
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing or using the services provided by CareHero Home Care Services ("Company," "we," 
                  "our," or "us"), you agree to be bound by these Terms of Service ("Terms"). If you do not 
                  agree to these Terms, you may not access or use our services. These Terms apply to all 
                  visitors, users, clients, and caregivers who access or use our services.
                </p>
              </div>

              <div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                  Description of Services
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  CareHero Home Care Services provides non-medical home care services throughout Central Indiana, 
                  including but not limited to personal care, attendant care, respite care, companion care, and 
                  homemaker services. Our services are designed to help individuals maintain independence and 
                  quality of life in their own homes. We also facilitate Medicaid waiver enrollment through 
                  coordination with CICOA, Maximus, and managed care entities.
                </p>
              </div>

              <div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                  Eligibility
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  To use our services, you must be at least 18 years of age or have a legal guardian who can 
                  enter into these Terms on your behalf. By using our services, you represent and warrant that 
                  you meet these eligibility requirements. Certain services may require Medicaid eligibility 
                  or other qualifications as determined by applicable programs.
                </p>
              </div>

              <div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                  User Responsibilities
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  When using our services or website, you agree to:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Provide accurate and complete information when submitting forms or applications</li>
                  <li>Maintain the confidentiality of any account credentials</li>
                  <li>Notify us promptly of any changes to your contact information or care needs</li>
                  <li>Treat our caregivers and staff with respect and dignity</li>
                  <li>Comply with all applicable laws and regulations</li>
                  <li>Not use our services for any unlawful or prohibited purpose</li>
                </ul>
              </div>

              <div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                  Service Agreements
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Home care services are provided pursuant to individual service agreements that outline the 
                  specific terms of care, including service schedules, care plans, and payment terms. These 
                  service agreements supplement these Terms of Service and are subject to modification based 
                  on changing care needs and circumstances.
                </p>
              </div>

              <div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                  Payment and Billing
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Payment for services may be made through Medicaid waiver programs, private pay, or other 
                  approved payment methods. For clients receiving Medicaid-funded services, billing is 
                  processed through the applicable managed care entity. Private pay clients are responsible 
                  for payment according to the terms specified in their service agreement.
                </p>
              </div>

              <div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                  Cancellation and Termination
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Either party may terminate services with appropriate notice as specified in the service 
                  agreement. We reserve the right to terminate or suspend services if:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>The client's safety or our caregiver's safety is at risk</li>
                  <li>There is a material breach of these Terms or the service agreement</li>
                  <li>Payment obligations are not met (for private pay clients)</li>
                  <li>The client's care needs exceed our scope of services</li>
                  <li>Required by law or regulatory requirements</li>
                </ul>
              </div>

              <div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                  Intellectual Property
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  All content on our website, including text, graphics, logos, images, and software, is the 
                  property of CareHero Home Care Services or its licensors and is protected by copyright, 
                  trademark, and other intellectual property laws. You may not reproduce, distribute, modify, 
                  or create derivative works from our content without our express written permission.
                </p>
              </div>

              <div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                  Limitation of Liability
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  To the fullest extent permitted by law, CareHero Home Care Services shall not be liable for 
                  any indirect, incidental, special, consequential, or punitive damages arising from your use 
                  of our services or website. Our total liability for any claims arising under these Terms 
                  shall not exceed the amount paid by you for services during the twelve months preceding the claim.
                </p>
              </div>

              <div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                  Disclaimer of Warranties
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our services are provided "as is" and "as available" without warranties of any kind, either 
                  express or implied. While we strive to provide high-quality care, we do not guarantee specific 
                  outcomes or results. We are not a medical provider and do not provide medical, nursing, or 
                  therapeutic services.
                </p>
              </div>

              <div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                  Indemnification
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  You agree to indemnify, defend, and hold harmless CareHero Home Care Services, its officers, 
                  directors, employees, and agents from any claims, damages, losses, or expenses arising from 
                  your violation of these Terms, your use of our services, or your violation of any rights of 
                  a third party.
                </p>
              </div>

              <div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                  Governing Law
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms shall be governed by and construed in accordance with the laws of the State of 
                  Indiana, without regard to its conflict of law provisions. Any disputes arising under these 
                  Terms shall be resolved in the state or federal courts located in Marion County, Indiana.
                </p>
              </div>

              <div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                  Changes to Terms
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to modify these Terms at any time. We will provide notice of material 
                  changes by posting the updated Terms on our website and updating the effective date. Your 
                  continued use of our services after such changes constitutes acceptance of the modified Terms.
                </p>
              </div>

              <div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                  Contact Information
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  If you have questions about these Terms of Service, please contact us:
                </p>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-foreground font-medium">CareHero Home Care Services</p>
                  <p className="text-muted-foreground">Phone: (855) 6CARE24 / (855) 622-7324</p>
                  <p className="text-muted-foreground">Email: info@careherohomecare.com</p>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  <strong>Effective Date:</strong> These Terms of Service are effective as of January 1, 2025, 
                  and will remain in effect until updated.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
