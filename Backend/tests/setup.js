import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// ============================================
// TEST DATABASE SETUP
// ============================================

/**
 * Connect to test database
 */
export const connectTestDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_TEST_URI || "mongodb://localhost:27017/codeshare-test";
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to test database");
  } catch (err) {
    console.error("❌ Failed to connect to test database:", err);
    process.exit(1);
  }
};

/**
 * Disconnect from test database
 */
export const disconnectTestDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("✅ Disconnected from test database");
  } catch (err) {
    console.error("❌ Failed to disconnect from test database:", err);
  }
};

/**
 * Clear all collections
 */
export const clearDatabase = async () => {
  try {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }

    console.log("✅ Database cleared");
  } catch (err) {
    console.error("❌ Failed to clear database:", err);
  }
};

/**
 * Create test user
 */
export const createTestUser = async (User, userData = {}) => {
  const defaultData = {
    name: "Test User",
    email: "test@example.com",
    password: "password123",
    role: "editor",
    ...userData,
  };

  const user = await User.create(defaultData);
  return user;
};

/**
 * Create test snippet
 */
export const createTestSnippet = async (Snippet, userId, snippetData = {}) => {
  const defaultData = {
    title: "Test Snippet",
    content: "console.log('test');",
    language: "JavaScript",
    author: userId,
    likes: [],
    ...snippetData,
  };

  const snippet = await Snippet.create(defaultData);
  return snippet;
};

/**
 * Create test comment
 */
export const createTestComment = async (ThreadedComment, snippetId, userId, commentData = {}) => {
  const defaultData = {
    snippet: snippetId,
    text: "Test comment",
    lineNumber: 1,
    author: userId,
    ...commentData,
  };

  const comment = await ThreadedComment.create(defaultData);
  return comment;
};
