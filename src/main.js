const fs = require("fs");
const { app, BrowserWindow, dialog } = require("electron");

let mainWindow = null;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
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

exports.getFileFromUser = async () => {
  const fileObject = await dialog.showOpenDialog({
    properties: ["openFile"],
    buttonLabel: "Unveil",
    filters: [
      {
        name: "Markdown Files",
        extensions: ["md", "mdown", "markdown", "marcdown"],
      },
      {
        name: "Text Files",
        extensions: ["txt", "text"],
      },
    ],
  }); // Returns an object in the form {canceled: bool, filePaths: []}

  if (fileObject.canceled) return;

  const files = fileObject.filePaths;
  const file = files[0];
  openFile(file);
};

const openFile = (file) => {
  const content = fs.readFileSync(file).toString();
  mainWindow.webContents.send("file-opened", file, content);
};
