import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Heart, Shield, Clock, Users, Phone, CheckCircle, 
  ArrowRight, UserCheck, FileText, Headphones, Star, Quote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

const faqs = [
  {
    question: "What services does CareHero provide?",
    answer: "CareHero provides non-medical home care services including personal care assistance (bathing, dressing, grooming), companionship, meal preparation, light housekeeping, medication reminders, transportation to appointments, and respite care for family caregivers. We specialize in helping with activities of daily living (ADLs)."
  },
  {
    question: "How do I know if I qualify for Medicaid-covered home care?",
    answer: "Eligibility for Indiana's Medicaid waiver programs depends on factors like age, disability status, income level, and care needs. Our team can help you understand your options and guide you through the application process. Contact us for a free eligibility assessment."
  },
  {
    question: "How are caregivers selected and trained?",
    answer: "All CareHero caregivers undergo thorough background checks, reference verification, and skills assessments. They receive ongoing training in personal care, safety protocols, and communication. We carefully match caregivers with clients based on needs, personality, and preferences to ensure the best possible relationship."
  },
  {
    question: "Can I choose my own caregiver?",
    answer: "Yes! We believe the caregiver-client relationship is essential to quality care. You'll meet potential caregivers and have input in the selection process. If you have a family member or friend who wants to become your caregiver, we can help with that process too."
  },
  {
    question: "What if I need to change my schedule or caregiver?",
    answer: "We understand that needs change. You can adjust your care schedule at any time by contacting our office. If you'd like to change caregivers for any reason, we'll work with you to find a better match. Our 24/7 support line is available for urgent schedule changes."
  },
  {
    question: "Is there a cost to me for services?",
    answer: "For clients who qualify for Indiana's Medicaid waiver programs, services are typically covered at no out-of-pocket cost. For private pay clients, we offer competitive rates. Contact us for a personalized assessment and pricing information."
  },
  {
    question: "How quickly can services begin?",
    answer: "Once you're approved for services through the Medicaid waiver program or choose private pay, we can typically begin care within 1-2 weeks. We'll work to match you with the right caregiver and create a care plan that meets your needs."
  },
  {
    question: "What areas does CareHero serve?",
    answer: "CareHero provides home care services throughout Central Indiana, including Indianapolis and surrounding counties. Contact us to confirm service availability in your specific area."
  },
];

const testimonials = [
  {
    quote: "CareHero has been a blessing for our family. My mother's caregiver, Maria, treats her like her own grandmother. The consistency and compassion we've experienced is beyond what we hoped for.",
    name: "Sarah M.",
    relationship: "Daughter of Client",
    location: "Indianapolis, IN",
  },
  {
    quote: "After trying two other agencies, we finally found CareHero. The difference is night and day. They actually listen to what we need and matched us with the perfect caregiver.",
    name: "James T.",
    relationship: "Son of Client", 
    location: "Carmel, IN",
  },
  {
    quote: "The team helped us navigate the Medicaid process when we didn't know where to start. Now my husband gets the daily care he needs, and I finally have some peace of mind.",
    name: "Dorothy L.",
    relationship: "Wife of Client",
    location: "Fishers, IN",
  },
  {
    quote: "What I appreciate most is the communication. I always know when the caregiver arrives and leaves, and the office responds quickly whenever I have questions.",
    name: "Michael R.",
    relationship: "Family Caregiver",
    location: "Greenwood, IN",
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

      {/* Testimonials */}
      <section className="py-20 subtle-gradient">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Our Clients Say
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hear from families who have experienced the CareHero difference.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-elevated p-8 relative"
              >
                <Quote className="w-10 h-10 text-accent/20 absolute top-6 right-6" />
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-foreground mb-6 italic leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="border-t border-border pt-4">
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.relationship}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                </div>
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

      {/* FAQ Section */}
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
              Have questions? We have answers. Here are some of the most common questions we receive.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="card-elevated px-6 border-none"
                >
                  <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
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
