import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Code2, GitBranch, MessageSquare, Sparkles, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="container relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center max-w-4xl mx-auto"
        >
          <Badge variant="language" className="mb-6">
            <Sparkles className="h-3 w-3 mr-1" />
            Real-time Collaboration
          </Badge>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Share Code.
            <br />
            <span className="gradient-text">Build Together.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10">
            The modern platform for developers to create, share, and review code snippets collaboratively. 
            Real-time editing, threaded discussions, and syntax highlighting for 100+ languages.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
            <Link to="/create">
              <Button variant="hero" size="xl">
                Start Creating
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/explore">
              <Button variant="outline" size="xl">
                Explore Snippets
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-8 md:gap-16"
          >
            {[
              { value: "50K+", label: "Snippets Shared" },
              { value: "12K+", label: "Active Users" },
              { value: "100+", label: "Languages" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export function FeaturesSection() {
  const features = [
    {
      icon: Code2,
      title: "Syntax Highlighting",
      description: "Support for 100+ programming languages with intelligent syntax highlighting powered by Monaco Editor.",
    },
    {
      icon: Users,
      title: "Real-time Collaboration",
      description: "Edit code together in real-time. See changes as they happen with live cursors and presence indicators.",
    },
    {
      icon: MessageSquare,
      title: "Line-by-Line Reviews",
      description: "Leave comments on specific lines just like GitHub. Threaded discussions keep conversations organized.",
    },
    {
      icon: GitBranch,
      title: "Version History",
      description: "Every change is tracked. Browse, compare, and restore previous versions with a single click.",
    },
    {
      icon: Zap,
      title: "Instant Sharing",
      description: "Generate shareable links instantly. Control who can view, edit, or comment on your snippets.",
    },
    {
      icon: Sparkles,
      title: "Smart Search",
      description: "Full-text search across all snippets. Filter by language, tags, or author to find exactly what you need.",
    },
  ];

  return (
    <section className="py-24 relative">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="accent" className="mb-4">Features</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to
            <span className="gradient-text"> Collaborate</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Built for developers who want to share knowledge and work together seamlessly.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-6 rounded-2xl border border-border bg-card/50 hover:bg-card hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
            >
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 group-hover:from-primary/30 group-hover:to-primary/10 transition-all">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
