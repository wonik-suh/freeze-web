console.log("Freeze v1 loaded");

const openButton = document.getElementById("openBtn");
const urlInput = document.getElementById("urlInput");
const freezeButton = document.getElementById("freezeBtn")
const freezeImage = document.getElementById("freezeImage")
const cropButton = document.getElementById("cropBtn");
const imageStage = document.getElementById("imageStage");
const selectionBox = document.getElementById("selectionBox");

let cropMode = false;
let isDragging = false;
let startX = 0;
let startY = 0;

openButton.addEventListener("click", () => {
  const url = urlInput.value;

  if (!url) {
    return;
  }

  window.open(url, "_blank");
});

freezeButton.addEventListener("click", async () => {
    try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
            video: true
        });

        const video = document.createElement("video");
        video.srcObject = stream;

        await video.play();

        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        freezeImage.src = canvas.toDataURL("image/png");

        stream.getTracks().forEach((track) => track.stop());
    } catch (err) {
        console.log("Capture cancelled or blocked");
    }
});

cropButton.addEventListener("click", () => {
  cropMode = !cropMode;

  selectionBox.style.display = "none";
  isDragging = false;

  console.log("Crop mode:", cropMode ? "ON" : "OFF");
});

imageStage.addEventListener("mousedown", (e) => {
  if (!cropMode) return;

  const rect = imageStage.getBoundingClientRect();
  startX = e.clientX - rect.left;
  startY = e.clientY - rect.top;

  isDragging = true;

  selectionBox.style.left = `${startX}px`;
  selectionBox.style.top = `${startY}px`;
  selectionBox.style.width = "0px";
  selectionBox.style.height = "0px";
  selectionBox.style.display = "block";
});

imageStage.addEventListener("mousemove", (e) => {
  if (!cropMode || !isDragging) return;
  console.log("mousemove fired");

  const rect = imageStage.getBoundingClientRect();
  const currentX = e.clientX - rect.left;
  const currentY = e.clientY - rect.top;

  const x = Math.min(startX, currentX);
  const y = Math.min(startY, currentY);
  const w = Math.abs(currentX - startX);
  const h = Math.abs(currentY - startY);

  selectionBox.style.left = `${x}px`;
  selectionBox.style.top = `${y}px`;
  selectionBox.style.width = `${w}px`;
  selectionBox.style.height = `${h}px`;
});

window.addEventListener("mouseup", () => {
  if (!cropMode || !isDragging) return;
  console.log("mouseup fired");

  isDragging = false;
});