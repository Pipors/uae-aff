import { Metadata } from "next";
import { Mail, MapPin, Phone, Clock, MessageSquare, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Support",
  description: "Get in touch with NEXUS TECH support. We offer 24/7 engineering assistance for all your tech queries.",
  alternates: { canonical: "/contact" },
};

const FAQS = [
  { q: "What is your return policy?", a: "We offer a 30-day hassle-free return policy on all products. Items must be in original condition with packaging." },
  { q: "Do you ship internationally?", a: "Yes! We ship to 120+ countries with express insured courier services. Free shipping on orders over $50." },
  { q: "How long does delivery take?", a: "US domestic: 2-5 business days. International: 5-12 business days depending on location." },
  { q: "Are all products genuine?", a: "Absolutely. Every product is 100% genuine, factory-sealed, and backed by our 2-year warranty." },
];

export default function ContactPage() {
  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />

    <div className="py-16 bg-cyber-bg min-h-screen">
      <div className="w-full px-[30px] space-y-12">
        <div className="text-center space-y-4">
          <h1 className="font-heading font-black text-4xl text-zinc-900">Contact Support</h1>
          <p className="text-base text-zinc-600 max-w-xl mx-auto">
            Our engineering support team is available 24/7 to help with product inquiries, order tracking, and technical assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <div className="space-y-4">
            {[
              { icon: Mail, title: "Email Us", value: "support@nexustech-store.com", sub: "Response within 2 hours" },
              { icon: Phone, title: "Call Us", value: "+1 (800) NEXUS-01", sub: "Mon-Fri 9AM-9PM EST" },
              { icon: MapPin, title: "Headquarters", value: "San Francisco, CA 94105", sub: "United States" },
              { icon: Clock, title: "Business Hours", value: "24/7 Online Support", sub: "Always available" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="p-5 rounded-2xl bg-cyber-glass border border-cyber-border/60 flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-cyber-cyan/10 text-cyber-cyan shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-sm text-zinc-900">{item.title}</h4>
                    <p className="text-sm text-zinc-700 mt-0.5">{item.value}</p>
                    <p className="text-xs text-cyber-muted">{item.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 p-8 rounded-3xl bg-cyber-glass border border-cyber-border/60 space-y-6">
            <h2 className="font-heading font-bold text-xl text-zinc-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-cyber-cyan" /> Send a Message
            </h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-cyber-muted uppercase tracking-wider mb-1.5">Full Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl bg-cyber-card border border-zinc-200 text-zinc-900 text-sm focus:border-cyber-cyan focus:outline-none" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-cyber-muted uppercase tracking-wider mb-1.5">Email</label>
                  <input type="email" className="w-full px-4 py-3 rounded-xl bg-cyber-card border border-zinc-200 text-zinc-900 text-sm focus:border-cyber-cyan focus:outline-none" placeholder="john@example.com" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-cyber-muted uppercase tracking-wider mb-1.5">Subject</label>
                <select className="w-full px-4 py-3 rounded-xl bg-cyber-card border border-zinc-200 text-zinc-900 text-sm focus:border-cyber-cyan focus:outline-none">
                  <option>Product Inquiry</option>
                  <option>Order Status</option>
                  <option>Technical Support</option>
                  <option>Returns & Warranty</option>
                  <option>Partnership / Business</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-cyber-muted uppercase tracking-wider mb-1.5">Message</label>
                <textarea rows={5} className="w-full px-4 py-3 rounded-xl bg-cyber-card border border-zinc-200 text-zinc-900 text-sm focus:border-cyber-cyan focus:outline-none resize-none" placeholder="Describe your inquiry in detail..." />
              </div>
              <button type="submit" className="px-8 py-3.5 rounded-xl bg-cyber-cyan text-white font-heading font-bold text-sm shadow-cyan-glow/30 hover:scale-[1.02] transition-all">
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="rounded-3xl bg-cyber-glass border border-cyber-border/60 p-8 sm:p-10 space-y-6">
          <h2 className="font-heading font-bold text-2xl text-zinc-900 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-cyber-cyan" /> Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="p-5 rounded-2xl bg-cyber-card/60 border border-zinc-200 space-y-2">
                <h4 className="font-heading font-bold text-sm text-zinc-900">{faq.q}</h4>
                <p className="text-xs text-zinc-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
