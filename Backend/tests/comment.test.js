import { describe, it, expect, beforeAll, afterAll, beforeEach } from "@jest/globals";
import User from "../models/User.js";
import Snippet from "../models/Snippet.js";
import ThreadedComment from "../models/ThreadedComment.js";
import { connectTestDB, disconnectTestDB, clearDatabase, createTestUser, createTestSnippet, createTestComment } from "./setup.js";

describe("Threaded Comment Tests", () => {
  let testUser, testSnippet;

  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  beforeEach(async () => {
    await clearDatabase();
    testUser = await createTestUser(User);
    testSnippet = await createTestSnippet(Snippet, testUser._id);
  });

  describe("Comment Creation", () => {
    it("should create a new comment", async () => {
      const comment = await createTestComment(ThreadedComment, testSnippet._id, testUser._id);
      expect(comment).toBeDefined();
      expect(comment.text).toBe("Test comment");
      expect(comment.lineNumber).toBe(1);
    });

    it("should create comment on specific line", async () => {
      const comment = await createTestComment(ThreadedComment, testSnippet._id, testUser._id, {
        lineNumber: 5,
      });
      expect(comment.lineNumber).toBe(5);
    });

    it("should create reply to comment", async () => {
      const parentComment = await createTestComment(ThreadedComment, testSnippet._id, testUser._id);
      
      const reply = await createTestComment(ThreadedComment, testSnippet._id, testUser._id, {
        text: "Reply to comment",
        parentComment: parentComment._id,
      });

      expect(reply.parentComment).toEqual(parentComment._id);
    });
  });

  describe("Comment Threads", () => {
    it("should get all comments for snippet", async () => {
      await createTestComment(ThreadedComment, testSnippet._id, testUser._id);
      await createTestComment(ThreadedComment, testSnippet._id, testUser._id);
      
      const comments = await ThreadedComment.find({ snippet: testSnippet._id });
      expect(comments.length).toBe(2);
    });

    it("should get comments for specific line", async () => {
      await createTestComment(ThreadedComment, testSnippet._id, testUser._id, { lineNumber: 1 });
      await createTestComment(ThreadedComment, testSnippet._id, testUser._id, { lineNumber: 2 });
      
      const lineComments = await ThreadedComment.find({ snippet: testSnippet._id, lineNumber: 1 });
      expect(lineComments.length).toBe(1);
    });

    it("should get comment thread with replies", async () => {
      const parent = await createTestComment(ThreadedComment, testSnippet._id, testUser._id);
      const reply1 = await createTestComment(ThreadedComment, testSnippet._id, testUser._id, {
        parentComment: parent._id,
      });
      const reply2 = await createTestComment(ThreadedComment, testSnippet._id, testUser._id, {
        parentComment: parent._id,
      });

      parent.replies.push(reply1._id, reply2._id);
      await parent.save();

      const thread = await ThreadedComment.findById(parent._id).populate("replies");
      expect(thread.replies.length).toBe(2);
    });
  });

  describe("Comment Editing", () => {
    it("should edit comment", async () => {
      const comment = await createTestComment(ThreadedComment, testSnippet._id, testUser._id);
      comment.text = "Updated comment";
      comment.isEdited = true;
      comment.lastEditedAt = new Date();
      await comment.save();

      const updated = await ThreadedComment.findById(comment._id);
      expect(updated.text).toBe("Updated comment");
      expect(updated.isEdited).toBe(true);
    });

    it("should track edit history", async () => {
      const comment = await createTestComment(ThreadedComment, testSnippet._id, testUser._id);
      
      comment.editHistory.push({
        content: comment.text,
        editedAt: new Date(),
        editedBy: testUser._id,
      });
      comment.text = "Updated";
      await comment.save();

      const updated = await ThreadedComment.findById(comment._id);
      expect(updated.editHistory.length).toBe(1);
      expect(updated.editHistory[0].content).toBe("Test comment");
    });
  });

  describe("Comment Resolution", () => {
    it("should resolve discussion", async () => {
      const comment = await createTestComment(ThreadedComment, testSnippet._id, testUser._id);
      comment.isResolved = true;
      comment.resolvedBy = testUser._id;
      comment.resolvedAt = new Date();
      await comment.save();

      const resolved = await ThreadedComment.findById(comment._id);
      expect(resolved.isResolved).toBe(true);
      expect(resolved.resolvedBy).toEqual(testUser._id);
    });

    it("should get unresolved comments", async () => {
      const comment1 = await createTestComment(ThreadedComment, testSnippet._id, testUser._id);
      const comment2 = await createTestComment(ThreadedComment, testSnippet._id, testUser._id);
      
      comment2.isResolved = true;
      await comment2.save();

      const unresolved = await ThreadedComment.find({ snippet: testSnippet._id, isResolved: false });
      expect(unresolved.length).toBe(1);
    });
  });

  describe("Comment Reactions", () => {
    it("should add like reaction", async () => {
      const comment = await createTestComment(ThreadedComment, testSnippet._id, testUser._id);
      comment.reactions.likes.push(testUser._id);
      await comment.save();

      const updated = await ThreadedComment.findById(comment._id);
      expect(updated.reactions.likes).toContain(testUser._id);
    });

    it("should add dislike reaction", async () => {
      const comment = await createTestComment(ThreadedComment, testSnippet._id, testUser._id);
      comment.reactions.dislikes.push(testUser._id);
      await comment.save();

      const updated = await ThreadedComment.findById(comment._id);
      expect(updated.reactions.dislikes).toContain(testUser._id);
    });

    it("should toggle between like and dislike", async () => {
      const comment = await createTestComment(ThreadedComment, testSnippet._id, testUser._id);
      
      // Add like
      comment.reactions.likes.push(testUser._id);
      await comment.save();

      // Remove like and add dislike
      comment.reactions.likes = comment.reactions.likes.filter(id => !id.equals(testUser._id));
      comment.reactions.dislikes.push(testUser._id);
      await comment.save();

      const updated = await ThreadedComment.findById(comment._id);
      expect(updated.reactions.likes).not.toContain(testUser._id);
      expect(updated.reactions.dislikes).toContain(testUser._id);
    });
  });

  describe("Comment Deletion", () => {
    it("should delete comment", async () => {
      const comment = await createTestComment(ThreadedComment, testSnippet._id, testUser._id);
      await ThreadedComment.findByIdAndDelete(comment._id);

      const deleted = await ThreadedComment.findById(comment._id);
      expect(deleted).toBeNull();
    });

    it("should delete comment and its replies", async () => {
      const parent = await createTestComment(ThreadedComment, testSnippet._id, testUser._id);
      const reply = await createTestComment(ThreadedComment, testSnippet._id, testUser._id, {
        parentComment: parent._id,
      });

      await ThreadedComment.findByIdAndDelete(parent._id);
      await ThreadedComment.deleteMany({ parentComment: parent._id });

      const parentDeleted = await ThreadedComment.findById(parent._id);
      const replyDeleted = await ThreadedComment.findById(reply._id);
      
      expect(parentDeleted).toBeNull();
      expect(replyDeleted).toBeNull();
    });
  });
});
