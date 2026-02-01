import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  HandHeart, Activity, Users, Home, Utensils, Car, 
  Heart, Clock, ArrowRight, CheckCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    id: "personal-care",
    icon: HandHeart,
    title: "Personal Care",
    description: "Comprehensive assistance with daily living activities to maintain independence and dignity.",
    features: [
      "Bathing and personal hygiene assistance",
      "Dressing and grooming support",
      "Mobility and transfer assistance",
      "Medication reminders",
      "Toileting assistance",
      "Skin care and monitoring",
    ],
  },
  {
    id: "attendant-care",
    icon: Activity,
    title: "Attendant Care",
    description: "Supportive services for individuals who need help with routine daily tasks and activities.",
    features: [
      "Light housekeeping",
      "Meal preparation",
      "Laundry assistance",
      "Appointment scheduling",
      "Errand running",
      "Transportation assistance",
    ],
  },
  {
    id: "respite",
    icon: Users,
    title: "Respite Care",
    description: "Temporary relief for family caregivers, providing you time to rest while ensuring your loved one receives quality care.",
    features: [
      "Short-term care coverage",
      "Flexible scheduling",
      "Emergency respite services",
      "Weekend and holiday coverage",
      "Overnight care options",
      "Vacation coverage for families",
    ],
  },
  {
    id: "companion",
    icon: Heart,
    title: "Companion Care",
    description: "Friendly companionship and social engagement to enhance quality of life and reduce isolation.",
    features: [
      "Conversation and social interaction",
      "Recreational activities",
      "Reading and games",
      "Accompaniment to appointments",
      "Light meal preparation",
      "Safety supervision",
    ],
  },
  {
    id: "homemaker",
    icon: Home,
    title: "Homemaker Services",
    description: "Assistance with household tasks to maintain a safe, clean, and comfortable living environment.",
    features: [
      "Light housekeeping and cleaning",
      "Laundry and ironing",
      "Grocery shopping",
      "Meal planning and preparation",
      "Home organization",
      "Pet care assistance",
    ],
  },
  {
    id: "transportation",
    icon: Car,
    title: "Transportation Services",
    description: "Safe, reliable transportation to medical appointments, errands, and social activities.",
    features: [
      "Medical appointment transportation",
      "Pharmacy runs",
      "Grocery and shopping trips",
      "Social outings",
      "Religious services",
      "Family visits",
    ],
  },
];

export default function ServicesPage() {
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
              Our Services
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Comprehensive home care solutions tailored to meet your unique needs. 
              We provide the support you need to live independently and comfortably at home.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="space-y-16">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                id={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-4">
                    <service.icon className="w-4 h-4" />
                    {service.title}
                  </div>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">
                    {service.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/get-started">
                    <Button variant="cta">
                      Get Started
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
                
                <div className={`${index % 2 === 1 ? "lg:order-1" : ""}`}>
                  <div className="card-elevated p-8 lg:p-12">
                    <div className="w-20 h-20 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                      <service.icon className="w-10 h-10 text-accent" />
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Flexible scheduling available</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Trained, vetted caregivers</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Heart className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Personalized care plans</span>
                      </div>
                    </div>
                  </div>
                </div>
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
              Not Sure Which Services You Need?
            </h2>
            <p className="text-primary-foreground/80 mb-8">
              Contact us for a free consultation. We'll help you understand your options 
              and create a personalized care plan that fits your needs and budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/get-started">
                <Button variant="gold" size="xl">
                  Schedule Consultation
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/medicaid">
                <Button variant="heroOutline" size="xl">
                  Medicaid Information
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
