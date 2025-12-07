import ThreadedComment from "../models/ThreadedComment.js";
import Snippet from "../models/Snippet.js";

// ============================================
// GET COMMENTS FOR SNIPPET
// ============================================
export const getComments = async (req, res) => {
  try {
    const { snippetId } = req.params;
    const { lineNumber } = req.query;

    console.log(`💬 Fetching comments for snippet ${snippetId}`);

    let query = { snippet: snippetId, parentComment: null };

    if (lineNumber) {
      query.lineNumber = parseInt(lineNumber);
      console.log(`📍 Filtering by line ${lineNumber}`);
    }

    const comments = await ThreadedComment.find(query)
      .populate("author", "name email avatar")
      .populate("replies")
      .sort({ createdAt: -1 });

    console.log(`✅ Found ${comments.length} comments`);
    res.json(comments);
  } catch (err) {
    console.error("❌ Get comments error:", err);
    res.status(500).json({ message: "Error fetching comments" });
  }
};

// ============================================
// GET COMMENT THREAD
// ============================================
export const getCommentThread = async (req, res) => {
  try {
    const { commentId } = req.params;

    console.log(`💬 Fetching comment thread for ${commentId}`);

    const comment = await ThreadedComment.findById(commentId)
      .populate("author", "name email avatar")
      .populate("replies")
      .populate("resolvedBy", "name email");

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    console.log("✅ Comment thread found");
    res.json(comment);
  } catch (err) {
    console.error("❌ Get comment thread error:", err);
    res.status(500).json({ message: "Error fetching comment thread" });
  }
};

// ============================================
// CREATE COMMENT
// ============================================
export const createComment = async (req, res) => {
  try {
    const { snippetId } = req.params;
    const { text, lineNumber, parentCommentId } = req.body;
    const userId = req.user._id;

    console.log(`💬 Creating comment on snippet ${snippetId}, line ${lineNumber}`);

    // Validate snippet exists
    const snippet = await Snippet.findById(snippetId);
    if (!snippet) {
      return res.status(404).json({ message: "Snippet not found" });
    }

    // Create comment
    const comment = await ThreadedComment.create({
      snippet: snippetId,
      text,
      lineNumber: parseInt(lineNumber) || 0,
      author: userId,
      parentComment: parentCommentId || null,
    });

    // If this is a reply, add it to parent's replies
    if (parentCommentId) {
      await ThreadedComment.findByIdAndUpdate(
        parentCommentId,
        { $push: { replies: comment._id } },
        { new: true }
      );
      console.log(`✅ Reply added to parent comment`);
    }

    // Populate author
    await comment.populate("author", "name email avatar");

    console.log(`✅ Comment created: ${comment._id}`);
    res.status(201).json(comment);
  } catch (err) {
    console.error("❌ Create comment error:", err);
    res.status(500).json({ message: "Error creating comment" });
  }
};

// ============================================
// UPDATE COMMENT
// ============================================
export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;
    const userId = req.user._id;

    console.log(`✏️ Updating comment ${commentId}`);

    const comment = await ThreadedComment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user is author or admin
    if (comment.author.toString() !== userId.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this comment" });
    }

    // Add to edit history
    comment.editHistory.push({
      content: comment.text,
      editedAt: new Date(),
      editedBy: userId,
    });

    // Update comment
    comment.text = text;
    comment.isEdited = true;
    comment.lastEditedAt = new Date();
    await comment.save();

    await comment.populate("author", "name email avatar");

    console.log(`✅ Comment updated`);
    res.json(comment);
  } catch (err) {
    console.error("❌ Update comment error:", err);
    res.status(500).json({ message: "Error updating comment" });
  }
};

// ============================================
// DELETE COMMENT
// ============================================
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    console.log(`🗑️ Deleting comment ${commentId}`);

    const comment = await ThreadedComment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user is author or admin
    if (comment.author.toString() !== userId.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    // Remove from parent's replies if it's a reply
    if (comment.parentComment) {
      await ThreadedComment.findByIdAndUpdate(
        comment.parentComment,
        { $pull: { replies: commentId } }
      );
    }

    // Delete all replies
    await ThreadedComment.deleteMany({ parentComment: commentId });

    // Delete comment
    await ThreadedComment.findByIdAndDelete(commentId);

    console.log(`✅ Comment deleted`);
    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("❌ Delete comment error:", err);
    res.status(500).json({ message: "Error deleting comment" });
  }
};

// ============================================
// RESOLVE DISCUSSION
// ============================================
export const resolveDiscussion = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    console.log(`�� Resolving discussion ${commentId}`);

    const comment = await ThreadedComment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user is author or admin
    if (comment.author.toString() !== userId.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to resolve this discussion" });
    }

    comment.isResolved = true;
    comment.resolvedBy = userId;
    comment.resolvedAt = new Date();
    await comment.save();

    console.log(`✅ Discussion resolved`);
    res.json(comment);
  } catch (err) {
    console.error("❌ Resolve discussion error:", err);
    res.status(500).json({ message: "Error resolving discussion" });
  }
};

// ============================================
// ADD REACTION TO COMMENT
// ============================================
export const addReaction = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { reactionType } = req.body; // 'like' or 'dislike'
    const userId = req.user._id;

    console.log(`👍 Adding ${reactionType} reaction to comment ${commentId}`);

    const comment = await ThreadedComment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (reactionType === "like") {
      // Remove from dislikes if present
      comment.reactions.dislikes = comment.reactions.dislikes.filter(
        (id) => id.toString() !== userId.toString()
      );

      // Add to likes if not already there
      if (!comment.reactions.likes.includes(userId)) {
        comment.reactions.likes.push(userId);
      }
    } else if (reactionType === "dislike") {
      // Remove from likes if present
      comment.reactions.likes = comment.reactions.likes.filter(
        (id) => id.toString() !== userId.toString()
      );

      // Add to dislikes if not already there
      if (!comment.reactions.dislikes.includes(userId)) {
        comment.reactions.dislikes.push(userId);
      }
    }

    await comment.save();
    console.log(`✅ Reaction added`);
    res.json(comment);
  } catch (err) {
    console.error("❌ Add reaction error:", err);
    res.status(500).json({ message: "Error adding reaction" });
  }
};
