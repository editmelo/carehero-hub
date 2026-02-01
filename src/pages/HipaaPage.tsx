import { motion } from "framer-motion";
import { Shield } from "lucide-react";

export default function HipaaPage() {
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
              <Shield className="w-8 h-8 text-gold" />
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              HIPAA Disclaimer
            </h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">
              Your privacy and the security of your health information is our priority.
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
                  Notice of Privacy Practices
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  CareHero Home Care Services is committed to protecting your privacy and ensuring the confidentiality of your 
                  Protected Health Information (PHI) in accordance with the Health Insurance Portability and Accountability Act 
                  of 1996 (HIPAA) and all applicable state and federal laws.
                </p>
              </div>

              <div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                  How We Use and Disclose Your Information
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We may use and disclose your PHI for the following purposes:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li><strong>Treatment:</strong> To provide, coordinate, or manage your health care and related services.</li>
                  <li><strong>Payment:</strong> To obtain payment for services provided to you.</li>
                  <li><strong>Healthcare Operations:</strong> To support the business activities of our practice, including quality assessment and improvement.</li>
                  <li><strong>As Required by Law:</strong> When required by federal, state, or local law.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                  Your Rights Regarding Your PHI
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You have certain rights regarding your Protected Health Information, including:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>The right to request restrictions on certain uses and disclosures of your PHI.</li>
                  <li>The right to receive confidential communications of your PHI.</li>
                  <li>The right to inspect and copy your PHI.</li>
                  <li>The right to amend your PHI.</li>
                  <li>The right to receive an accounting of disclosures of your PHI.</li>
                  <li>The right to obtain a paper copy of this notice upon request.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                  HIPAA-Secure Communications
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  CareHero Home Care Services utilizes HIPAA-secure messaging and communication systems to protect your 
                  privacy. All electronic communications containing PHI are encrypted and transmitted through secure channels. 
                  Our mobile app features built-in encrypted calls and messages to ensure your information remains protected 
                  at all times.
                </p>
              </div>

              <div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                  Our Responsibilities
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  We are required by law to maintain the privacy and security of your PHI, provide you with notice of our 
                  legal duties and privacy practices, and notify you following a breach of unsecured PHI. We will not use 
                  or disclose your PHI without your written authorization, except as described in this notice.
                </p>
              </div>

              <div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                  Complaints
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  If you believe your privacy rights have been violated, you may file a complaint with us or with the 
                  Secretary of the U.S. Department of Health and Human Services. We will not retaliate against you for 
                  filing a complaint.
                </p>
              </div>

              <div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                  Contact Information
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  For questions about this notice or to exercise your privacy rights, please contact us at:
                </p>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-foreground font-medium">CareHero Home Care Services</p>
                  <p className="text-muted-foreground">Phone: (855) 6CARE24 / (855) 622-7324</p>
                  <p className="text-muted-foreground">Email: info@careherohomecare.com</p>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  <strong>Effective Date:</strong> This notice is effective as of January 1, 2025, and will remain in effect 
                  until replaced. We reserve the right to change the terms of this notice and make new provisions effective 
                  for all PHI we maintain.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
