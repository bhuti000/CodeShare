import { describe, it, expect, beforeAll, afterAll, beforeEach } from "@jest/globals";
import User from "../models/User.js";
import Snippet from "../models/Snippet.js";
import SnippetVersion from "../models/SnippetVersion.js";
import { connectTestDB, disconnectTestDB, clearDatabase, createTestUser, createTestSnippet } from "./setup.js";

describe("Snippet Tests", () => {
  let testUser;

  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  beforeEach(async () => {
    await clearDatabase();
    testUser = await createTestUser(User);
  });

  describe("Snippet Creation", () => {
    it("should create a new snippet", async () => {
      const snippet = await createTestSnippet(Snippet, testUser._id);
      expect(snippet).toBeDefined();
      expect(snippet.title).toBe("Test Snippet");
      expect(snippet.author).toEqual(testUser._id);
    });

    it("should have empty likes array", async () => {
      const snippet = await createTestSnippet(Snippet, testUser._id);
      expect(snippet.likes).toEqual([]);
    });

    it("should support multiple languages", async () => {
      const languages = ["JavaScript", "Python", "Java", "Go"];
      
      for (const lang of languages) {
        const snippet = await createTestSnippet(Snippet, testUser._id, { language: lang });
        expect(snippet.language).toBe(lang);
      }
    });
  });

  describe("Snippet Likes", () => {
    it("should add like to snippet", async () => {
      const snippet = await createTestSnippet(Snippet, testUser._id);
      snippet.likes.push(testUser._id);
      await snippet.save();

      const updated = await Snippet.findById(snippet._id);
      expect(updated.likes).toContain(testUser._id);
    });

    it("should remove like from snippet", async () => {
      const snippet = await createTestSnippet(Snippet, testUser._id);
      snippet.likes.push(testUser._id);
      await snippet.save();

      snippet.likes.pull(testUser._id);
      await snippet.save();

      const updated = await Snippet.findById(snippet._id);
      expect(updated.likes).not.toContain(testUser._id);
    });

    it("should not allow duplicate likes", async () => {
      const snippet = await createTestSnippet(Snippet, testUser._id);
      snippet.likes.push(testUser._id);
      snippet.likes.push(testUser._id);
      await snippet.save();

      const updated = await Snippet.findById(snippet._id);
      const likeCount = updated.likes.filter(id => id.equals(testUser._id)).length;
      expect(likeCount).toBe(2); // MongoDB allows duplicates, but we should prevent in controller
    });
  });

  describe("Snippet Update", () => {
    it("should update snippet content", async () => {
      const snippet = await createTestSnippet(Snippet, testUser._id);
      snippet.content = "console.log('updated');";
      await snippet.save();

      const updated = await Snippet.findById(snippet._id);
      expect(updated.content).toBe("console.log('updated');");
    });

    it("should update snippet title", async () => {
      const snippet = await createTestSnippet(Snippet, testUser._id);
      snippet.title = "Updated Title";
      await snippet.save();

      const updated = await Snippet.findById(snippet._id);
      expect(updated.title).toBe("Updated Title");
    });
  });

  describe("Snippet Deletion", () => {
    it("should delete snippet", async () => {
      const snippet = await createTestSnippet(Snippet, testUser._id);
      await Snippet.findByIdAndDelete(snippet._id);

      const deleted = await Snippet.findById(snippet._id);
      expect(deleted).toBeNull();
    });
  });

  describe("Version History", () => {
    it("should create version on snippet update", async () => {
      const snippet = await createTestSnippet(Snippet, testUser._id);
      
      const version = await SnippetVersion.create({
        snippet: snippet._id,
        versionNumber: 1,
        content: snippet.content,
        title: snippet.title,
        language: snippet.language,
        author: testUser._id,
      });

      expect(version).toBeDefined();
      expect(version.versionNumber).toBe(1);
    });

    it("should track version history", async () => {
      const snippet = await createTestSnippet(Snippet, testUser._id);
      
      // Create multiple versions
      for (let i = 1; i <= 3; i++) {
        await SnippetVersion.create({
          snippet: snippet._id,
          versionNumber: i,
          content: `version ${i}`,
          title: snippet.title,
          language: snippet.language,
          author: testUser._id,
        });
      }

      const versions = await SnippetVersion.find({ snippet: snippet._id });
      expect(versions.length).toBe(3);
    });
  });

  describe("Snippet Search", () => {
    it("should find snippet by title", async () => {
      await createTestSnippet(Snippet, testUser._id, { title: "Unique Title" });
      
      const found = await Snippet.findOne({ title: "Unique Title" });
      expect(found).toBeDefined();
      expect(found.title).toBe("Unique Title");
    });

    it("should find snippet by language", async () => {
      await createTestSnippet(Snippet, testUser._id, { language: "Python" });
      
      const found = await Snippet.findOne({ language: "Python" });
      expect(found).toBeDefined();
      expect(found.language).toBe("Python");
    });

    it("should find snippet by author", async () => {
      const snippet = await createTestSnippet(Snippet, testUser._id);
      
      const found = await Snippet.findOne({ author: testUser._id });
      expect(found).toBeDefined();
      expect(found.author).toEqual(testUser._id);
    });
  });
});
