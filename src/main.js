const { app, BrowserWindow } = require("electron");

let mainWindow = null;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
});

// Startup without optimization
// app.on("ready", () => {
//   mainWindow = new BrowserWindow();

//   mainWindow.loadURL(`file://${__dirname}/index.html`);
// });
