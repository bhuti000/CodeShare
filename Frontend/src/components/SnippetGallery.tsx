import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SnippetCard } from "@/components/SnippetCard";
import { Search, Grid3X3, List } from "lucide-react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const LANGUAGES = [
  "All",
  "JavaScript",
  "TypeScript",
  "Python",
  "Go",
  "Rust",
  "CSS",
  "SQL",
  "Java",
];

export function SnippetGallery() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Fetch real snippets from backend
  const { data: snippets = [], isLoading, error } = useQuery({
    queryKey: ["snippets"],
    queryFn: async () => (await api.get("/snippets")).data,
  });

  if (isLoading) return <div>Loading snippets...</div>;
  if (error) return <div>Error loading snippets.</div>;

  // Convert DB snippet to SnippetCard format
  const mappedSnippets = snippets.map((snip: any) => ({
    _id: snip._id,
    id: snip._id,
    title: snip.title,
    description: snip.content.substring(0, 120),
    language: snip.language,
    code: snip.content,
    content: snip.content,
    author: { name: snip?.author?.name || "Unknown" },
    likes: snip.likes || [],  // ✅ Use actual likes array from backend
    comments: snip.comments || [],
    views: 0,
    createdAt: snip.createdAt,
    tags: [],
  }));

  // Apply filters
  const filteredSnippets = mappedSnippets.filter((snippet) => {
    const matchesSearch =
      snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLanguage =
      selectedLanguage === "All" || snippet.language === selectedLanguage;

    return matchesSearch && matchesLanguage;
  });

  return (
    <section className="py-12">
      <div className="container px-4">

        {/* Search + Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search snippets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Language Filter */}
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Grid/List View */}
            <div className="flex border border-border rounded-lg overflow-hidden">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Count */}
        <p className="text-sm text-muted-foreground mb-4">
          Showing {filteredSnippets.length} snippet
          {filteredSnippets.length !== 1 ? "s" : ""}
        </p>

        {/* Snippet Cards */}
        <div
          className={
            viewMode === "grid"
              ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "flex flex-col gap-4"
          }
        >
          {filteredSnippets.map((snippet, index) => (
            <SnippetCard key={snippet.id} snippet={snippet} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
