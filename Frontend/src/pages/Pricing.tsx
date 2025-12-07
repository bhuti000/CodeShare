import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      features: [
        "Create 10 snippets",
        "Basic syntax highlighting",
        "Community access"
      ],
    },
    {
      name: "Pro",
      price: "$9/month",
      features: [
        "Unlimited snippets",
        "Real-time collaboration",
        "Comments & reviews",
        "Activity feed",
      ],
      highlight: true,
    },
    {
      name: "Team",
      price: "$29/month",
      features: [
        "Team workspaces",
        "Role-based access",
        "Admin controls",
        "Advanced analytics",
      ],
    },
  ];

  return (
    <div className="container py-20 px-4">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-center mb-4"
      >
        Pricing Plans
      </motion.h1>

      <p className="text-center text-muted-foreground mb-12">
        Simple, transparent pricing. No hidden fees.
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`border rounded-xl p-6 shadow-lg ${
              plan.highlight ? "border-primary shadow-primary/30" : ""
            }`}
          >
            <h2 className="text-2xl font-semibold mb-2">{plan.name}</h2>
            <p className="text-3xl font-bold mb-6">{plan.price}</p>

            <ul className="space-y-2">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-muted-foreground">
                  <Check className="h-4 w-4 text-primary" /> {f}
                </li>
              ))}
            </ul>

            <button className="mt-6 w-full py-2 rounded-lg bg-primary text-white">
              Choose Plan
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
