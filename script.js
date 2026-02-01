console.log("Freeze v1 loaded");

const openButton = document.getElementById("openBtn");
const urlInput = document.getElementById("urlInput");
const freezeButton = document.getElementById("freezeBtn")

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

        stream.getTracks().forEach((track) => track.stop());

        console.log("Capture stream received and stopped");
    } catch (err) {
        console.log("Capture cancelled or blocked");
    }
});