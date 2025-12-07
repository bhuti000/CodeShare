import Snippet from "../models/Snippet.js";

// ==========================
// CREATE SNIPPET
// ==========================
export const createSnippet = async (req, res) => {
  try {
    const { title, content, language } = req.body;

    if (!req.user?._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const snippet = await Snippet.create({
      title,
      content,
      language,
      author: req.user._id,
      likes: [],  // ⭐ REQUIRED
      versions: [{ content, timestamp: new Date() }],
    });

    return res.json(snippet); // ⭐ RETURN DIRECT OBJECT (frontend expects this)
  } catch (err) {
    console.error("❌ CREATE SNIPPET ERROR:", err);
    res.status(500).json({ message: "Error creating snippet" });
  }
};

// ==========================
// GET ALL SNIPPETS
// ==========================
export const getAllSnippets = async (req, res) => {
  try {
    const snippets = await Snippet.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.json(snippets);
  } catch (err) {
    console.error("❌ GET ALL SNIPPETS ERROR:", err);
    res.status(500).json({ message: "Error fetching snippets" });
  }
};

// ==========================
// GET SNIPPET BY ID
// ==========================
export const getSnippetById = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id)
      .populate("author", "name email");

    if (!snippet) {
      return res.status(404).json({ message: "Snippet not found" });
    }

    res.json(snippet);
  } catch (err) {
    console.error("❌ GET SNIPPET ERROR:", err);
    res.status(500).json({ message: "Error fetching snippet" });
  }
};

// ==========================
// UPDATE SNIPPET
// ==========================
export const updateSnippet = async (req, res) => {
  try {
    const { content } = req.body;

    const snippet = await Snippet.findById(req.params.id);
    if (!snippet) {
      return res.status(404).json({ message: "Snippet not found" });
    }

    snippet.content = content;
    snippet.versions.push({ content, timestamp: new Date() });

    await snippet.save();
    res.json(snippet);
  } catch (err) {
    console.error("❌ UPDATE SNIPPET ERROR:", err);
    res.status(500).json({ message: "Error updating snippet" });
  }
};

// ==========================
// LIKE / UNLIKE SNIPPET ❤️
// ==========================
export const toggleLike = async (req, res) => {
  try {
    const snippetId = req.params.id;
    const userId = req.user._id;

    console.log("❤️ Toggle like - snippetId:", snippetId, "userId:", userId);

    const snippet = await Snippet.findById(snippetId);
    if (!snippet) {
      return res.status(404).json({ message: "Snippet not found" });
    }

    const alreadyLiked = snippet.likes.includes(userId.toString());
    console.log("📊 Already liked:", alreadyLiked, "Current likes:", snippet.likes.length);

    if (alreadyLiked) {
      snippet.likes.pull(userId);
      console.log("👎 Removed like, new count:", snippet.likes.length);
    } else {
      snippet.likes.push(userId);
      console.log("👍 Added like, new count:", snippet.likes.length);
    }

    await snippet.save();
    console.log("✅ Snippet saved with likes:", snippet.likes);

    return res.json({
      liked: !alreadyLiked,
      likesCount: snippet.likes.length,
      likes: snippet.likes,      // ⭐ IMPORTANT – frontend needs this!
      snippetId: snippet._id
    });
  } catch (err) {
    console.error("❌ LIKE SNIPPET ERROR:", err);
    res.status(500).json({ message: "Error liking snippet" });
  }
};
// GET POPULAR SNIPPETS (sorted by likes count)
export const getPopularSnippets = async (req, res) => {
  try {
    const snippets = await Snippet.find()
      .sort({ likes: -1 })  // sort by likes descending
      .populate("author", "name");

    res.json(snippets);
  } catch (err) {
    console.error("❌ POPULAR SNIPPETS ERROR:", err);
    res.status(500).json({ message: "Error fetching popular snippets" });
  }
};
