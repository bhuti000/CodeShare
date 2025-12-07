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

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("All");

  // 🔥 New: Sorting filter (all | popular)
  const [filterType, setFilterType] = useState("all");

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Fetch based on filter type
  const { data: snippets = [], isLoading, error } = useQuery({
    queryKey: ["snippets", filterType],
    queryFn: async () => {
      if (filterType === "popular") {
        return (await api.get("/snippets/popular")).data;
      }
      return (await api.get("/snippets")).data;
    },
  });

  if (isLoading) return <div>Loading snippets...</div>;
  if (error) return <div>Failed to load snippets.</div>;

  // ⭐ Map backend snippets into UI format
 const mapped = snippets.map((s: any) => ({
  id: s._id,
  title: s.title,
  description: s.content.substring(0, 120),
  language: s.language,
  content: s.content,
  author: { name: s.author?.name || "Unknown" },

  likes: s.likes || [],          // ✔ REAL likes from DB
  comments: s.comments || [],
  views: s.views || 0,
  createdAt: s.createdAt,
  tags: [],
}));


  // Apply search + language filter
  const filtered = mapped.filter((snip) => {
    const matchesSearch =
      snip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snip.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLang =
      selectedLanguage === "All" || snip.language === selectedLanguage;

    return matchesSearch && matchesLang;
  });

  return (
    <section className="py-12">
      <div className="container px-4">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-4">Explore Snippets</h1>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">

            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
              <Input
                placeholder="Search by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Language Filter */}
            <Select
              value={selectedLanguage}
              onValueChange={setSelectedLanguage}
            >
              <SelectTrigger className="w-[150px]">
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

            {/* 🔥 NEW: Popular / All Filter */}
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="popular">Popular</SelectItem>
              </SelectContent>
            </Select>

            {/* Grid/List Mode */}
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

          {/* Active filters badges */}
          {(searchQuery || selectedLanguage !== "All") && (
            <div className="flex gap-2 mt-4">
              {searchQuery && (
                <Badge variant="secondary">
                  Search: {searchQuery}
                  <button className="ml-2" onClick={() => setSearchQuery("")}>
                    ×
                  </button>
                </Badge>
              )}

              {selectedLanguage !== "All" && (
                <Badge variant="language">
                  {selectedLanguage}
                  <button className="ml-2" onClick={() => setSelectedLanguage("All")}>
                    ×
                  </button>
                </Badge>
              )}
            </div>
          )}
        </motion.div>

        {/* Count */}
        <p className="text-sm mb-4 text-muted-foreground">
          Showing {filtered.length} snippet
          {filtered.length !== 1 ? "s" : ""}
        </p>

        {/* Snippets Display */}
        <div
          className={
            viewMode === "grid"
              ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "flex flex-col gap-4"
          }
        >
          {filtered.map((snippet, index) => (
            <SnippetCard key={snippet.id} snippet={snippet} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
