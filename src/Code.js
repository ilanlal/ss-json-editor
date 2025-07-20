// Apps Script code for Google Workspace Add-ons
// src/Code.js

function getLocalizationResources(e) {
  return Global_Resources.en;
}

function minifyRange() {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getActiveSheet();
  const lastRow = sheet.getLastRow();
  const range = sheet.getActiveRange();
  const values = range.getValues();

  // Check if the range exceeds the maximum allowed size (10,000 cells)
  // This is to prevent performance issues with large ranges
  if (range.getNumRows() * range.getNumColumns() > Static_Resources.limits.maxCellSize) {
    const localization = getLocalizationResources();
    SpreadsheetApp
      .getActiveSpreadsheet()
      .toast(
        localization.message.outOfRange,
        localization.message.error,
        15);
    return;
  }

  const newValues = values
    .map((row, i) => row
      .map((cell, j) => {
        // if range is out of last row, remove the cell from newValus 
        if (i > lastRow) {
          return;
        }
        cell = cell?.toString().replace(/[\n\r]/g, '').trim();
        // if cell is empty after cleaning, return empty string
        if (!cell || cell === '') {
          return '';
        }
        try {
          return JSON.stringify(JSON.parse(cell));
        } catch (error) {
          // If parsing fails, return the original cell value
          return cell;
        }
      }));

  range.setValues(newValues);
}

function prettifyRange() {
  const userStore = new UserStore();
  const identSpace = parseInt(userStore.getIdentSpaces()) || 2; // Default to 2 spaces
  const failNoteFlag = userStore.getFailNoteFlag(); // Get the fail note flag
  const showErrors = userStore.getShowErrorsFlag(); // Get the show errors flag
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getActiveSheet();
  const lastRow = sheet.getLastRow();
  const range = sheet.getActiveRange();
  const values = range.getValues();

  // Check if the range exceeds the maximum allowed size.
  // This is to prevent performance issues with large ranges
  if (range.getNumRows() * range.getNumColumns() > Static_Resources.limits.maxCellSize) {
    const localization = getLocalizationResources();
    SpreadsheetApp
      .getActiveSpreadsheet()
      .toast(
        localization.message.outOfRange,
        localization.message.error,
        15);
    return;
  }
  const newValues = values
    .map((row, i) => row
      .map((cell, j) => {
        // if range is out of last row, remove the cell from newValus 
        if (i > lastRow) {
          return;
        }
        try {
          // clean spaces /n and \r from the cell value
          cell = cell?.toString().replace(/[\n\r]/g, '').trim();
          // if cell is empty after cleaning, return empty string
          if (!cell || cell === '') {
            return ''; // Return empty string if cell is empty after cleaning
          }
          const res = JSON.stringify(JSON.parse(cell), null, identSpace);

          if (failNoteFlag) {
            // Clean existing notes before setting new ones
            range.getCell(i + 1, j + 1).clearNote();
          }

          return res;
        } catch (error) {
          const message = `Error parsing JSON in cell ${range.getCell(i + 1, j + 1).getA1Notation()}: ${error.message}`;
          if (failNoteFlag) {
            // If validation is enabled, throw an error
            range.getCell(i + 1, j + 1).setNote(message);
          }

          if (showErrors && i === lastRow - 1 && j === row.length - 1) {
            // Show error in a toast if showErrors is enabled
            const localization = getLocalizationResources();
            SpreadsheetApp
              .getActiveSpreadsheet()
              .toast(
                message,
                localization.message.error,
                15);
          }
          return cell;
        }
      }));
  range.setValues(newValues);
}