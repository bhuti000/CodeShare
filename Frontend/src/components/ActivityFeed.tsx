import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { MessageSquare, Heart, GitCommit, Eye, Code2 } from "lucide-react";

interface Activity {
  id: string;
  type: "comment" | "like" | "edit" | "view" | "create";
  user: {
    name: string;
    avatar?: string;
  };
  snippet: {
    title: string;
    id: string;
  };
  timestamp: string;
  content?: string;
}

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: "1",
    type: "comment",
    user: { name: "Sarah Chen" },
    snippet: { title: "React Custom Hook", id: "1" },
    timestamp: "2 minutes ago",
    content: "Great implementation! Have you considered adding AbortController for cleanup?",
  },
  {
    id: "2",
    type: "like",
    user: { name: "Mike Johnson" },
    snippet: { title: "Python Async Scraper", id: "2" },
    timestamp: "15 minutes ago",
  },
  {
    id: "3",
    type: "edit",
    user: { name: "Alex Kim" },
    snippet: { title: "Go Worker Pool", id: "3" },
    timestamp: "1 hour ago",
  },
  {
    id: "4",
    type: "create",
    user: { name: "Emma Davis" },
    snippet: { title: "CSS Grid Dashboard", id: "4" },
    timestamp: "2 hours ago",
  },
  {
    id: "5",
    type: "comment",
    user: { name: "David Wilson" },
    snippet: { title: "Rust Error Handling", id: "5" },
    timestamp: "3 hours ago",
    content: "This pattern saved me hours of debugging!",
  },
];

const activityIcons = {
  comment: MessageSquare,
  like: Heart,
  edit: GitCommit,
  view: Eye,
  create: Code2,
};

const activityColors = {
  comment: "text-primary",
  like: "text-destructive",
  edit: "text-accent",
  view: "text-muted-foreground",
  create: "text-primary",
};

export function ActivityFeed() {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Recent Activity</h3>
        <Badge variant="secondary" className="text-xs">Live</Badge>
      </div>

      <div className="space-y-4">
        {MOCK_ACTIVITIES.map((activity, index) => {
          const Icon = activityIcons[activity.type];
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-3"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.user.avatar} />
                <AvatarFallback className="text-xs bg-secondary">
                  {activity.user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Icon className={`h-3.5 w-3.5 ${activityColors[activity.type]}`} />
                  <span className="text-sm font-medium truncate">
                    {activity.user.name}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {activity.type === "comment" && "commented on "}
                  {activity.type === "like" && "liked "}
                  {activity.type === "edit" && "edited "}
                  {activity.type === "create" && "created "}
                  <span className="text-foreground">{activity.snippet.title}</span>
                </p>
                {activity.content && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2 bg-secondary/50 rounded p-2">
                    "{activity.content}"
                  </p>
                )}
                <span className="text-xs text-muted-foreground/70 mt-1 block">
                  {activity.timestamp}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}
