import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, Target, Award, Users, Shield, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const values = [
  {
    icon: Heart,
    title: "Compassion",
    description: "We treat every client with genuine care, empathy, and respect, just as we would our own family.",
  },
  {
    icon: Shield,
    title: "Integrity",
    description: "We uphold the highest ethical standards in all our interactions and care delivery.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We continuously strive to deliver the highest quality care and exceed expectations.",
  },
  {
    icon: Users,
    title: "Community",
    description: "We're deeply committed to serving and strengthening our Central Indiana communities.",
  },
];

const whyUs = [
  "Thoroughly vetted and trained caregivers",
  "Personalized care plans tailored to your needs",
  "24/7 support and communication",
  "Medicaid and waiver program expertise",
  "Local, family-owned business",
  "Comprehensive background checks",
  "Ongoing caregiver training and development",
  "Flexible scheduling options",
];

export default function AboutPage() {
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
              About CareHero
            </h1>
            <p className="text-lg text-primary-foreground/80">
              A family-owned home care agency dedicated to providing compassionate, 
              professional care services throughout Central Indiana.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Target className="w-4 h-4" />
                Our Mission
              </div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                Empowering Independence, Enriching Lives
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                At CareHero, our mission is to provide exceptional home care services that empower 
                individuals to live independently and with dignity in the comfort of their own homes. 
                We believe everyone deserves access to compassionate, professional care that respects 
                their unique needs and preferences.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Founded with a deep commitment to our Central Indiana community, we strive to be 
                more than just a home care provider – we aim to be trusted partners in the 
                well-being of the families we serve.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-secondary rounded-2xl p-8 lg:p-12">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center">
                    <Heart className="w-8 h-8 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-2xl text-foreground">CareHero</p>
                    <p className="text-muted-foreground">Home Care Services</p>
                  </div>
                </div>
                <blockquote className="text-lg text-foreground italic border-l-4 border-accent pl-6">
                  "Care at home, with a hero's heart. Every day, we strive to be the heroes 
                  our clients and their families need."
                </blockquote>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 subtle-gradient">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Values
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These core values guide everything we do at CareHero.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-elevated p-6 text-center"
              >
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why CareHero Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                Why Choose CareHero?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                We understand that choosing a home care provider is an important decision. 
                Here's why families throughout Central Indiana trust CareHero with their 
                loved ones' care.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {whyUs.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-primary rounded-2xl p-8 lg:p-12 text-primary-foreground"
            >
              <h3 className="font-heading text-2xl font-bold mb-6">
                Serving Central Indiana
              </h3>
              <p className="text-primary-foreground/80 mb-6">
                We proudly serve families throughout:
              </p>
              <ul className="space-y-3 mb-8">
                {["Marion County", "Hamilton County", "Hendricks County", "Johnson County", "Hancock County"].map((county) => (
                  <li key={county} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-gold" />
                    <span>{county}</span>
                  </li>
                ))}
              </ul>
              <Link to="/contact">
                <Button variant="gold" size="lg" className="w-full">
                  Contact Us Today
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
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
              Join the CareHero Family
            </h2>
            <p className="text-primary-foreground/80 mb-8">
              Whether you're seeking care for a loved one or looking to join our team of 
              dedicated caregivers, we'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/get-started">
                <Button variant="gold" size="xl">
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/careers">
                <Button variant="heroOutline" size="xl">
                  Join Our Team
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
