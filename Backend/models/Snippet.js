import mongoose from "mongoose";

const SnippetSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    language: { type: String, required: true },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ],

    versions: [
      {
        content: String,
        timestamp: Date,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Snippet", SnippetSchema);
