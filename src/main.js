console.time("init");
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
    // Done! Ideally we want to get here <100ms after the user clicks the app
    console.timeEnd("init");
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
  const fs = require("fs");
  const content = fs.readFileSync(file).toString();
  app.addRecentDocument(file);
  mainWindow.webContents.send("file-opened", file, content);
};
