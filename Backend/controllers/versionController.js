import Snippet from "../models/Snippet.js";
import SnippetVersion from "../models/SnippetVersion.js";

// ============================================
// GET VERSION HISTORY
// ============================================
export const getVersionHistory = async (req, res) => {
  try {
    const { snippetId } = req.params;

    console.log("📜 Fetching version history for snippet:", snippetId);

    const versions = await SnippetVersion.find({ snippet: snippetId })
      .populate("author", "name email")
      .sort({ versionNumber: -1 });

    if (!versions || versions.length === 0) {
      return res.status(404).json({ message: "No versions found" });
    }

    console.log(`✅ Found ${versions.length} versions`);
    res.json(versions);
  } catch (err) {
    console.error("❌ Version history error:", err);
    res.status(500).json({ message: "Error fetching version history" });
  }
};

// ============================================
// GET SPECIFIC VERSION
// ============================================
export const getVersion = async (req, res) => {
  try {
    const { snippetId, versionNumber } = req.params;

    console.log(`📜 Fetching version ${versionNumber} for snippet ${snippetId}`);

    const version = await SnippetVersion.findOne({
      snippet: snippetId,
      versionNumber: parseInt(versionNumber),
    }).populate("author", "name email");

    if (!version) {
      return res.status(404).json({ message: "Version not found" });
    }

    console.log("✅ Version found");
    res.json(version);
  } catch (err) {
    console.error("❌ Get version error:", err);
    res.status(500).json({ message: "Error fetching version" });
  }
};

// ============================================
// RESTORE VERSION
// ============================================
export const restoreVersion = async (req, res) => {
  try {
    const { snippetId, versionNumber } = req.params;
    const userId = req.user._id;

    console.log(`🔄 Restoring version ${versionNumber} for snippet ${snippetId}`);

    // Get the snippet
    const snippet = await Snippet.findById(snippetId);
    if (!snippet) {
      return res.status(404).json({ message: "Snippet not found" });
    }

    // Check if user is owner or admin
    if (snippet.author.toString() !== userId.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to restore versions" });
    }

    // Get the version to restore
    const versionToRestore = await SnippetVersion.findOne({
      snippet: snippetId,
      versionNumber: parseInt(versionNumber),
    });

    if (!versionToRestore) {
      return res.status(404).json({ message: "Version not found" });
    }

    // Get current version number
    const latestVersion = await SnippetVersion.findOne({ snippet: snippetId })
      .sort({ versionNumber: -1 });

    const newVersionNumber = (latestVersion?.versionNumber || 0) + 1;

    // Create new version with restored content
    const newVersion = await SnippetVersion.create({
      snippet: snippetId,
      versionNumber: newVersionNumber,
      content: versionToRestore.content,
      title: versionToRestore.title,
      language: versionToRestore.language,
      author: userId,
      changeDescription: `Restored from version ${versionNumber}`,
      contentSize: versionToRestore.content.length,
      lineCount: versionToRestore.content.split("\n").length,
    });

    // Update snippet with restored content
    snippet.content = versionToRestore.content;
    snippet.title = versionToRestore.title;
    snippet.language = versionToRestore.language;
    await snippet.save();

    console.log(`✅ Version ${versionNumber} restored as version ${newVersionNumber}`);
    res.json({
      message: "Version restored successfully",
      newVersion: newVersionNumber,
      snippet,
    });
  } catch (err) {
    console.error("❌ Restore version error:", err);
    res.status(500).json({ message: "Error restoring version" });
  }
};

// ============================================
// COMPARE VERSIONS
// ============================================
export const compareVersions = async (req, res) => {
  try {
    const { snippetId, version1, version2 } = req.params;

    console.log(`🔍 Comparing versions ${version1} and ${version2}`);

    const v1 = await SnippetVersion.findOne({
      snippet: snippetId,
      versionNumber: parseInt(version1),
    });

    const v2 = await SnippetVersion.findOne({
      snippet: snippetId,
      versionNumber: parseInt(version2),
    });

    if (!v1 || !v2) {
      return res.status(404).json({ message: "One or both versions not found" });
    }

    // Simple diff (in production, use a proper diff library)
    const lines1 = v1.content.split("\n");
    const lines2 = v2.content.split("\n");

    const diff = {
      version1: {
        number: version1,
        lines: lines1.length,
        size: v1.content.length,
      },
      version2: {
        number: version2,
        lines: lines2.length,
        size: v2.content.length,
      },
      changes: {
        added: lines2.length - lines1.length,
        removed: lines1.length - lines2.length,
      },
    };

    console.log("✅ Comparison complete");
    res.json(diff);
  } catch (err) {
    console.error("❌ Compare versions error:", err);
    res.status(500).json({ message: "Error comparing versions" });
  }
};

// ============================================
// CREATE VERSION (called internally)
// ============================================
export const createVersion = async (snippetId, content, title, language, userId, description) => {
  try {
    // Get latest version number
    const latestVersion = await SnippetVersion.findOne({ snippet: snippetId })
      .sort({ versionNumber: -1 });

    const versionNumber = (latestVersion?.versionNumber || 0) + 1;

    // Create new version
    const version = await SnippetVersion.create({
      snippet: snippetId,
      versionNumber,
      content,
      title,
      language,
      author: userId,
      changeDescription: description,
      contentSize: content.length,
      lineCount: content.split("\n").length,
    });

    console.log(`✅ Version ${versionNumber} created for snippet ${snippetId}`);
    return version;
  } catch (err) {
    console.error("❌ Create version error:", err);
    throw err;
  }
};
