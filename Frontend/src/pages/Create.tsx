import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const LANGUAGES = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Go",
  "Rust",
  "CSS",
  "SQL",
  "Java",
];

export default function Create() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("JavaScript");
  const [content, setContent] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      return api.post("/snippets", {
        title,
        language,
        content,
      });
    },

    onSuccess: (res) => {
      toast.success("Snippet created!");

      const snippetId = res.data?.snippet?._id;
      queryClient.invalidateQueries({ queryKey: ["snippets"] });

      if (snippetId) navigate(`/snippet/${snippetId}`);
      else navigate("/explore");
    },

    onError: () => {
      toast.error("Failed to create snippet.");
    },
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    mutate();
  };

  return (
    <div className="container py-12 px-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Create a Snippet</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label className="text-sm font-medium">Title</label>
          <Input
            placeholder="Enter a snippet title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Language</label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>

            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium">Code</label>
          <Textarea
            placeholder="Write your code here..."
            className="min-h-[200px] font-mono"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <Button type="submit" disabled={isPending} className="w-full h-12 text-lg">
          {isPending ? "Saving..." : "Create Snippet"}
        </Button>
      </form>
    </div>
  );
}
