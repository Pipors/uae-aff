import { Metadata } from "next";
import { Tag, ExternalLink } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description: "NEXUS TECH Affiliate Disclosure — transparency about our Amazon Associates partnership and how affiliate links work.",
  alternates: { canonical: "/affiliate-disclosure" },
};

export default function AffiliateDisclosurePage() {
  return (
    <div className="py-16 bg-cyber-bg min-h-screen">
      <div className="w-full px-[30px]">
        <div className="space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Tag className="w-4 h-4" /> Affiliate Transparency
          </div>
          <h1 className="font-heading font-black text-4xl text-zinc-900">Affiliate Disclosure</h1>
          <p className="text-sm text-cyber-muted">Last updated: August 29, 2026</p>
        </div>

        <div className="rounded-2xl bg-cyber-glass border border-cyber-border/60 p-6 sm:p-8 space-y-8">
          {/* Amazon Associate Statement */}
          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
            <h2 className="font-heading font-bold text-lg text-amber-700 dark:text-amber-300 flex items-center gap-2">
              <ExternalLink className="w-5 h-5" /> Amazon Associates Program
            </h2>
            <p className="text-sm text-zinc-700 leading-relaxed">
              <strong>NEXUS TECH</strong> (nexustech-store.com) is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com.
            </p>
            <p className="text-sm font-bold text-amber-700 dark:text-amber-300">
              As an Amazon Associate, I earn from qualifying purchases.
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-xl text-zinc-900">How Affiliate Links Work</h2>
            <p className="text-zinc-600 leading-relaxed text-sm">
              Some of the links on this website are affiliate links. This means if you click on the link and purchase an item, we will receive an affiliate commission at no extra cost to you. The price you pay remains the same regardless of whether you use our affiliate link or navigate to Amazon independently.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-xl text-zinc-900">Pricing Information</h2>
            <p className="text-zinc-600 leading-relaxed text-sm">
              All prices displayed on NEXUS TECH are indicative and sourced from Amazon at the time of listing. <strong className="text-zinc-900">Prices and availability are subject to change without notice.</strong> The actual price and availability of any product may differ from what is displayed on our site. Final pricing is always determined at the point of sale on Amazon.com.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-xl text-zinc-900">Editorial Independence</h2>
            <p className="text-zinc-600 leading-relaxed text-sm">
              Our product reviews, recommendations, and editorial content are created independently. Affiliate partnerships do not influence our product evaluations, ratings, or inclusion in our catalog. We recommend products based solely on their engineering quality, performance benchmarks, and user experience value.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-xl text-zinc-900">Your Trust Matters</h2>
            <p className="text-zinc-600 leading-relaxed text-sm">
              We are committed to full transparency. Affiliate links are clearly identified throughout the site. We will never recommend a product solely for the purpose of earning a commission. If you have any questions about our affiliate relationships, please{" "}
              <Link href="/contact" className="text-cyber-cyan hover:underline">contact us</Link>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-xl text-zinc-900">FTC Compliance</h2>
            <p className="text-zinc-600 leading-relaxed text-sm">
              This disclosure is provided in accordance with the Federal Trade Commission&apos;s 16 CFR Part 255 guidelines concerning the use of endorsements and testimonials in advertising. We are committed to honest, transparent communication with our audience.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
