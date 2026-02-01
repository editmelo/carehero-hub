import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  FileText, CheckCircle, HelpCircle, ArrowRight, 
  Phone, ClipboardCheck, Calendar, Users
} from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: Phone,
    title: "Contact CareHero",
    description: "Reach out to us by phone or complete our intake form. We'll gather basic information about your care needs.",
  },
  {
    icon: ClipboardCheck,
    title: "Consent & Documentation",
    description: "Sign consent forms allowing us to submit a referral on your behalf to CICOA or your local Area Agency on Aging.",
  },
  {
    icon: FileText,
    title: "CICOA Referral",
    description: "We submit a referral to CICOA (or appropriate AAA) to begin the Medicaid waiver assessment process.",
  },
  {
    icon: Calendar,
    title: "Maximus Assessment",
    description: "A Maximus representative will schedule an assessment to determine your Level of Care (LOC) eligibility.",
  },
  {
    icon: Users,
    title: "Choose CareHero",
    description: "Once approved, you select CareHero as your home care provider and we begin services.",
  },
];

const faqs = [
  {
    question: "What is a Medicaid Waiver?",
    answer: "A Medicaid Waiver allows individuals who need long-term care services to receive care in their home or community rather than in a nursing facility. Indiana's waiver programs help cover the cost of home care services for eligible individuals.",
  },
  {
    question: "What is CICOA?",
    answer: "CICOA Aging & In-Home Solutions is the Area Agency on Aging serving Central Indiana. They help coordinate Medicaid waiver services and connect individuals with home care providers like CareHero.",
  },
  {
    question: "What is a Level of Care (LOC) assessment?",
    answer: "The Level of Care assessment, conducted by Maximus, determines whether an individual meets the medical criteria for Medicaid waiver services. It evaluates your care needs to ensure you qualify for home-based services.",
  },
  {
    question: "How long does the process take?",
    answer: "The timeline varies, but typically takes 4-8 weeks from initial referral to service start. We work diligently to move the process along as quickly as possible and keep you informed at every step.",
  },
  {
    question: "Do I need to have Medicaid already?",
    answer: "Not necessarily. We can help guide you through the Medicaid application process if needed. However, you will need to be eligible for Medicaid to receive waiver-funded home care services.",
  },
  {
    question: "What if I'm not sure I qualify?",
    answer: "Contact us! We'll help you understand the eligibility requirements and guide you through the process. There's no obligation, and we're happy to answer your questions.",
  },
];

export default function MedicaidPage() {
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
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              Medicaid & Waiver Support
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Navigating Medicaid and waiver programs can be overwhelming. 
              CareHero is here to guide you through every step of the process.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-3xl font-bold text-foreground mb-6">
                We Help You Access Care
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Many of our clients receive home care services through Indiana's Medicaid waiver programs. 
                These programs help cover the cost of care for eligible individuals, allowing them to 
                receive services in their own homes rather than in a facility.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                CareHero has extensive experience working with CICOA, Maximus, and Indiana Medicaid. 
                We can guide you through the referral and assessment process to help you access the 
                care you need.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20 subtle-gradient">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              The Enrollment Process
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Here's how we help you navigate the Medicaid waiver process from start to finish.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-6 items-start"
                >
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-heading font-bold text-lg">
                      {index + 1}
                    </div>
                  </div>
                  <div className="card-elevated p-6 flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <step.icon className="w-5 h-5 text-accent" />
                      <h3 className="font-heading font-semibold text-lg text-foreground">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-accent">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-accent-foreground"
          >
            <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4">
              Ready to Start the Process?
            </h2>
            <p className="text-accent-foreground/80 mb-6 max-w-2xl mx-auto">
              Complete our intake and consent form to begin. We'll handle the referral 
              process and guide you every step of the way.
            </p>
            <Link to="/get-started">
              <Button variant="gold" size="xl">
                Start Intake & Consent
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Common questions about Medicaid waivers and the enrollment process.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="card-elevated p-6"
                >
                  <div className="flex items-start gap-4">
                    <HelpCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-heading font-semibold text-foreground mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-muted-foreground">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 hero-gradient">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-primary-foreground max-w-3xl mx-auto"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Have Questions? We're Here to Help.
            </h2>
            <p className="text-primary-foreground/80 mb-8">
              Navigating Medicaid can be confusing. Our team is ready to answer your 
              questions and help you understand your options.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button variant="gold" size="xl">
                  Contact Us
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <a href="tel:+13179001234">
                <Button variant="heroOutline" size="xl">
                  <Phone className="w-5 h-5" />
                  (317) 900-1234
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
