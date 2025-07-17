// Apps Script code for Google Workspace Add-ons
// src/Code.js

function minifyRange() {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getActiveSheet();
  const lastRow = sheet.getLastRow();
  const range = sheet.getActiveRange();
  const values = range.getValues();
  const newValues = values
    .map((row, i) => row
      .map((cell, j) => {
        // if range is out of last row, remove the cell from newValus 
        if (i > lastRow) {
          return;
        }
        try {
          return JSON.stringify(JSON.parse(cell));
        } catch (error) {
          return cell;
        }
      }));

  range.setValues(newValues);
}

function prettifyRange(nofIndentationSpaces = 2) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getActiveSheet();
  const lastRow = sheet.getLastRow();
  const range = sheet.getActiveRange();
  const values = range.getValues();
  let nofSpaces = nofIndentationSpaces; // Use the provided number of spaces for indentation
  if (typeof nofSpaces !== 'number' || nofSpaces <= 0) {
    nofSpaces = 2; // Default to 2 spaces if the input is invalid
  }
  const newValues = values
    .map((row, i) => row
      .map((cell, j) => {
        // if range is out of last row, remove the cell from newValus 
        if (i > lastRow) {
          return;
        }
        try {
          return JSON.stringify(JSON.parse(cell), null, nofSpaces);
        } catch (error) {
          return cell;
        }
      }));
  range.setValues(newValues);
}

/**
 * Gets the localization resources based on the user's locale.
 * This function retrieves the localization resources from the Global_Resources object.
 * 
 * @param {Event} e The event object containing the user's locale.
 */
function getLocalizationResources(e) {
  return Global_Resources.en;
}