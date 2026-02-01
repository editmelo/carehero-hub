import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Heart, Shield, Clock, Users, Phone, CheckCircle, 
  ArrowRight, UserCheck, FileText, Headphones, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";

const whyChooseUs = [
  {
    icon: UserCheck,
    title: "Experienced, Compassionate Caregivers",
    description: "Our caregivers are thoroughly vetted, trained, and genuinely care about making a difference in your life.",
  },
  {
    icon: Star,
    title: "Competitive Caregiver Pay",
    description: "We pay our caregivers well, which means better retention, consistency, and quality of care for you.",
  },
  {
    icon: Shield,
    title: "HIPAA-Secure Communication",
    description: "Your privacy matters. All communication and documentation is fully HIPAA-compliant and secure.",
  },
  {
    icon: Clock,
    title: "Flexible Scheduling",
    description: "Care that works around your life. We offer flexible scheduling tailored to your unique needs.",
  },
  {
    icon: FileText,
    title: "Full Case Coordination",
    description: "Ongoing support from our team with documentation, scheduling, and care plan management.",
  },
  {
    icon: Heart,
    title: "Medicaid Waiver Expertise",
    description: "We help you navigate Indiana's Medicaid waiver programs so you can access the care you deserve.",
  },
];

const services = [
  "Non-medical support with activities of daily living (ADLs)",
  "Personal care assistance (bathing, dressing, grooming)",
  "Companionship and emotional support",
  "Safety assistance and fall prevention",
  "Meal preparation and light housekeeping",
  "Medication reminders",
  "Transportation to appointments",
  "Respite care for family caregivers",
];

const howItWorks = [
  {
    step: "01",
    title: "Connect With Us",
    description: "Call, email, or fill out our Client Interest Form. We'll respond quickly to learn about your situation.",
  },
  {
    step: "02",
    title: "Assessment & Planning",
    description: "We'll learn about your needs, schedule, preferences, and help determine your eligibility for Medicaid services.",
  },
  {
    step: "03",
    title: "Caregiver Match",
    description: "Get paired with a trusted, compatible caregiver who fits your requirements and personality.",
  },
  {
    step: "04",
    title: "Start Services",
    description: "Receive compassionate, consistent care with ongoing coordination and support from our team.",
  },
];

const peaceOfMind = [
  {
    icon: Users,
    title: "Consistent Caregiver Relationships",
    description: "Avoid frequent turnover and build trust with caregivers who know you.",
  },
  {
    icon: Shield,
    title: "Full Regulatory Compliance",
    description: "We maintain strict compliance with all state and Medicaid regulations.",
  },
  {
    icon: Headphones,
    title: "24/7 Support Line",
    description: "Urgent questions or schedule changes? Our team is available around the clock.",
  },
  {
    icon: FileText,
    title: "Transparent Documentation",
    description: "Clear records and communication so you always know what's happening with your care.",
  },
];

export default function ClientsPage() {
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
              <Heart className="w-4 h-4" />
              We Love Our Clients
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              Personalized Care with a Human Touch
            </h1>
            <p className="text-lg text-primary-foreground/80 mb-8">
              CareHero provides high-quality, in-home attendant care services through 
              Indiana's Medicaid waiver program. Experience compassionate care that 
              puts your needs first.
            </p>
            <Link to="/get-started">
              <Button variant="gold" size="xl">
                Become a Client Today
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Choose CareHero */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose CareHero?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're committed to providing exceptional care that improves your quality of life 
              while giving you and your family peace of mind.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-elevated p-6"
              >
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="py-20 subtle-gradient">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                Our Services
              </h2>
              <p className="text-muted-foreground mb-8">
                We specialize in non-medical home care services that help you maintain 
                independence and dignity in the comfort of your own home.
              </p>
              <ul className="space-y-4">
                {services.map((service, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{service}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card-elevated p-8 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-foreground mb-4">
                Who We Serve
              </h3>
              <p className="text-muted-foreground mb-6">
                We provide care for individuals of all ages — including children, 
                adults, and seniors with disabilities or medical conditions that 
                require assistance with daily living.
              </p>
              <p className="text-sm text-muted-foreground italic">
                "You care for others. We care for you."
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Getting started with CareHero is simple. Here's what to expect.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl font-bold text-accent/20 mb-4">
                  {item.step}
                </div>
                <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Peace of Mind */}
      <section className="py-20 subtle-gradient">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Peace of Mind Features
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We go above and beyond to ensure you feel safe, supported, and cared for.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {peaceOfMind.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-elevated p-6 text-center"
              >
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </motion.div>
            ))}
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
              Start Your Journey Today
            </h2>
            <p className="text-primary-foreground/80 mb-8">
              Ready to experience compassionate, personalized home care? 
              Get in touch with our team to learn more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/get-started">
                <Button variant="gold" size="xl">
                  Become a Client
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="xl" className="bg-white text-primary border-white hover:bg-white/90">
                  <Phone className="w-5 h-5" />
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
