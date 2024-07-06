const socket = io();
let isUserAction = true;

// for auto refresh
// if (!sessionStorage.getItem("reloaded")) {
//   sessionStorage.setItem("reloaded", "true");
//   location.reload();
//   sessionStorage.setItem("reloaded", "false");
// }

const embed = (videoUrl) => {
  const roomId = document.getElementById("roomIdInput").value;
  socket.emit("embedVideo", roomId, videoUrl);
};

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

function isEmbeddedYouTubeLink(url) {
  const embedRegex =
    /^https:\/\/(www\.youtube\.com\/embed\/|www\.youtube-nocookie\.com\/embed\/)/;
  return embedRegex.test(url);
}
function containsYouTubeEmbedIframe(htmlString) {
  const iframeRegex =
    /<iframe\s+[^>]*src=["']https:\/\/(www\.youtube\.com\/embed\/|www\.youtube-nocookie\.com\/embed\/)[^"']*["'][^>]*><\/iframe>/;
  return iframeRegex.test(htmlString);
}

function displayVideo(videoUrl) {
  if (isEmbeddedYouTubeLink(videoUrl)) {
    const videoContainer = document.getElementById("videoContainer");
    videoContainer.innerHTML = `<iframe width="560" height="315"
    src=${videoUrl}
    title="YouTube video player"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen></iframe>`;
  } else if (containsYouTubeEmbedIframe(videoUrl.toString())) {
    const videoContainer = document.getElementById("videoContainer");
    videoContainer.innerHTML = videoUrl.toString();
  } else {
    const videoContainer = document.getElementById("videoContainer");
    videoContainer.innerHTML = `<video id="videoElement" width="70" height="30" controls>
                                    <source src="${videoUrl}" type="video/mp4">
                                </video>`;
  }

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
