import { Header } from "@/components/Header";
import { HeroSection, FeaturesSection } from "@/components/HeroSection";
import { SnippetGallery } from "@/components/SnippetGallery";
import { ActivityFeed } from "@/components/ActivityFeed";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Code2, Github, Twitter } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        
        {/* Recent Snippets Section */}
        <section className="py-16 border-t border-border">
          <div className="container px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge variant="language" className="mb-4">Trending</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Popular <span className="gradient-text">Snippets</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover the most loved code snippets from our community.
              </p>
            </motion.div>
            
            <div className="grid lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3">
                <SnippetGallery />
              </div>
              <div className="hidden lg:block">
                <div className="sticky top-24">
                  <ActivityFeed />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <div className="container px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Share Your Code?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of developers sharing knowledge and building together.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="/create">
                  <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-lg font-semibold transition-all duration-200 bg-gradient-to-r from-primary to-[hsl(210_100%_60%)] text-primary-foreground shadow-lg glow-primary hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] h-14 px-10">
                    Create Your First Snippet
                  </button>
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-[hsl(210_100%_60%)]">
                <Code2 className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">CodeShare</span>
            </div>
            
            <nav className="flex items-center gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </nav>

            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div className="text-center text-sm text-muted-foreground mt-8">
            © 2024 CodeShare. Built with ❤️ for developers.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
