// Code.gs
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
    .getContent();
}