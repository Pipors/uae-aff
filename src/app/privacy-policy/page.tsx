import { Metadata } from "next";
import { Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "NEXUS TECH Privacy Policy — how we collect, use, and protect your personal information.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-16 bg-cyber-bg min-h-screen">
      <div className="w-full px-[30px]">
        <div className="space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 text-cyber-cyan text-xs font-bold uppercase tracking-wider">
            <Shield className="w-4 h-4" /> Legal Document
          </div>
          <h1 className="font-heading font-black text-4xl text-zinc-900">Privacy Policy</h1>
          <p className="text-sm text-cyber-muted">Last updated: August 29, 2026</p>
        </div>

        <div className="prose prose-invert prose-sm max-w-none space-y-8">
          <div className="rounded-2xl bg-cyber-glass border border-cyber-border/60 p-6 sm:p-8 space-y-6">
            <section className="space-y-3">
              <h2 className="font-heading font-bold text-xl text-zinc-900">1. Information We Collect</h2>
              <p className="text-zinc-600 leading-relaxed text-sm">
                We collect information you provide directly, such as your name, email address, shipping address, and payment details when placing an order. We also automatically collect certain technical information including your IP address, browser type, device information, and browsing behavior on our site through cookies and similar technologies.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading font-bold text-xl text-zinc-900">2. How We Use Your Information</h2>
              <p className="text-zinc-600 leading-relaxed text-sm">
                Your information is used to process and fulfill orders, communicate about your purchases, improve our services, send promotional communications (with your consent), prevent fraud, and comply with legal obligations. We never sell your personal information to third parties.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading font-bold text-xl text-zinc-900">3. Data Protection</h2>
              <p className="text-zinc-600 leading-relaxed text-sm">
                We implement industry-standard security measures including SSL encryption, secure payment processing, and regular security audits. Your payment information is processed through PCI-DSS compliant payment processors and is never stored on our servers.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading font-bold text-xl text-zinc-900">4. Cookies & Tracking</h2>
              <p className="text-zinc-600 leading-relaxed text-sm">
                We use essential cookies to maintain your session and shopping cart. Analytics cookies help us understand how visitors interact with our site. You can manage cookie preferences through your browser settings.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading font-bold text-xl text-zinc-900">5. Third-Party Services</h2>
              <p className="text-zinc-600 leading-relaxed text-sm">
                We may share information with trusted third-party service providers who assist in operating our website, conducting business, or serving our users, as long as those parties agree to keep this information confidential. This includes payment processors, shipping carriers, and analytics providers.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading font-bold text-xl text-zinc-900">6. Your Rights</h2>
              <p className="text-zinc-600 leading-relaxed text-sm">
                You have the right to access, correct, or delete your personal information. You can opt out of marketing communications at any time. For GDPR/CCPA requests, contact us at privacy@nexustech-store.com.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading font-bold text-xl text-zinc-900">7. Contact</h2>
              <p className="text-zinc-600 leading-relaxed text-sm">
                For privacy-related inquiries, please contact our Data Protection Officer at privacy@nexustech-store.com or write to NEXUS TECH Inc., San Francisco, CA 94105, United States.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
