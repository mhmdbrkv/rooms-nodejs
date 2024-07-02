const socket = io();
let isUserAction = true;

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

document.getElementById("sendMessage").addEventListener("click", () => {
  const roomId = document.getElementById("roomIdInput").value;
  const message = document.getElementById("messageInput").value;
  socket.emit("sendMessage", roomId, message);
  document.getElementById("messageInput").value = ""; // Clear the input field
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

socket.on("playVideo", (currentTime) => {
  const videoElement = document.getElementById("videoElement");
  isUserAction = false;
  videoElement.currentTime = currentTime;
  videoElement.play();
});

socket.on("pauseVideo", (currentTime) => {
  const videoElement = document.getElementById("videoElement");
  isUserAction = false;
  videoElement.currentTime = currentTime;
  videoElement.pause();
});

socket.on("seekVideo", (currentTime) => {
  const videoElement = document.getElementById("videoElement");
  isUserAction = false;
  videoElement.currentTime = currentTime;
});

socket.on("receiveMessage", (data) => {
  const chatContainer = document.getElementById("chatContainer");
  const messageElement = document.createElement("p");
  messageElement.textContent = `User ${data.userId}: ${data.message}`;
  chatContainer.appendChild(messageElement);
});

function displayVideo(videoUrl) {
  const videoContainer = document.getElementById("videoContainer");
  videoContainer.innerHTML = `<video id="videoElement" width="560" height="315" controls>
                                    <source src="${videoUrl}" type="video/mp4">
                                </video>`;

  const videoElement = document.getElementById("videoElement");

  videoElement.addEventListener("play", () => {
    if (isUserAction) {
      const roomId = document.getElementById("roomIdInput").value;
      socket.emit("playVideo", roomId, videoElement.currentTime);
    }
    isUserAction = true;
  });

  videoElement.addEventListener("pause", () => {
    if (isUserAction) {
      const roomId = document.getElementById("roomIdInput").value;
      socket.emit("pauseVideo", roomId, videoElement.currentTime);
    }
    isUserAction = true;
  });

  videoElement.addEventListener("seeking", () => {
    if (isUserAction) {
      const roomId = document.getElementById("roomIdInput").value;
      socket.emit("seekVideo", roomId, videoElement.currentTime);
    }
    isUserAction = true;
  });
}
