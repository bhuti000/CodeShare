import mongoose from "mongoose";

const SnippetVersionSchema = new mongoose.Schema(
  {
    // ✅ Reference to original snippet
    snippet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Snippet",
      required: true,
    },

    // ✅ Version number
    versionNumber: {
      type: Number,
      required: true,
    },

    // ✅ Code content
    content: {
      type: String,
      required: true,
    },

    // ✅ Title (in case it changed)
    title: String,

    // ✅ Language (in case it changed)
    language: String,

    // ✅ Who made the change
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✅ Change description
    changeDescription: String,

    // ✅ Diff from previous version (for display)
    diff: String,

    // ✅ Size of content
    contentSize: Number,

    // ✅ Lines of code
    lineCount: Number,

    // ✅ Timestamp
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

// Index for faster queries
SnippetVersionSchema.index({ snippet: 1, versionNumber: -1 });
SnippetVersionSchema.index({ createdAt: -1 });

export default mongoose.model("SnippetVersion", SnippetVersionSchema);
