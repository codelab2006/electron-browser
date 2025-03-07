const inputURL = document.getElementById("input-url");

inputURL.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    window.mainWorld.go(inputURL.value);
  }
});

document.getElementById("go").addEventListener("click", (event) => {
  event.preventDefault();
  window.mainWorld.go(inputURL.value);
});
