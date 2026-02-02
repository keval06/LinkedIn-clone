// import express from "express";
import express from "express";
import path from "path";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
import connectionRouter from "./routes/connection.routes.js";
import http from "http";
import { Server } from "socket.io";
import notificationRouter from "./routes/notification.routes.js";

const app = express();
let server = http.createServer(app); //socket

// dotenv.config().process;

dotenv.config();

app.use(express.json()); //we forget this, middlewre

app.use(cookieParser()); //some middleware

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:3001",
      "https://linkedin-clone-pnv4.onrender.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

let port = process.env.PORT || 5000;
//store user socket connections
export const userSocketMap = new Map();

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    message: "LinkedIn Clone Backend is running!",
    timestamp: new Date().toISOString(),
    socketConnections: userSocketMap.size,
  });
});

app.get("/api", (req, res) => {
  res.json({ message: "API is working!" });
});

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/connection", connectionRouter);
app.use("/api/notification", notificationRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message:
      process.env.NODE_ENVIRONMENT === "development"
        ? err.message
        : "Internal server error",
  });
});
// app.get("/", (req, res) => {
//   res.send("Hello");
//   // res.json({
//     //     msg:"Hello",
//     // })
//   });

//websocket server

export const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:3001",
      "https://linkedin-clone-pnv4.onrender.com",
    ], // React app URL
    credentials: true,
    methods: ["GET", "POST"],
    allowEIO3: true, // For better compatibility
  },
  transports: ["websocket", "polling"], // Explicitly define transports
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Store user socket connections,   connection mate socket

io.on("connection", (socket) => {
  console.log("index.js:102 | User Connected:", socket.id);

  // User registers their socket
  socket.on("register", (userId) => {
    if (userId) {
      userSocketMap.set(userId, socket.id);
      // console.log(`User ${userId} registered with socket ${socket.id}`);
      // console.log("Active connections:", userSocketMap.size);
    }
  });
});

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
  });
}

export default app;

// Start server
server.listen(port, async () => {
  try {
    console.log(`Server attempting to start on port ${port}`);
    await connectDb();
    console.log(`Database connected successfully`);
    console.log(`Server started on port ${port}`);
    console.log(`Socket.IO server ready`);
  } catch (error) {
    console.error("Failed to start server:", error);
    console.error("Error details:", error.message);
    process.exit(1);
  }
});

// For deployment platforms that expect app export
export { app };
// For local development
// if (process.env.NODE_ENVIRONMENT !== 'production') {
//   server.listen(port, () => {
//     console.log(`Server started on port ${port}`);
//   });
// }
