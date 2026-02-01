import { motion } from "framer-motion";
import { Lock } from "lucide-react";

export default function PrivacyPage() {
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
              <Lock className="w-8 h-8 text-gold" />
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Privacy Policy
            </h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">
              Your privacy matters to us. This policy explains how we collect, use, and protect your information.
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
                  Introduction
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  CareHero Home Care Services ("we," "our," or "us") is committed to protecting your privacy. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                  when you visit our website or use our services. Please read this policy carefully to understand 
                  our practices regarding your personal data.
                </p>
              </div>

              <div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                  Information We Collect
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We may collect information about you in a variety of ways, including:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li><strong>Personal Data:</strong> Name, email address, phone number, mailing address, date of birth, and other similar contact information.</li>
                  <li><strong>Health Information:</strong> Information about care needs, medical conditions, and insurance status necessary to provide our services.</li>
                  <li><strong>Employment Data:</strong> For job applicants, we collect resumes, work history, and related employment information.</li>
                  <li><strong>Usage Data:</strong> Information about how you interact with our website, including IP address, browser type, and pages visited.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                  How We Use Your Information
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Provide, maintain, and improve our home care services</li>
                  <li>Process your inquiries and applications for care services</li>
                  <li>Communicate with you about appointments, services, and updates</li>
                  <li>Coordinate with insurance providers and healthcare organizations</li>
                  <li>Process job applications and manage employment relationships</li>
                  <li>Comply with legal obligations and regulatory requirements</li>
                  <li>Improve our website and user experience</li>
                </ul>
              </div>

              <div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                  Disclosure of Your Information
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We may share your information in the following situations:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li><strong>Service Providers:</strong> With third parties who perform services on our behalf, such as payment processing and data analysis.</li>
                  <li><strong>Healthcare Partners:</strong> With CICOA, Maximus, and managed care entities to facilitate your care enrollment and services.</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to respond to legal process.</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets.</li>
                  <li><strong>With Your Consent:</strong> When you have given us permission to share your information.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                  Data Security
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  We implement appropriate technical and organizational security measures to protect your personal 
                  information against unauthorized access, alteration, disclosure, or destruction. These measures 
                  include encryption, secure servers, and access controls. However, no method of transmission over 
                  the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                </p>
              </div>

              <div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                  Your Rights
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Depending on your location, you may have certain rights regarding your personal information:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>The right to access the personal information we hold about you</li>
                  <li>The right to request correction of inaccurate information</li>
                  <li>The right to request deletion of your information (subject to legal retention requirements)</li>
                  <li>The right to opt out of marketing communications</li>
                  <li>The right to file a complaint with a supervisory authority</li>
                </ul>
              </div>

              <div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                  Cookies and Tracking Technologies
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our website may use cookies and similar tracking technologies to enhance your experience. 
                  Cookies are small data files stored on your device that help us understand how you use our 
                  website. You can control cookie settings through your browser preferences. Disabling cookies 
                  may affect certain features of our website.
                </p>
              </div>

              <div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                  Third-Party Links
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our website may contain links to third-party websites. We are not responsible for the privacy 
                  practices or content of these external sites. We encourage you to review the privacy policies 
                  of any third-party sites you visit.
                </p>
              </div>

              <div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                  Children's Privacy
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our services are not directed to individuals under the age of 18. We do not knowingly collect 
                  personal information from children. If we become aware that we have inadvertently collected 
                  information from a child, we will take steps to delete such information.
                </p>
              </div>

              <div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                  Changes to This Privacy Policy
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by 
                  posting the new Privacy Policy on this page and updating the "Effective Date" below. We 
                  encourage you to review this Privacy Policy periodically.
                </p>
              </div>

              <div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                  Contact Us
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  If you have questions about this Privacy Policy or our privacy practices, please contact us:
                </p>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-foreground font-medium">CareHero Home Care Services</p>
                  <p className="text-muted-foreground">Phone: (855) 6CARE24 / (855) 622-7324</p>
                  <p className="text-muted-foreground">Email: info@careherohomecare.com</p>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  <strong>Effective Date:</strong> This Privacy Policy is effective as of January 1, 2025, 
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
