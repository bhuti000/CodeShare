import Comment from "../models/Comment.js";

export const addComment = async (req, res) => {
  try {
    const { snippetId } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment text required" });
    }

    const comment = await Comment.create({
      snippet: snippetId,
      author: req.user._id,
      text,
    });

    const populated = await comment.populate("author", "name email");

    res.json(populated);
  } catch (err) {
    console.log("ADD COMMENT ERROR:", err);
    res.status(500).json({ error: "Failed to add comment" });
  }
};

export const getComments = async (req, res) => {
  try {
    const { snippetId } = req.params;

    const comments = await Comment.find({ snippet: snippetId })
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    console.log("GET COMMENTS ERROR:", err);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};
