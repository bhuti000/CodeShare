import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { MessageSquare, Check, Reply, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

interface Comment {
  id: string;
  lineNumber?: number;
  user: {
    name: string;
    avatar?: string;
  };
  content: string;
  timestamp: string;
  resolved?: boolean;
  replies?: Comment[];
}

const MOCK_COMMENTS: Comment[] = [
  {
    id: "1",
    lineNumber: 5,
    user: { name: "Sarah Chen" },
    content: "Consider using useCallback here to prevent unnecessary re-renders when passing this function as a prop.",
    timestamp: "2 hours ago",
    resolved: false,
    replies: [
      {
        id: "1-1",
        user: { name: "Mike Johnson" },
        content: "Good point! I'll update it in the next version.",
        timestamp: "1 hour ago",
      },
    ],
  },
  {
    id: "2",
    lineNumber: 12,
    user: { name: "Alex Kim" },
    content: "The error handling could be more specific. Maybe add different catch blocks for network errors vs parsing errors?",
    timestamp: "5 hours ago",
    resolved: true,
  },
  {
    id: "3",
    user: { name: "Emma Davis" },
    content: "Great snippet! This will be really useful for my project. Thanks for sharing!",
    timestamp: "1 day ago",
  },
];

interface CommentItemProps {
  comment: Comment;
  isReply?: boolean;
}

function CommentItem({ comment, isReply = false }: CommentItemProps) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const handleReply = () => {
    if (replyContent.trim()) {
      toast.success("Reply posted!");
      setReplyContent("");
      setShowReplyInput(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${isReply ? "ml-10 mt-3" : ""}`}
    >
      <div className={`flex gap-3 ${comment.resolved ? "opacity-60" : ""}`}>
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.user.avatar} />
          <AvatarFallback className="text-xs bg-secondary">
            {comment.user.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium">{comment.user.name}</span>
            {comment.lineNumber && (
              <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded">
                Line {comment.lineNumber}
              </span>
            )}
            <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
            {comment.resolved && (
              <span className="flex items-center gap-1 text-xs text-primary">
                <Check className="h-3 w-3" />
                Resolved
              </span>
            )}
          </div>

          <p className="text-sm text-muted-foreground mb-2">{comment.content}</p>

          <div className="flex items-center gap-2">
            {!isReply && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => setShowReplyInput(!showReplyInput)}
              >
                <Reply className="h-3 w-3 mr-1" />
                Reply
              </Button>
            )}
            {!comment.resolved && !isReply && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => toast.success("Comment marked as resolved")}
              >
                <Check className="h-3 w-3 mr-1" />
                Resolve
              </Button>
            )}
          </div>

          {showReplyInput && (
            <div className="mt-3 space-y-2">
              <Textarea
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="min-h-[80px] text-sm"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleReply}>
                  Post Reply
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReplyInput(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Replies */}
      {comment.replies?.map((reply) => (
        <CommentItem key={reply.id} comment={reply} isReply />
      ))}
    </motion.div>
  );
}

export function CommentSection() {
  const [newComment, setNewComment] = useState("");

  const handlePostComment = () => {
    if (newComment.trim()) {
      toast.success("Comment posted!");
      setNewComment("");
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Comments & Reviews</h3>
        <span className="text-sm text-muted-foreground">({MOCK_COMMENTS.length})</span>
      </div>

      {/* New Comment Input */}
      <div className="mb-6 space-y-3">
        <Textarea
          placeholder="Leave a comment or code review..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px]"
        />
        <div className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground">
            Tip: Click on a line number in the code to leave a line-specific comment
          </p>
          <Button onClick={handlePostComment} disabled={!newComment.trim()}>
            Post Comment
          </Button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {MOCK_COMMENTS.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </Card>
  );
}
