import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Shield, Clock, Users, Award, CheckCircle, 
  ArrowRight, Star, Phone, HandHeart, Home as HomeIcon,
  Sparkles, Activity, ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import heroImage from "@/assets/hero-care.jpg";

const services = [
  {
    icon: HandHeart,
    title: "Personal Care",
    description: "Assistance with daily living activities including bathing, dressing, and grooming.",
  },
  {
    icon: Activity,
    title: "Attendant Care",
    description: "Supportive care services for individuals who need help with routine daily tasks.",
  },
  {
    icon: Users,
    title: "Respite Care",
    description: "Temporary relief for family caregivers, giving them time to rest and recharge.",
  },
  {
    icon: HomeIcon,
    title: "Companion Care",
    description: "Friendly companionship and assistance with light housekeeping and errands.",
  },
];

const steps = [
  { step: 1, title: "Contact Us", description: "Reach out via phone, form, or referral" },
  { step: 2, title: "Assessment", description: "We evaluate your care needs together" },
  { step: 3, title: "Care Plan", description: "Custom plan tailored to your situation" },
  { step: 4, title: "Matching", description: "We pair you with the ideal caregiver" },
  { step: 5, title: "Care Begins", description: "Quality care starts in your home" },
];

const trustSignals = [
  { value: "10+", label: "Years of Service" },
  { value: "500+", label: "Families Served" },
  { value: "100%", label: "Background Checked" },
  { value: "4.9★", label: "Client Rating" },
];

const testimonials = [
  {
    quote: "CareHero gave my mother the independence she needed while giving our family peace of mind. Their caregivers are truly exceptional.",
    author: "Sarah M.",
    role: "Family Member, Marion County",
  },
  {
    quote: "The team at CareHero goes above and beyond. They treat my father like family, and I couldn't be more grateful.",
    author: "Michael T.",
    role: "Family Member, Hamilton County",
  },
  {
    quote: "Professional, compassionate, and reliable. CareHero has been a blessing for our family during a difficult time.",
    author: "Jennifer L.",
    role: "Family Member, Hendricks County",
  },
];

const faqs = [
  {
    question: "How quickly can I start working?",
    answer: "Most caregivers are approved within 24–48 hours after submitting documents and completing training."
  },
  {
    question: "Do I have to leave my current clients?",
    answer: "No! CareHero Home Care Services lets you keep the clients you already work with. We make the transition seamless."
  },
  {
    question: "Is the up to $24/hour guaranteed?",
    answer: "Yes. As long as you're working with approved clients and logging hours through the app, you earn up to $24/hour."
  },
  {
    question: "How do I get paid?",
    answer: "You'll be paid weekly via direct deposit. You can track earnings and download pay stubs directly from the app."
  },
  {
    question: "Can I switch to CareHero Home Care Services and keep my caregiver?",
    answer: "Yes! If you're a client who loves your caregiver, we'll help you switch agencies while keeping the same person in your home."
  },
];

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* Glide App Banner */}
      <div className="bg-gold text-primary py-2 text-center">
        <p className="text-sm font-medium flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4" />
          Glide app coming soon — Manage your care on the go!
          <Sparkles className="w-4 h-4" />
        </p>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center hero-gradient overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Compassionate home care"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/80" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-primary-foreground"
            >
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Care at Home,<br />
                <span className="text-gradient-gold">With a Hero's Heart.</span>
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-xl">
                Professional, compassionate home care services for you and your loved ones 
                throughout Central Indiana. Let us be your partner in care.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/get-started">
                  <Button variant="hero" size="xl">
                    Get Started
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/refer">
                  <Button variant="heroOutline" size="xl">
                    Refer Someone
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-6">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-6 h-6 text-gold fill-gold" />
                  ))}
                </div>
                <p className="text-sm text-primary-foreground/80">
                  <span className="text-gold font-semibold">500+</span> families trust CareHero
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <img 
                  src={heroImage} 
                  alt="Caring for your loved ones"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-background rounded-xl p-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">100% Background Checked</p>
                      <p className="text-sm text-muted-foreground">All caregivers verified</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-12 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {trustSignals.map((signal, index) => (
              <motion.div
                key={signal.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="font-heading text-3xl md:text-4xl font-bold text-accent">{signal.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{signal.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Services
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive home care solutions tailored to meet your unique needs and preferences.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-elevated p-6 text-center group"
              >
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                  <service.icon className="w-8 h-8 text-accent" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/services">
              <Button variant="outline" size="lg">
                View All Services
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 subtle-gradient">
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
              Getting started with CareHero is simple. We guide you every step of the way.
            </p>
          </motion.div>

          <div className="relative">
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2" />
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center mx-auto mb-4 font-heading font-bold text-lg relative z-10">
                    {step.step}
                  </div>
                  <h3 className="font-heading font-semibold text-foreground mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Families Say
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hear from the families we've had the privilege to serve.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-elevated p-8"
              >
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-5 h-5 text-gold fill-gold" />
                  ))}
                </div>
                <p className="text-foreground mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-20 subtle-gradient">
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
              Have questions? We've got answers.
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
                  className="bg-background rounded-xl border border-border px-6 shadow-sm"
                >
                  <AccordionTrigger className="text-left font-heading font-semibold text-foreground hover:no-underline py-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-6">
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
            className="text-center text-primary-foreground"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Ready to Experience the CareHero Difference?
            </h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Contact us today to learn how we can support you and your loved ones with compassionate, 
              professional home care services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/get-started">
                <Button variant="gold" size="xl">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <a href="tel:+18556227324">
                <Button variant="heroOutline" size="xl">
                  <Phone className="w-5 h-5" />
                  (855) 6CARE24
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
