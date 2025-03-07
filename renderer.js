const information = document.getElementById("info");
information.innerText = `This app is using Chrome (v${window.mainWorld.chrome()}), Node.js (v${window.mainWorld.node()}), and Electron (v${window.mainWorld.electron()})`;
