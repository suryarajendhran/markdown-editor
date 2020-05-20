const { remote, ipcRenderer } = require("electron");
const mainProcess = remote.require("./main");

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

markdownView.addEventListener("keyup", (event) => {
  const currentContent = event.target.value;
  renderMarkdownToHtml(currentContent);
});

openFileButton.addEventListener("click", () => {
  mainProcess.getFileFromUser();
});

ipcRenderer.on("file-opened", (event, file, content) => {
  markdownView.value = content;
  renderMarkdownToHtml(content);
});
