console.log("Freeze v1 loaded");

const openButton = document.getElementById("openBtn");
const urlInput = document.getElementById("urlInput");
const freezeButton = document.getElementById("freezeBtn")
const freezeImage = document.getElementById("freezeImage")

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