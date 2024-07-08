const express = require("express");
const cors = require("cors");
const http = require("http");
const { v4: uuidv4 } = require("uuid");
const { Server } = require("socket.io");
const path = require("path");

// Create an Express application
const app = express();

app.use(cors());
app.use(express.json());

// Set EJS as the templating engine
app.set("view engine", "ejs");

// Set the views directory
app.set("views", path.join(__dirname, "views"));

// Serve static files (for the client)
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index", {
    title: "Room Feature with Video Sync and Chat"
});
});

// Create an HTTP server
const server = http.createServer(app);

// Integrate Socket.io with the server
const io = new Server(server);

// Room management
const rooms = {};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("createRoom", () => {
    const roomId = uuidv4();
    rooms[roomId] = { users: [], videoUrl: null };
    socket.join(roomId);
    rooms[roomId].users.push(socket.id);
    socket.emit("roomCreated", roomId);
    console.log("Room created with ID:", roomId);
  });

  socket.on("joinRoom", (roomId) => {
    if (rooms[roomId]) {
      socket.join(roomId);
      rooms[roomId].users.push(socket.id);
      socket.emit("roomJoined", roomId, rooms[roomId].videoUrl);
      console.log(`User ${socket.id} joined room ${roomId}`);
    } else {
      socket.emit("error", "Room not found");
    }
  });

  socket.on("embedVideo", (roomId, videoUrl) => {
    if (rooms[roomId]) {
      rooms[roomId].videoUrl = videoUrl;
      io.to(roomId).emit("videoEmbedded", videoUrl);
      console.log(`Video URL ${videoUrl} embedded in room ${roomId}`);
    } else {
      socket.emit("error", "Room not found");
    }
  });

  socket.on("playVideo", (roomId, currentTime) => {
    if (rooms[roomId]) {
      io.to(roomId).emit("playVideo", currentTime);
      console.log(`Playing video in room ${roomId} at ${currentTime}s`);
    } else {
      socket.emit("error", "Room not found");
    }
  });

  socket.on("pauseVideo", (roomId, currentTime) => {
    if (rooms[roomId]) {
      io.to(roomId).emit("pauseVideo", currentTime);
      console.log(`Pausing video in room ${roomId} at ${currentTime}s`);
    } else {
      socket.emit("error", "Room not found");
    }
  });

  socket.on("seekVideo", (roomId, currentTime) => {
    if (rooms[roomId]) {
      io.to(roomId).emit("seekVideo", currentTime);
      console.log(`Seeking video in room ${roomId} to ${currentTime}s`);
    } else {
      socket.emit("error", "Room not found");
    }
  });

  // Handle sending messages
  socket.on("sendMessage", (roomId, message) => {
    if (rooms[roomId]) {
      io.to(roomId).emit("receiveMessage", { userId: socket.id, message });
      console.log(
        `Message sent to room ${roomId} by user ${socket.id}: ${message}`
      );
    } else {
      socket.emit("error", "Room not found");
    }
  });

  socket.on("disconnect", async () => {
    console.log("User disconnected:", socket.id);
    for (const roomId in rooms) {
      const index = rooms[roomId].users.indexOf(socket.id);
      if (index !== -1) {
        rooms[roomId].users.splice(index, 1);
        if (rooms[roomId].users.length === 0) {
          delete rooms[roomId];
          console.log("Room deleted:", roomId);
        }
        break;
      }
    }
  });
});

// Error-handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const PORT = process.env.PORT || 5050;
// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
