import { ShieldCheck, Truck, RefreshCw, Cpu, Award } from "lucide-react";

export default function TrustStrip() {
  const TRUST_ITEMS = [
    {
      icon: ShieldCheck,
      title: "2-Year Hardware Warranty",
      desc: "Full comprehensive cyber protection coverage",
    },
    {
      icon: Truck,
      title: "Global Express Delivery",
      desc: "Insured courier tracking on all tech shipments",
    },
    {
      icon: RefreshCw,
      title: "30-Day Risk-Free Returns",
      desc: "Zero hassle returns & instant store refunds",
    },
    {
      icon: Award,
      title: "100% Genuine Guaranteed",
      desc: "Direct authentic factory sealed products",
    },
  ];

  return (
    <section className="py-12 bg-cyber-darker">
      <div className="w-full px-[30px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRUST_ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-4 p-5 rounded-2xl bg-cyber-glass border border-cyber-border/40 hover:border-cyber-cyan/40 transition-colors"
              >
                <div className="p-3 rounded-2xl bg-cyber-cyan/10 text-cyber-cyan shrink-0">
                  <Icon className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-zinc-900">{item.title}</h4>
                  <p className="text-xs text-cyber-muted mt-0.5">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
