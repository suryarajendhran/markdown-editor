// TODO: The title bar and save/revert buttons don't react to changes made through the undo operation.
const path = require("path");

const { remote, ipcRenderer } = require("electron");
const mainProcess = remote.require("./main");

let filePath = null;
let originalContent = "";
const currentWindow = remote.getCurrentWindow();

const markdownView = document.querySelector("#markdown");
const htmlView = document.querySelector("#html");
const newFileButton = document.querySelector("#new-file");
const openFileButton = document.querySelector("#open-file");
const saveMarkdownButton = document.querySelector("#save-markdown");
const revertButton = document.querySelector("#revert");
const saveHtmlButton = document.querySelector("#save-html");
const showFileButton = document.querySelector("#show-file");
const openInDefaultButton = document.querySelector("#open-in-default");

const renderMarkdownToHtml = (markdown) => {
  const DOMpurify = require("dompurify");
  const marked = require("marked");
  const cleanedMarkdown = DOMpurify.sanitize(markdown);
  htmlView.innerHTML = marked(cleanedMarkdown);
};

const updateUserInterface = (isEdited) => {
  let title = "Fire Sale";
  if (filePath) {
    title = `${path.basename(filePath)} - ${title}`;
  }

  if (isEdited) {
    title = `${title} (Edited)`;
  }

  if (filePath) currentWindow.setRepresentedFilename(filePath);
  currentWindow.setDocumentEdited(isEdited);

  saveMarkdownButton.disabled = !isEdited;
  revertButton.disabled = !isEdited;

  currentWindow.setTitle(title);
};

markdownView.addEventListener("keyup", (event) => {
  const currentContent = event.target.value;
  renderMarkdownToHtml(currentContent);

  updateUserInterface(currentContent !== originalContent);
});

openFileButton.addEventListener("click", () => {
  mainProcess.getFileFromUser();
});

saveMarkdownButton.addEventListener("click", () => {
  const content = markdownView.value;
  mainProcess.saveMarkdown(filePath, content);
});

ipcRenderer.on("file-opened", (event, file, content) => {
  filePath = file;
  originalContent = content;

  markdownView.value = content;
  renderMarkdownToHtml(content);
  updateUserInterface();
});
