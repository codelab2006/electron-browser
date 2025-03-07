const { app, BrowserWindow, ipcMain, Menu } = require("electron/main");
const path = require("node:path");

const createWindow = () => {
  let modal = null;
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    autoHideMenuBar: true,
  });

  const showURLDialog = () => {
    modal = new BrowserWindow({
      width: 300,
      height: 50,
      parent: win,
      modal: true,
      resizable: false,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
      },
    });
    modal.setMenu(null);
    modal.removeMenu();
    modal.loadFile("url.html");
    modal.on("close", () => {
      modal.destroy();
      modal = null;
    });
  };

  win.setMenu(
    Menu.buildFromTemplate([
      {
        label: "URL",
        click: () => showURLDialog(),
      },
      {
        label: "DevTool",
        click: () => {
          win.webContents.openDevTools();
        },
      },
    ])
  );
  win.maximize();
  win.loadFile("index.html");

  ipcMain.handle("go", (_, url) => {
    modal.close();
    win.loadURL(`http://${url}`);
  });

  showURLDialog();
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
