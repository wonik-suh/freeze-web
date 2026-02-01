console.log("Freeze v1 loaded");

const openButton = document.getElementById("openBtn");
const urlInput = document.getElementById("urlInput");

openButton.addEventListener("click", () => {
  const url = urlInput.value;

  if (!url) {
    return;
  }

  window.open(url, "_blank");
});
