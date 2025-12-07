import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import Editor from "@monaco-editor/react";
import { socket } from "@/lib/socket";

interface Comment {
  _id: string;
  text: string;
  createdAt: string;
  author: { name: string };
}

export default function SnippetDetail() {
  const { id } = useParams();
  const [code, setCode] = useState("");
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);

  // Fetch snippet data
  const { data: snippet, isLoading, error } = useQuery({
    queryKey: ["snippet", id],
    queryFn: async () => (await api.get(`/snippets/${id}`)).data,
  });

  // Load snippet content into editor
  useEffect(() => {
    if (snippet) {
      setCode(snippet.content);
    }
  }, [snippet]);

  // Fetch comments
  const loadComments = async () => {
    const res = await api.get(`/comments/${id}`);
    setComments(res.data);
  };

  useEffect(() => {
    loadComments();
  }, [id]);

  // Add comment
const handleComment = async () => {
  if (!commentText.trim()) return;

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please login to comment!");
    return;
  }

  try {
    const res = await api.post(
      `/comments/${id}`,
      { text: commentText }
    );

    setComments((prev) => [res.data, ...prev]);
    setCommentText("");
  } catch (err) {
    console.log("COMMENT ERROR:", err);
    alert("Failed to post comment");
  }
};


  // Send real-time edits
  const handleEditorChange = (value: string | undefined) => {
    const updatedCode = value || "";
    setCode(updatedCode);

    socket.emit("edit-snippet", {
      snippetId: id,
      content: updatedCode,
    });
  };

  // Receive updates from others
  useEffect(() => {
    socket.on("receive-edit", (data) => {
      if (data.snippetId === id) {
        setCode(data.content);
      }
    });

    return () => {
      socket.off("receive-edit");
    };
  }, [id]);

  if (isLoading) return <div className="p-8">Loading snippet...</div>;
  if (error) return <div className="p-8 text-red-500">Snippet not found.</div>;

  return (
    <div className="container py-12 px-4 max-w-4xl">

      {/* Title */}
      <h1 className="text-3xl font-bold mb-2">{snippet.title}</h1>

      {/* Language */}
      <Badge className="mb-6">{snippet.language}</Badge>

      {/* Metadata */}
      <p className="text-sm text-muted-foreground mb-6">
        Created at: {new Date(snippet.createdAt).toLocaleString()}
      </p>

      {/* Real-time Code Editor */}
      <div className="mt-6 border rounded-lg overflow-hidden shadow">
        <Editor
          height="400px"
          language={snippet.language.toLowerCase()}
          value={code}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            fontSize: 14,
            minimap: { enabled: false },
          }}
        />
      </div>

      {/* COMMENTS SECTION */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>

        {/* Add Comment */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="flex-1 border p-2 rounded-md text-black bg-white"
          />
          <Button onClick={handleComment} className="px-5">
            Post
          </Button>
        </div>

        {/* Comment List */}
        <div className="flex flex-col gap-4">
          {comments.length === 0 && (
            <p className="text-muted-foreground">No comments yet.</p>
          )}

          {comments.map((c) => (
            <div
              key={c._id}
              className="border p-3 rounded-md bg-secondary/20"
            >
              <p className="text-sm">
                <strong>{c.author?.name}</strong>{" "}
                <span className="text-xs text-muted-foreground">
                  {new Date(c.createdAt).toLocaleString()}
                </span>
              </p>

              <p className="text-sm mt-1">{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
