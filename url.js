const inputURL = document.getElementById("input-url");
const goButton = document.getElementById("go");
inputURL.focus();
inputURL.select();
window.addEventListener("focus", () => inputURL.focus());

const submitURL = (event) => {
  event.preventDefault();
  window.mainWorld.go(inputURL.value).catch(console.error);
};

inputURL.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.isComposing) {
    submitURL(event);
  }
});

goButton.addEventListener("click", submitURL);
