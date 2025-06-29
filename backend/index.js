// import express from "express";
import express from "express";
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
    origin: "https://linkedin-clone-pnv4.onrender.com",
    credentials: true,
  })
);

let port = process.env.PORT || 5000;

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/connection", connectionRouter);
app.use("/api/notification", notificationRouter);

// app.get("/", (req, res) => {
//   res.send("Hello");
//   // res.json({
//     //     msg:"Hello",
//     // })
//   });

  //websocket server

  export const io = new Server(server, {
  cors: {
    origin: "https://linkedin-clone-pnv4.onrender.com", // React app URL
    credentials: true,
  },
});
// Store user socket connections,   connection mate socket
export const userSocketMap = new Map();

io.on("connection", (socket) => {
//   console.log("User Connected", socket.id);
  //send userId. / User registers their socket
  socket.on("register", (userId) => {
    userSocketMap.set(userId, socket.id);
    // console.log(userSocketMap);
  });

  socket.on("disconnect", (socket) => {
    // console.log("User Disconnected", socket.id);
  });
});

server.listen(port, async () => {
  await connectDb();
  console.log("Server started");
});

//http://localhost:8000/api/auth/signUp
