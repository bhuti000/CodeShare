import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema(
  {
    // ✅ User who performed the action
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✅ Type of activity
    type: {
      type: String,
      enum: [
        "snippet_created",
        "snippet_updated",
        "snippet_deleted",
        "snippet_liked",
        "snippet_unliked",
        "comment_created",
        "comment_deleted",
        "comment_resolved",
        "user_followed",
        "user_unfollowed",
      ],
      required: true,
    },

    // ✅ Related snippet
    snippet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Snippet",
    },

    // ✅ Related comment
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ThreadedComment",
    },

    // ✅ Related user (for follow actions)
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // ✅ Activity description
    description: String,

    // ✅ Additional metadata
    metadata: {
      type: Map,
      of: String,
    },

    // ✅ Timestamp
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: false }
);

// Index for faster queries
ActivitySchema.index({ user: 1, createdAt: -1 });
ActivitySchema.index({ type: 1, createdAt: -1 });
ActivitySchema.index({ snippet: 1 });
ActivitySchema.index({ createdAt: -1 });

// TTL index - auto-delete activities older than 90 days
ActivitySchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });

export default mongoose.model("Activity", ActivitySchema);
