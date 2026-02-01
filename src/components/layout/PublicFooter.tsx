import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Linkedin, Instagram } from "lucide-react";
import logoWhite from "@/assets/logo-white.png";

const footerLinks = {
  services: [
    { label: "Personal Care", href: "/services#personal-care" },
    { label: "Attendant Care", href: "/services#attendant-care" },
    { label: "Respite Care", href: "/services#respite" },
    { label: "Companion Care", href: "/services#companion" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Medicaid Support", href: "/medicaid" },
    { label: "Contact", href: "/contact" },
  ],
  resources: [
    { label: "Get Started", href: "/get-started" },
    { label: "Refer Someone", href: "/refer" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "HIPAA Disclaimer", href: "/hipaa" },
  ],
};

export function PublicFooter() {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center">
              <img 
                src={logoWhite} 
                alt="CareHero Home Care" 
                className="h-16 w-auto"
              />
            </Link>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Providing compassionate, professional home care services throughout Central Indiana. 
              Care at home, with a hero's heart.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="https://www.facebook.com/careherohomecare" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://www.linkedin.com/company/carehero-homecare/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="https://www.instagram.com/careherohomecare/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-6">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <a 
                    href={link.href}
                    className="text-primary-foreground/80 hover:text-gold transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-6">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href}
                    className="text-primary-foreground/80 hover:text-gold transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gold mt-0.5" />
                <div>
                  <a href="tel:+18556227324" className="text-sm hover:text-gold transition-colors block">
                    (855) 6CARE24
                  </a>
                  <a href="tel:+18556227324" className="text-sm hover:text-gold transition-colors text-primary-foreground/70">
                    (855) 622-7324
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gold mt-0.5" />
                <div>
                  <a href="mailto:info@careherohomecare.com" className="text-sm hover:text-gold transition-colors">
                    info@careherohomecare.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold mt-0.5" />
                <div className="text-sm text-primary-foreground/80">
                  Indianapolis, IN<br />
                  Serving Central Indiana
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} CareHero Home Care. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-primary-foreground/60">
            <Link to="/privacy" className="hover:text-primary-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-primary-foreground transition-colors">
              Terms of Service
            </Link>
            <Link to="/hipaa" className="hover:text-primary-foreground transition-colors">
              HIPAA Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
