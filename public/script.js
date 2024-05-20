const socket = io();

document.getElementById("createRoom").addEventListener("click", () => {
  socket.emit("createRoom");
});

document.getElementById("joinRoom").addEventListener("click", () => {
  const roomId = document.getElementById("roomIdInput").value;
  socket.emit("joinRoom", roomId);
});

socket.on("roomCreated", (roomId) => {
  alert(`Room created with ID: ${roomId}`);
});

socket.on("roomJoined", (roomId) => {
  alert(`Joined room: ${roomId}`);
});

socket.on("error", (message) => {
  alert(message);
});
