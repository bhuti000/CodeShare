import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import snippetRoutes from "./routes/snippetRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import googleAuthRoutes from "./routes/googleAuthRoutes.js";
import "./middleware/googleStrategy.js";

dotenv.config();

// ✅ ADD DEBUG CODE HERE (after dotenv.config)
console.log("🔍 Checking OAuth Credentials:");
console.log("Client ID exists:", !!process.env.GOOGLE_CLIENT_ID);
console.log("Client ID length:", process.env.GOOGLE_CLIENT_ID?.length);
console.log("Client Secret exists:", !!process.env.GOOGLE_CLIENT_SECRET);
console.log("Client Secret length:", process.env.GOOGLE_CLIENT_SECRET?.length);
console.log("Expected Secret length: ~35-40 characters");

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Add cache-control headers to prevent caching
app.use((req, res, next) => {
  res.set("Cache-Control", "no-cache, no-store, must-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
});

// =========================
// API ROUTES
// =========================
app.use("/api/auth", authRoutes);
app.use("/api/snippets", snippetRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/auth", googleAuthRoutes);

// =========================
// SOCKET SERVER
// =========================
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);
  socket.on("edit-snippet", (data) => {
    socket.broadcast.emit("receive-edit", data);
  });
});

// =========================
// DEFAULT ROUTE
// =========================
app.get("/", (req, res) => {
  res.send("Backend Running ✔");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
