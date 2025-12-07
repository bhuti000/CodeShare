import Activity from "../models/Activity.js";

// ============================================
// LOG ACTIVITY
// ============================================
export const logActivity = async (userId, type, snippetId = null, commentId = null, targetUserId = null, description = null) => {
  try {
    const activity = await Activity.create({
      user: userId,
      type,
      snippet: snippetId,
      comment: commentId,
      targetUser: targetUserId,
      description: description || type,
    });

    console.log(`📊 Activity logged: ${type} by user ${userId}`);
    return activity;
  } catch (err) {
    console.error("❌ Log activity error:", err);
  }
};

// ============================================
// GET USER ACTIVITY
// ============================================
export const getUserActivity = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20, skip = 0 } = req.query;

    console.log(`📊 Fetching activity for user ${userId}`);

    const activities = await Activity.find({ user: userId })
      .populate("user", "name email avatar")
      .populate("snippet", "title")
      .populate("comment", "text")
      .populate("targetUser", "name email avatar")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Activity.countDocuments({ user: userId });

    console.log(`✅ Found ${activities.length} activities`);
    res.json({ activities, total });
  } catch (err) {
    console.error("❌ Get user activity error:", err);
    res.status(500).json({ message: "Error fetching activity" });
  }
};

// ============================================
// GET GLOBAL ACTIVITY FEED
// ============================================
export const getActivityFeed = async (req, res) => {
  try {
    const { limit = 50, skip = 0 } = req.query;

    console.log(`📊 Fetching global activity feed`);

    const activities = await Activity.find()
      .populate("user", "name email avatar")
      .populate("snippet", "title")
      .populate("comment", "text")
      .populate("targetUser", "name email avatar")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Activity.countDocuments();

    console.log(`✅ Found ${activities.length} activities`);
    res.json({ activities, total });
  } catch (err) {
    console.error("❌ Get activity feed error:", err);
    res.status(500).json({ message: "Error fetching activity feed" });
  }
};

// ============================================
// GET SNIPPET ACTIVITY
// ============================================
export const getSnippetActivity = async (req, res) => {
  try {
    const { snippetId } = req.params;
    const { limit = 20, skip = 0 } = req.query;

    console.log(`📊 Fetching activity for snippet ${snippetId}`);

    const activities = await Activity.find({ snippet: snippetId })
      .populate("user", "name email avatar")
      .populate("snippet", "title")
      .populate("comment", "text")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Activity.countDocuments({ snippet: snippetId });

    console.log(`✅ Found ${activities.length} activities`);
    res.json({ activities, total });
  } catch (err) {
    console.error("❌ Get snippet activity error:", err);
    res.status(500).json({ message: "Error fetching snippet activity" });
  }
};

// ============================================
// GET ACTIVITY STATS
// ============================================
export const getActivityStats = async (req, res) => {
  try {
    const { userId } = req.params;

    console.log(`📊 Fetching activity stats for user ${userId}`);

    const stats = await Activity.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
    ]);

    console.log(`✅ Stats calculated`);
    res.json(stats);
  } catch (err) {
    console.error("❌ Get activity stats error:", err);
    res.status(500).json({ message: "Error fetching activity stats" });
  }
};

// ============================================
// CLEAR OLD ACTIVITIES (cleanup)
// ============================================
export const clearOldActivities = async (req, res) => {
  try {
    const daysOld = req.query.days || 90;
    const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);

    console.log(`🧹 Clearing activities older than ${daysOld} days`);

    const result = await Activity.deleteMany({ createdAt: { $lt: cutoffDate } });

    console.log(`✅ Deleted ${result.deletedCount} old activities`);
    res.json({ message: `Deleted ${result.deletedCount} activities` });
  } catch (err) {
    console.error("❌ Clear old activities error:", err);
    res.status(500).json({ message: "Error clearing activities" });
  }
};
