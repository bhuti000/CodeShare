import jwt from "jsonwebtoken";
import User from "../models/User.js";

// PROTECT ROUTES
export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "No token, unauthorized" });
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // load full user from DB
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;  // FULL USER stored in req
    next();
  } catch (err) {
    console.error("AUTH ERROR:", err);
    res.status(401).json({ message: "Invalid token" });
  }
};

// DEFAULT EXPORT
export default protect;
