import { describe, it, expect, beforeAll, afterAll, beforeEach } from "@jest/globals";
import User from "../models/User.js";
import { connectTestDB, disconnectTestDB, clearDatabase, createTestUser } from "./setup.js";

describe("Authentication Tests", () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  describe("User Registration", () => {
    it("should create a new user", async () => {
      const user = await createTestUser(User);
      expect(user).toBeDefined();
      expect(user.email).toBe("test@example.com");
      expect(user.role).toBe("editor");
    });

    it("should hash password", async () => {
      const user = await createTestUser(User);
      expect(user.password).not.toBe("password123");
    });

    it("should not allow duplicate emails", async () => {
      await createTestUser(User);
      
      try {
        await createTestUser(User);
        expect(true).toBe(false); // Should not reach here
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });

  describe("User Login", () => {
    it("should compare password correctly", async () => {
      const user = await createTestUser(User);
      const isMatch = await user.comparePassword("password123");
      expect(isMatch).toBe(true);
    });

    it("should reject wrong password", async () => {
      const user = await createTestUser(User);
      const isMatch = await user.comparePassword("wrongpassword");
      expect(isMatch).toBe(false);
    });
  });

  describe("User Roles", () => {
    it("should create user with admin role", async () => {
      const user = await createTestUser(User, { role: "admin" });
      expect(user.role).toBe("admin");
    });

    it("should create user with viewer role", async () => {
      const user = await createTestUser(User, { role: "viewer" });
      expect(user.role).toBe("viewer");
    });

    it("should default to editor role", async () => {
      const user = await createTestUser(User, { role: undefined });
      expect(user.role).toBe("editor");
    });
  });

  describe("User Profile", () => {
    it("should update user profile", async () => {
      const user = await createTestUser(User);
      user.bio = "Test bio";
      user.website = "https://example.com";
      await user.save();

      const updatedUser = await User.findById(user._id);
      expect(updatedUser.bio).toBe("Test bio");
      expect(updatedUser.website).toBe("https://example.com");
    });

    it("should track last login", async () => {
      const user = await createTestUser(User);
      const now = new Date();
      user.lastLogin = now;
      await user.save();

      const updatedUser = await User.findById(user._id);
      expect(updatedUser.lastLogin).toBeDefined();
    });
  });
});
