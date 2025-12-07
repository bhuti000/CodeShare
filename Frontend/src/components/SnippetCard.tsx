import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, Copy } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import api from "@/lib/api";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface SnippetCardProps {
  snippet: any;
  index?: number;
}

export function SnippetCard({ snippet, index = 0 }: SnippetCardProps) {

  // Always normalize ID
  const snippetId = snippet._id || snippet.id;

  // Logged-in userId
  const userId = localStorage.getItem("userId");

  // ✅ Get React Query client to invalidate cache
  const queryClient = useQueryClient();

  // Determine initial like state ✔
  const likesArray = Array.isArray(snippet.likes) ? snippet.likes : [];

  const [likesCount, setLikesCount] = useState(likesArray.length);
  const [liked, setLiked] = useState(
    likesArray.includes(localStorage.getItem("userId"))
  );

  // COPY CODE
  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(snippet.content);
    toast.success("Code copied!");
  };

  // LIKE / UNLIKE SNIPPET
  const toggleLike = async (e: React.MouseEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) return toast.error("Please login first!");

    try {
      const res = await api.post(`/snippets/${snippetId}/like`);

      setLiked(res.data.liked);
      setLikesCount(res.data.likesCount);

      // ✅ Invalidate the snippets query to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ["snippets"] });
      console.log("✅ Snippets cache invalidated after like");
    } catch (err) {
      console.error("❌ Failed to like snippet:", err);
      toast.error("Failed to like snippet");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link to={`/snippet/${snippetId}`}>
        <Card className="group hover:border-primary/40 transition cursor-pointer">

          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold truncate">{snippet.title}</h3>
                <p className="text-xs text-muted-foreground">{snippet.language}</p>
              </div>

              <Button variant="ghost" size="icon" onClick={handleCopy}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <pre className="bg-secondary p-3 rounded text-xs font-mono line-clamp-3">
              {snippet.content}
            </pre>
          </CardContent>

          <CardFooter className="flex justify-between items-center border-t pt-3">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback>
                  {snippet.author?.name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs">{snippet.author?.name}</span>
            </div>

            {/* Like Button */}
            <button
              onClick={toggleLike}
              className="flex items-center gap-1 hover:text-red-500"
            >
              <Heart
                className={`h-4 w-4 ${
                  liked ? "text-red-500 fill-red-500" : ""
                }`}
              />
              {likesCount}
            </button>
          </CardFooter>

        </Card>
      </Link>
    </motion.div>
  );
}
