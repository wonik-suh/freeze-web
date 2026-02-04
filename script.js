console.log("Freeze v1 loaded");

const openButton = document.getElementById("openBtn");
const urlInput = document.getElementById("urlInput");
const freezeButton = document.getElementById("freezeBtn")
const freezeImage = document.getElementById("freezeImage")
const cropButton = document.getElementById("cropBtn");
const imageStage = document.getElementById("imageStage");
const selectionBox = document.getElementById("selectionBox");
const cropStatus = document.getElementById("cropStatus");
const historyList = document.getElementById("historyList")

let cropMode = false;
let isDragging = false;
let startX = 0;
let startY = 0;
let selX = 0;
let selY = 0;
let selW = 0;
let selH = 0;
let activeSnapshotIndex = -1;

const snapshots = [];
const MAX_SNAPSHOTS = 5;

function addSnapshot(src) {
  if (!src) return;

  snapshots.push({ src });

  if (snapshots.length > MAX_SNAPSHOTS) {
    snapshots.shift();

    if (activeSnapshotIndex >= 0) {
      activeSnapshotIndex -= 1;
    }
  }

  activeSnapshotIndex = snapshots.length - 1;

  renderHistory();
};

function renderHistory() {
  if (!historyList) return;

  historyList.innerHTML = "";

  snapshots.forEach((item, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = "history-item";

    const thumb = document.createElement("img");
    thumb.src = item.src;
    thumb.alt = `Snapshot ${index + 1}`;
    thumb.className = "history-thumb";

    if (index === activeSnapshotIndex) {
      thumb.classList.add("active");
    }

    thumb.addEventListener("click", () => {
      activeSnapshotIndex = index;
      freezeImage.src = item.src;
      renderHistory();
    });

    const del = document.createElement("button");
    del.type = "button";
    del.className = "history-delete";
    del.textContent = "×";

    del.addEventListener("click", (e) => {
      e.stopPropagation(); // prevent selecting the thumbnail
      deleteSnapshot(index);
    });

    wrapper.appendChild(thumb);
    wrapper.appendChild(del);
    historyList.appendChild(wrapper);
  });
};

function deleteSnapshot(index) {
  if (index < 0 || index >= snapshots.length) return;

  snapshots.splice(index, 1);

  // adjust active index
  if (snapshots.length === 0) {
    activeSnapshotIndex = -1;
    freezeImage.src = "";
  } else if (activeSnapshotIndex === index) {
    // if deleted the active one, pick the nearest valid index
    activeSnapshotIndex = Math.min(index, snapshots.length - 1);
    freezeImage.src = snapshots[activeSnapshotIndex].src;
  } else if (activeSnapshotIndex > index) {
    activeSnapshotIndex -= 1;
  }

  renderHistory();
};

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
        addSnapshot(freezeImage.src);

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
    imageStage.classList.add("crop-mode");
    cropStatus.textContent = "Crop mode is ON - drag to select an area";
  } else {
    imageStage.classList.remove("crop-mode");
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
  if (activeSnapshotIndex >= 0 && snapshots[activeSnapshotIndex]) {
    snapshots[activeSnapshotIndex].src = freezeImage.src;
    renderHistory();
  } else {
    addSnapshot(freezeImage.src);
  }
  selectionBox.style.display = "none";

  cropMode = false;
  imageStage.classList.remove("crop-mode");
  cropStatus.textContent = "Crop mode is OFF";
});


