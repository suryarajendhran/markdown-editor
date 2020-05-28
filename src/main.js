// TODO: Optimise require for fs.

console.time("init");
const { app, BrowserWindow, dialog } = require("electron");
let fs = null;

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
    fs = require("fs");
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

exports.saveMarkdown = async (file, content) => {
  if (!file) {
    fileObject = await dialog.showSaveDialog({
      title: "Save Markdown",
      defaultPath: app.getPath("documents"),
      filters: [
        {
          name: "Markdown files",
          extensions: ["md", "markdown", "mdown", "marcdown"],
        },
      ],
    });

    if (fileObject.canceled) return;

    file = fileObject.filePath;
  }

  fs.writeFileSync(file, content);
};

const openFile = (file) => {
  const content = fs.readFileSync(file).toString();
  app.addRecentDocument(file);
  mainWindow.webContents.send("file-opened", file, content);
};
