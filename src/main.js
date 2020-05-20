const fs = require("fs");
const { app, BrowserWindow, dialog } = require("electron");

let mainWindow = null;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  getFileFromUser();

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
});

const getFileFromUser = async () => {
  const files = await dialog.showOpenDialog({
    properties: ["openFile"],
  });

  if (!files) return;

  file = files[0];

  const content = fs.readFileSync(file).toString();

  console.log(content);
};
