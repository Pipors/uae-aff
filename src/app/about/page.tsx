import { Metadata } from "next";
import { Cpu, Zap, Target, Shield, Users, Globe } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About NEXUS TECH",
  description: "Learn about NEXUS TECH — our engineering philosophy, founding vision, and commitment to delivering quantum-level consumer electronics.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="py-16 bg-cyber-bg min-h-screen">
      <div className="w-full px-[30px] space-y-20">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-extrabold tracking-wider uppercase">
            <Cpu className="w-3.5 h-3.5" /> Our Engineering Philosophy
          </div>
          <h1 className="font-heading font-black text-4xl sm:text-5xl text-zinc-900 leading-tight">
            Engineered for the<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-violet">
              Future of Technology
            </span>
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 max-w-2xl mx-auto leading-relaxed">
            NEXUS TECH is a premier destination for enthusiasts who demand zero-compromise consumer electronics. We curate flagship products that blend cutting-edge engineering with extraordinary design aesthetics.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Zap, title: "Relentless Innovation", desc: "Every product we curate pushes the boundaries of what consumer technology can achieve." },
            { icon: Target, title: "Precision Curation", desc: "We hand-select only flagship-tier products that meet our exacting performance standards." },
            { icon: Shield, title: "Trust & Transparency", desc: "Genuine products, honest pricing, comprehensive warranties, and zero hidden fees." },
            { icon: Users, title: "Community First", desc: "Our verified buyer reviews and engineering breakdowns help you make informed decisions." },
            { icon: Globe, title: "Global Reach", desc: "Express worldwide delivery with insured courier tracking to over 120+ countries." },
            { icon: Cpu, title: "Technical Excellence", desc: "Deep-dive specifications, benchmark data, and real-world performance analysis for every product." },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="p-6 rounded-2xl bg-cyber-glass border border-cyber-border/60 hover:border-cyber-cyan/40 transition-colors space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-cyber-cyan/10 text-cyber-cyan flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-lg text-zinc-900">{item.title}</h3>
                <p className="text-sm text-zinc-600">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Founding Story */}
        <div className="rounded-3xl bg-cyber-glass border border-cyber-border/60 p-8 sm:p-12 space-y-6">
          <h2 className="font-heading font-black text-3xl text-zinc-900">Our Story</h2>
          <div className="space-y-4 text-zinc-600 leading-relaxed">
            <p>
              NEXUS TECH was founded by a collective of hardware engineers, audiophiles, and user experience designers who shared a singular frustration: finding premium consumer electronics required navigating dozens of subpar storefronts.
            </p>
            <p>
              We envisioned a single destination where every listed product meets flagship standards — from acoustic fidelity and display calibration to build quality and software optimization. Our rigorous evaluation process ensures that only the top 5% of consumer electronics earn a place in our catalog.
            </p>
            <p>
              Today, NEXUS TECH serves tech enthusiasts across 120+ countries with same-day processing, comprehensive 2-year warranties, and a 30-day risk-free return policy. Every purchase is backed by our engineering team&apos;s commitment to excellence.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyber-cyan to-orange-600 text-white font-heading font-bold text-base shadow-cyan-glow/30"
          >
            Explore Our Flagship Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}
