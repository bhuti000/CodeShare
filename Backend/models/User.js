import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: String,

    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "editor", "viewer"],
      default: "editor",
    },

    // ✅ NEW: User preferences
    emailNotifications: {
      type: Boolean,
      default: true,
    },

    // ✅ NEW: User profile
    bio: String,
    avatar: String,
    website: String,

    // ✅ NEW: Account status
    isActive: {
      type: Boolean,
      default: true,
    },

    // ✅ NEW: Last login
    lastLogin: Date,

    // ✅ NEW: Followers/Following
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ],

    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ],
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

export default mongoose.model("User", userSchema);
