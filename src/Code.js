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

function toest_doValidationReport() {
  const response = doValidationReport({
    pageSize: 3,
    offset: 0,
    a1NotationRange: 'C9:E23'
  });

  Logger.log({
    nextRowOffset: response.nextRowOffset,
    page: response.page,
    range: response.range
  });
}