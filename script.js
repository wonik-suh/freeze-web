console.log("Freeze v1 loaded");

const openButton = document.getElementById("openBtn");
const urlInput = document.getElementById("urlInput");
const freezeButton = document.getElementById("freezeBtn")
const freezeImage = document.getElementById("freezeImage")
const cropButton = document.getElementById("cropBtn");
const imageStage = document.getElementById("imageStage");
const selectionBox = document.getElementById("selectionBox");
const cropStatus = document.getElementById("cropStatus");


let cropMode = false;
let isDragging = false;
let startX = 0;
let startY = 0;
let selX = 0;
let selY = 0;
let selW = 0;
let selH = 0;


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
  
  if (cropMode) {
    cropStatus.textContent = "Crop mode is ON - drag to select an area";
  } else {
    cropStatus.textContent = "Crop mode is OFF";
  }

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

  const rect = imageStage.getBoundingClientRect();
  const currentX = e.clientX - rect.left;
  const currentY = e.clientY - rect.top;

  selX = Math.min(startX, currentX);
  selY = Math.min(startY, currentY);
  selW = Math.abs(currentX - startX);
  selH = Math.abs(currentY - startY);

  selectionBox.style.left = `${selX}px`;
  selectionBox.style.top = `${selY}px`;
  selectionBox.style.width = `${selW}px`;
  selectionBox.style.height = `${selH}px`;
});

window.addEventListener("mouseup", () => {
  if (!cropMode || !isDragging) return;

  isDragging = false;
  console.log("Selection locked", { selX, selY, selW, selH });

  if (!freezeImage.src) {
    selectionBox.style.display = "none";
    return;
  }

  if (selW < 10 || selH < 10) {
    selectionBox.style.display = "none";
    return;
  }

  const ok = window.confirm("Crop this area? This will replace the current snapshot.");
  if (!ok) {
    selectionBox.style.display = "none";
    return;
  }

  const imgRect = freezeImage.getBoundingClientRect();
  const scaleX = freezeImage.naturalWidth / imgRect.width;
  const scaleY = freezeImage.naturalHeight / imgRect.height;

  const cropX = Math.round(selX * scaleX);
  const cropY = Math.round(selY * scaleY);
  const cropW = Math.round(selW * scaleX);
  const cropH = Math.round(selH * scaleY);

  const canvas = document.createElement("canvas");
  canvas.width = cropW;
  canvas.height = cropH;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(
    freezeImage,
    cropX, cropY, cropW, cropH,
    0, 0, cropW, cropH
  );

  freezeImage.src = canvas.toDataURL("image/png");
  selectionBox.style.display = "none";
});
