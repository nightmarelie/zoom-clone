import express from "express";
import http from "http";
import { Server } from "socket.io";
import { v4 as uuidV4 } from "uuid";

const app = express();
const server = http.Server(app);
const io = new Server(server);

app.set("view engine", "ejs");
app.set("views", "./src/views");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect(`/${uuidV4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);

    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", userId);
    });
  });
});

server.listen("3000");
