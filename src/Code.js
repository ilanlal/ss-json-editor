// Code.gs
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
    .getContent();
}

function getData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const range = sheet.getActiveRange();
  const values = range.getValues();
  return values;
}