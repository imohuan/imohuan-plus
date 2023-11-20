import { initialize, enable } from "@electron/remote/main";
import { app, BrowserWindow } from "electron";
import { resolve } from "path";
import isDev from "electron-is-dev";

app.whenReady().then(async () => {
  initialize();

  const window = new BrowserWindow({
    minWidth: 600,
    minHeight: 400,
    // transparent: true,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      contextIsolation: false
      // nodeIntegrationInWorker: true,
      // nodeIntegrationInSubFrames: true,
      // allowRunningInsecureContent: true,
      // javascript: true,
      // images: true,
      // disableDialogs: true
    }
  });

  enable(window.webContents);

  if (isDev) {
    window.loadURL(`http://localhost:8848`);
  } else {
    window.loadFile(resolve(__dirname, "../renderer/index.html"));
  }
  window.webContents.openDevTools({ mode: "right" });
});
