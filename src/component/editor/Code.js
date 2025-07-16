// Apps Script code for Google Workspace Add-ons
// src/component/Code.js
// src/component/Code.gs

function highlightActiveRange(e) {
  // Only show the sidebar if the user is an add-on
  if (e && e.authMode !== ScriptApp.AuthMode.NONE) {

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const range = sheet.getDataRange();

    const orgColor = range.getBackgrounds();
    const newColor = orgColor.map(row => row.map(cell => cell === '#ffff00' ? '#ffffff' : '#ffff00'));
    range.setBackgrounds(newColor);

    // Sleep for 2 second
    Utilities.sleep(2000);

    // Reset the background color
    range.setBackgrounds(orgColor);
  }
}

function doValidationReport({ pageSize = 3, offset = 0, a1n, formatPattern }) {
  try {
    // get active sheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const dataRange = sheet.getDataRange();
    const lastRow = dataRange.getLastRow();
    const lastColumn = dataRange.getLastColumn();

    // get the selected range by a1NotationRange or the active range
    const range = a1n ? sheet.getRange(a1n) : sheet.getActiveRange();
    // shrink the range to the last row and last column if the range is out of the last row
    range.offset(0, 0, Math.min(range.getNumRows(), lastRow), Math.min(range.getNumColumns(), lastColumn));

    // check if the selected range is 1 cell or more
    if (range.getNumRows() < 1 || range.getNumColumns() < 1) {
      SpreadsheetApp.getActiveSpreadsheet().toast('Please select a range', 'JSON Editor ‼️', 3);
      return;
    }
    const startRow = range.getRow();
    const rows = [];
    for (let i = 0; i < range.getNumRows() && i < 25; i++) {
      rows.push(startRow + i);
    }

    pageSize = Math.min(range.getNumRows() - offset, pageSize);
    const customeRange = range.offset(Math.min(offset, range.getNumRows() - 1), 0, pageSize);
    const customeA1NRange = customeRange.getA1Notation();
    const startCustomeRow = customeRange.getRow();
    const customeRows = [];
    for (let i = 0; i < customeRange.getNumRows(); i++) {
      customeRows.push(startCustomeRow + i);
    }
    // first column letter of the selected range
    const firstCol = customeRange.getA1Notation().split(':')[0].replace(/\d/g, '');
    // array of columns, input range as "C8:E12" will return ["C", "D", "E"]
    const columns = [];
    for (let i = 0; i < customeRange.getNumColumns(); i++) {
      columns.push(String.fromCharCode(firstCol.charCodeAt(0) + i));
    }

    // get the values of the selected range
    const values = customeRange.getValues();
    // check if there are more rows to display
    const hasMoreRows = range.getNumRows() > (pageSize + offset);
    const response = {
      range: {
        a1n: range.getA1Notation(),
        numRows: range.getNumRows(),
        numColumns: range.getNumColumns(),
        columns: columns,
        rows: rows,
      },
      page: {
        columns: columns,
        rows: customeRows,
        pageSize: pageSize,
        offset: offset,
        a1n: customeA1NRange,
        pageNumber: Math.floor(offset / pageSize) + 1,
        numPages: Math.ceil(range.getNumRows() / pageSize),
        hasMoreRows: hasMoreRows
      },
      nextOffset: hasMoreRows ? Math.min(offset + pageSize, lastRow) : null,
      // allocate a 2D array to store the validation report
      report: new Array(values.length).fill(null).map(() => new Array(values[0].length).fill(null))
    };

    // for each row and column in the custome range, validate the JSON
    for (let i = 0; i < values.length; i++) {
      for (let j = 0; j < values[i].length; j++) {
        try {
          JSON.parse(values[i][j]);
          if (formatPattern === 'pretty') {
            // try to pretty print the JSON
            const value = JSON.stringify(JSON.parse(values[i][j]), null, 2);
            range.getCell(i + 1, j + 1).setValue(value);
          } else if (formatPattern === 'minify') {
            // try to minify the JSON
            const value = JSON.stringify(JSON.parse(values[i][j]));
            range.getCell(i + 1, j + 1).setValue(value);
          }

          response.report[i][j] = {
            'isValid': true,
            'icon': '✓',
            'range': range.getCell(i + 1 + offset, j + 1).getA1Notation(),
            'input': values[i][j],
            'message': 'Valid JSON'
          };
        } catch (error) {
          response.report[i][j] = {
            'isValid': false,
            'icon': '⊗',
            'range': range.getCell(i + 1 + offset, j + 1).getA1Notation(),
            'message': error.toString(),
            'input': values[i][j]
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

function fetchSelectedRange() {
  // get active sheet
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const range = sheet.getActiveRange();
  const dataRange = sheet.getDataRange();
  const lastRow = dataRange.getLastRow();
  const lastColumn = dataRange.getLastColumn();
  const numColumns = Math.min(range.getNumColumns(), lastColumn);
  const numRows = Math.min(range.getNumRows(), lastRow);

  // shrink the range to the last row and last column
  const newRange = range.offset(0, 0, numRows, numColumns);

  const a1n = newRange.getA1Notation();

  const columns = [];
  for (let i = 0; i < numColumns; i++) {
    columns.push(String.fromCharCode(a1n.split(':')[0].replace(/\d/g, '').charCodeAt(0) + i));
  }

  return {
    range: {
      a1n: a1n,
      numRows: numRows,
      numColumns: numColumns,
      columns: columns
    }
  };
}

function focusCell(a1n) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const range = sheet.getRange(a1n);
  range.activateAsCurrentCell();
}

function focusRange(a1n) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const range = sheet.getRange(a1n);
  range.activate();
}

function highlightCell(a1n) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const range = sheet.getRange(a1n);
  range.activateAsCurrentCell();
  const orgColor = range.getBackground();
  for (let i = 0; i < 3; i++) {
    // set the background color blink to yellow for 1 second
    range.setBackground('#FFFF00');
    // flush the changes
    SpreadsheetApp.flush();
    // sleep for 1 seconds
    Utilities.sleep(300);
    range.setBackground(orgColor);
    SpreadsheetApp.flush();
    Utilities.sleep(400);
  }
}

function prettyPrintCell({ a1n, text }) {
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
  const localization = getLocalizationResources();

  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const range = sheet.getRange(a1n);
    range.setValue(value);
    return {
      a1n: a1n,
      input: value,
      message: localization.message.success,
    };
  }
  catch (error) {
    SpreadsheetApp.getActiveSpreadsheet().toast(
      localization.message.error, error.toString(), 15);
    throw error;
  }
}
