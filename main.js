const { app, BrowserWindow, ipcMain, Menu } = require("electron/main");
const { join } = require("node:path");
const { readFileSync } = require("node:fs");

const createWindow = () => {
  let modal = null;
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    show: false,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
    },
    autoHideMenuBar: true,
  });

  const showURLDialog = () => {
    if (modal && !modal.isDestroyed()) {
      modal.focus();
      return;
    }
    modal = new BrowserWindow({
      width: 600,
      height: 230,
      show: false,
      useContentSize: true,
      backgroundColor: "#f3f5f9",
      parent: win,
      modal: true,
      alwaysOnTop: true,
      resizable: false,
      webPreferences: {
        preload: join(__dirname, "preload.js"),
      },
    });
    modal.setMenu(null);
    modal.removeMenu();
    const dialog = modal;
    dialog.once("ready-to-show", () => {
      dialog.show();
    });
    const configPath = app.isPackaged
      ? join(process.resourcesPath, "config.json")
      : join(__dirname, "resources", "config.json");
    let defaultUrl = "";
    try {
      const config = JSON.parse(readFileSync(configPath, "utf8"));
      if (typeof config?.defaultUrl === "string") defaultUrl = config.defaultUrl;
    } catch (error) {
      console.error("Failed to load config:", error.message);
    }
    dialog.loadFile("url.html", { query: { url: defaultUrl } });
    dialog.on("closed", () => {
      if (modal === dialog) modal = null;
    });
  };

  win.setMenu(
    Menu.buildFromTemplate([
      {
        label: "URL",
        accelerator: "F1",
        click: () => showURLDialog(),
      },
      {
        label: "DevTool",
        accelerator: "F12",
        click: () => {
          win.webContents.openDevTools();
        },
      },
    ])
  );
  win.once("ready-to-show", () => {
    win.once("focus", () => {
      if (win.isMaximized()) {
        showURLDialog();
      } else {
        win.once("maximize", showURLDialog);
        win.maximize();
      }
    });
    win.show();
  });
  win.loadFile("index.html");

  ipcMain.handle("go", (_, url) => {
    const value = url.trim();
    if (!value) return;
    modal?.close();
    win.loadURL(/^https?:\/\//i.test(value) ? value : `http://${value}`)
      .catch(console.error);
  });
  win.on("closed", () => ipcMain.removeHandler("go"));

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
