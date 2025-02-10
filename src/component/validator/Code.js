// Author: Ilan Laloum
// Description: This file contains the code for the validator component server side.
// This Server side code is written in Google Apps Script and is executed on Google servers.

// This function is called when the user clicks on the "Open Sidebar" button in the add-on menu
function openSidebar(e) {
  // Only show the sidebar if the user is an add-on
  if (e && e.authMode !== ScriptApp.AuthMode.NONE) {
    SpreadsheetApp.getUi().alert('Opening the sidebar');
  }

  const htmlOutput = HtmlService
    .createTemplateFromFile('component/validator/Page')
    .evaluate();
  SpreadsheetApp.getUi().showSidebar(htmlOutput);
}

// This function is called when the user clicks on the "Validate JSON" button in the sidebar
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

// This function is called when the user clicks on the "Validate JSON" button in the sidebar
function doValidationReport() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const range = sheet.getActiveRange();
    // check if the selected any cell is selected
    if (range.getNumRows() < 1 || range.getNumColumns() < 1) {
      SpreadsheetApp.getActiveSpreadsheet().toast('Please select a range', 'JSON Editor ‼️', 3);
      return;
    }

    const response = {
      range: {
        a1n: range.getA1Notation(),
        numRows: range.getNumRows(),
        numColumns: range.getNumColumns()
      },
      report: new Array(range.getNumRows()).fill(null).map(() => new Array(range.getNumColumns()).fill(null))
    };

    // for each cell in the selected range validate the JSON
    const values = range.getValues();
    for (let i = 0; i < values.length; i++) {
      for (let j = 0; j < values[i].length; j++) {
        try {
          JSON.parse(values[i][j]);
          response.report[i][j] = {
            'valid': true,
            'icon': '✅', 'range': range.getCell(i + 1, j + 1).getA1Notation(), 'message': 'Valid JSON', 'input': values[i][j]
          };
        } catch (error) {
          response.report[i][j] = {
            'valid': false,
            'icon': '❌', 'range': range.getCell(i + 1, j + 1).getA1Notation(), 'message': error.toString(), 'input': values[i][j]
          };
        }
      }
    }

    return response;
  } catch (error) {
    const opsyMessage = 'Ops! Something went wrong';
    SpreadsheetApp.getActiveSpreadsheet().toast(opsyMessage, error.toString(), 15);
    throw error;
  }
}

function focusCell(a1n) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const range = sheet.getRange(a1n);
  range.activate();
}

function highlightCell(a1n) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const range = sheet.getRange(a1n);
  // set the background color blink to yellow for 1 second
  range.setBackground('#FFFF00');
  // flush the changes
  SpreadsheetApp.flush();

  // sleep for 2 seconds
  Utilities.sleep(2000);
  range.setBackground(null);
}

function prettyPrintAllJsonOnServer() {
  // Get the active sheet
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  // Get the active range
  const range = sheet.getActiveRange();

  // check if the selected any cell is selected
  if (range.getNumRows() < 1 || range.getNumColumns() < 1) {
    SpreadsheetApp.getActiveSpreadsheet().toast('Please select a range', 'JSON Editor ‼️', 3);
    return;
  }

  const response = {
    range: {
      a1n: range.getA1Notation(),
      numRows: range.getNumRows(),
      numColumns: range.getNumColumns()
    },
    report: new Array(range.getNumRows()).fill(null).map(() => new Array(range.getNumColumns()).fill(null))
  };

  // for each cell in the selected range pretty print the JSON
  const values = range.getValues();
  for (let i = 0; i < values.length; i++) {
    for (let j = 0; j < values[i].length; j++) {
      try {
        // try to pretty print the JSON
        const value = JSON.stringify(JSON.parse(values[i][j]), null, 2);
        range.getCell(i + 1, j + 1).setValue(value);
        response.report[i][j] = {
          'valid': true,
          'icon': '✅', 'range': range.getCell(i + 1, j + 1).getA1Notation(), 'message': 'JSON pretty printed successfully', 'input': value
        };
      } catch (error) {
        response.report[i][j] = {
          'valid': false,
          'icon': '❌', 'range': range.getCell(i + 1, j + 1).getA1Notation(), 'message': error.toString(), 'input': values[i][j]
        };
      }
    }
  }

  return response;
}
function prettyPrintCell(a1n, text) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const range = sheet.getRange(a1n);
  const value = text || range.getValue();
  try {
    range.setValue(JSON.stringify(JSON.parse(value), null, 2));
    // return the pretty printed JSON string to the client
    const response = {
      valid: true,
      a1n: a1n,
      input: JSON.stringify(JSON.parse(value), null, 2),
      message: 'JSON pretty printed successfully'
    }

    return response;
  }
  catch (error) {
    SpreadsheetApp.getActiveSpreadsheet().toast('Invalid JSON ☠️☠️', error.toString(), 15);
    const response = {
      valid: false,
      a1n: a1n,
      input: value,
      message: error.toString()
    }

    return response;
  }
}

function minifyAllJsonOnServer() {
  // Get the active sheet
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  // Get the active range
  const range = sheet.getActiveRange();

  // check if the selected any cell is selected
  if (range.getNumRows() < 1 || range.getNumColumns() < 1) {
    SpreadsheetApp.getActiveSpreadsheet().toast('Please select a range', 'JSON Editor ‼️', 3);
    return;
  }

  const response = {
    range: {
      a1n: range.getA1Notation(),
      numRows: range.getNumRows(),
      numColumns: range.getNumColumns()
    },
    report: new Array(range.getNumRows()).fill(null).map(() => new Array(range.getNumColumns()).fill(null))
  };

  // for each cell in the selected range minify the JSON
  const values = range.getValues();
  for (let i = 0; i < values.length; i++) {
    for (let j = 0; j < values[i].length; j++) {
      try {
        // try to minify the JSON
        const value = JSON.stringify(JSON.parse(values[i][j]));
        range.getCell(i + 1, j + 1).setValue(value);
        response.report[i][j] = {
          'valid': true,
          'icon': '✅', 'range': range.getCell(i + 1, j + 1).getA1Notation(), 'message': 'JSON minified successfully', 'input': value
        };
      } catch (error) {
        response.report[i][j] = {
          'valid': false,
          'icon': '❌', 'range': range.getCell(i + 1, j + 1).getA1Notation(), 'message': error.toString(), 'input': values[i][j]
        };
      }
    }
  }

  return response;
}

function minifyCell(a1n, text) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const range = sheet.getRange(a1n);
    const value = text || range.getValue();
    range.setValue(JSON.stringify(JSON.parse(value)));
    const response = {
      valid: true,
      a1n: a1n,
      input: JSON.stringify(JSON.parse(value)),
      message: 'JSON minified successfully'
    }

    return response;
  }
  catch (error) {
    SpreadsheetApp.getActiveSpreadsheet().toast('Invalid JSON ☠️☠️', error.toString(), 15);
    const response = {
      valid: false,
      a1n: a1n,
      input: value,
      message: error.toString()
    }

    return response;
  }
}

function saveCell(a1n, value) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const range = sheet.getRange(a1n);
    range.setValue(value);
  }
  catch (error) {
    SpreadsheetApp.getActiveSpreadsheet().toast('Error while saving the cell value', error.toString(), 15);
    throw error;
  }
}