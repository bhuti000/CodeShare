import mongoose from "mongoose";

const ThreadedCommentSchema = new mongoose.Schema(
  {
    // ✅ Reference to snippet
    snippet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Snippet",
      required: true,
    },

    // ✅ Line number (for line-specific comments)
    lineNumber: {
      type: Number,
      required: true,
    },

    // ✅ Comment text
    text: {
      type: String,
      required: true,
    },

    // ✅ Author
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✅ Parent comment (for threaded replies)
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ThreadedComment",
      default: null,
    },

    // ✅ Replies to this comment
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ThreadedComment",
      }
    ],

    // ✅ Comment reactions (likes, etc.)
    reactions: {
      likes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        }
      ],
      dislikes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        }
      ],
    },

    // ✅ Is discussion resolved?
    isResolved: {
      type: Boolean,
      default: false,
    },

    // ✅ Who resolved it?
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // ✅ When was it resolved?
    resolvedAt: Date,

    // ✅ Edit history
    editHistory: [
      {
        content: String,
        editedAt: Date,
        editedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      }
    ],

    // ✅ Is edited?
    isEdited: {
      type: Boolean,
      default: false,
    },

    // ✅ Last edited at
    lastEditedAt: Date,

    // ✅ Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for faster queries
ThreadedCommentSchema.index({ snippet: 1, lineNumber: 1 });
ThreadedCommentSchema.index({ author: 1 });
ThreadedCommentSchema.index({ isResolved: 1 });
ThreadedCommentSchema.index({ createdAt: -1 });

export default mongoose.model("ThreadedComment", ThreadedCommentSchema);
