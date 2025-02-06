// Code.gs
var selectedRange = null;
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
    .getContent();
}
function getSelectedRange() {
  return selectedRange;
}

function getEmail() {
  return Session.getActiveUser().getEmail();
}
// https://developers.google.com/apps-script/add-ons/clean-sheet
function openSidebar(e) {
  // Only show the sidebar if the user is an add-on
  if (e && e.authMode !== ScriptApp.AuthMode.NONE) {
    return;
  }
  const htmlOutput = HtmlService
    .createTemplateFromFile('html/sidebar/Page')
    .evaluate();
  SpreadsheetApp.getUi().showSidebar(htmlOutput);

}

function validateJsonOnServer() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const range = sheet.getActiveRange();
    // check if the selected range is 1 cell
    if (range.getNumRows() > 1 || range.getNumColumns() > 1) {
      SpreadsheetApp.getActiveSpreadsheet().toast('Please select only one cell', 'JSON Editor ‼️', 3);
      return;
    }

    // Get the value of the selected range
    const value = range.getValue() + '';
    JSON.parse(value);
    return value;
  } catch (error) {
    SpreadsheetApp.getActiveSpreadsheet().toast('Invalid JSON ☠️☠️', error.toString(), 15);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // set the background color to yellow
    const range = sheet.getActiveRange();
    range.setBackground('#FFFF00');
    throw error;
  }
}

function validateJsonOnServerSummaryReport() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const range = sheet.getActiveRange();
    // check if the selected any cell is selected
    if (range.getNumRows() < 1 || range.getNumColumns() < 1) {
      SpreadsheetApp.getActiveSpreadsheet().toast('Please select a range', 'JSON Editor ‼️', 3);
      return;
    }

    const summaryReport = {
      range: range.getA1Notation(),
      numRows: range.getNumRows(),
      numColumns: range.getNumColumns(),
      results: new Array(range.getNumRows()).fill(null).map(() => new Array(range.getNumColumns()).fill(null))
    };

    // for each cell in the selected range validate the JSON
    const values = range.getValues();
    for (let i = 0; i < values.length; i++) {
      for (let j = 0; j < values[i].length; j++) {
        try {
          JSON.parse(values[i][j]);
          summaryReport.results[i][j] = {'icon':'✅', 'range': range.getCell(i + 1, j + 1).getA1Notation()};
        } catch (error) {
          summaryReport.results[i][j] = {'icon':'❌', 'range': range.getCell(i + 1, j + 1).getA1Notation(), 'error': error.toString()};
        }
      }
    }

    return summaryReport;
  } catch (error) {
    const opsyMessage = 'Ops! Something went wrong';
    SpreadsheetApp.getActiveSpreadsheet().toast(opsyMessage, error.toString(), 15);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    // set the background color to yellow
    const range = sheet.getActiveRange();
    range.setBackground('#FFFF00');
    throw error;
  }
}

function getData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const range = sheet.getActiveRange();
  const values = range.getValues();
  return values;
}