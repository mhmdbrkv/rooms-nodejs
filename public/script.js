const socket = io();

document.getElementById("createRoom").addEventListener("click", () => {
  socket.emit("createRoom");
});

document.getElementById("joinRoom").addEventListener("click", () => {
  const roomId = document.getElementById("roomIdInput").value;
  socket.emit("joinRoom", roomId);
});

document.getElementById("embedVideo").addEventListener("click", () => {
  const roomId = document.getElementById("roomIdInput").value;
  const videoUrl = document.getElementById("videoUrlInput").value;
  socket.emit("embedVideo", roomId, videoUrl);
});

socket.on("roomCreated", (roomId) => {
  alert(`Room created with ID: ${roomId}`);
  document.getElementById("roomControls").style.display = "block";
  document.getElementById("roomIdInput").value = roomId;
});

socket.on("roomJoined", (roomId, videoUrl) => {
  alert(`Joined room: ${roomId}`);
  document.getElementById("roomControls").style.display = "block";
  if (videoUrl) {
    displayVideo(videoUrl);
  }
});

socket.on("videoEmbedded", (videoUrl) => {
  displayVideo(videoUrl);
});

socket.on("error", (message) => {
  alert(message);
});

function displayVideo(videoUrl) {
  const videoContainer = document.getElementById("videoContainer");
  videoContainer.innerHTML = `<iframe width="560" height="315" src="${videoUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
}
