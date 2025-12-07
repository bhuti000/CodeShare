import { useState } from "react";
import { motion } from "framer-motion";

export default function Docs() {
  const sections = [
    { id: "intro", title: "Introduction" },
    { id: "features", title: "Platform Features" },
    { id: "api", title: "API Endpoints" },
    { id: "auth", title: "Authentication" },
    { id: "snippets", title: "Snippets" },
    { id: "realtime", title: "Real-time Collaboration" },
  ];

  const [active, setActive] = useState("intro");

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border p-6 sticky top-0 h-screen hidden md:block">
        <h2 className="text-xl font-bold mb-6">Documentation</h2>

        <nav className="flex flex-col gap-2">
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => {
                setActive(sec.id);
                document.getElementById(sec.id)?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`text-left px-3 py-2 rounded-md transition ${
                active === sec.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              {sec.title}
            </button>
          ))}
        </nav>
      </aside>

      {/* Content Area */}
      <main className="flex-1 p-10 space-y-16">
        <Section id="intro" title="Introduction">
          <p className="text-muted-foreground">
            Welcome to the CodeShare documentation. Learn how the platform works,
            how to create snippets, collaborate in real-time, and more.
          </p>
        </Section>

        <Section id="features" title="Platform Features">
          <ul className="list-disc ml-6 text-muted-foreground space-y-2">
            <li>Real-time code collaboration</li>
            <li>Syntax-highlighted snippets</li>
            <li>Comments & Review system</li>
            <li>Authentication & Authorization</li>
            <li>Activity Feed</li>
          </ul>
        </Section>

        <Section id="api" title="API Endpoints">
          <pre className="bg-black/20 p-4 rounded-lg text-sm">
GET /api/snippets
POST /api/snippets
GET /api/comments/:id
POST /api/comments
          </pre>
        </Section>

        <Section id="auth" title="Authentication">
          <p className="text-muted-foreground">
            CodeShare uses JWT-based authentication. Login returns a signed token
            which the frontend stores in localStorage.
          </p>
        </Section>

        <Section id="snippets" title="Snippets">
          <p className="text-muted-foreground">
            Snippets include title, language, content, author, and version history.
          </p>
        </Section>

        <Section id="realtime" title="Real-time Collaboration">
          <p className="text-muted-foreground">
            WebSockets (Socket.io) allow live editing, multi-user cursor presence, and
            synced changes.
          </p>
        </Section>
      </main>
    </div>
  );
}

function Section({ id, title, children }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-3"
    >
      <h2 className="text-2xl font-bold">{title}</h2>
      {children}
    </motion.section>
  );
}
