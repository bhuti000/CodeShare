import express from "express";
import passport from "../middleware/googleStrategy.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// STEP 1 → Redirect user to Google Login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// STEP 2 → Google redirects here
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Send token back to frontend
    res.redirect(`http://localhost:8080/login-success?token=${token}`);
  }
);

export default router;
