// Code.gs
function doSomething() {
  return "Hello World!";
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
  const htmlTemplate = HtmlService.createTemplateFromFile('html/home');
  const htmlOutput = htmlTemplate.evaluate()
    .setTitle('Hi there!')
    .setWidth(300);
  SpreadsheetApp.getUi().showSidebar(htmlOutput);
}

function onSelectionChange(e) {
  const ui = SpreadsheetApp.getUi();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const range = sheet.getActiveRange();
  const values = range.getValues();
}

// validate string in sheet cell's is a json formated string
function verifyCellJsonFormat(e) {
  var cell = e.cell;
  var parameter = e.parameter;
  var json = parameter[cell];
  try {
    json = JSON.parse(json);
  } catch (error) {
    json = null;
  }
  return json;
}

function getData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const range = sheet.getActiveRange();
  const values = range.getValues();
  return values;
}