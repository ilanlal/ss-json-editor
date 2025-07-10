// src/Code.js

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
    .getContent();
}
