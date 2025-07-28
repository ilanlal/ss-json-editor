// Google Apps Script code for Google Workspace Add-ons
class SpreadsheetHelper {
    /**
     * Returns the optimal range for the current sheet.
     * This method is used to ensure that the range is not larger than the data range.
     * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet - The sheet to get the optimal range for.
     * @returns {GoogleAppsScript.Spreadsheet.Range} The optimal range for the current sheet.
     */
    static getOptimalRange(sheet) {
        // This method returns the optimal range for the current sheet
        const range = sheet.getActiveRange();
        const dataRange = sheet.getDataRange();
        const lastRow = dataRange.getLastRow();
        const lastColumn = dataRange.getLastColumn();
        const numColumns = Math.min(range.getNumColumns(), lastColumn);
        const numRows = Math.min(range.getNumRows(), lastRow);

        // shrink the range to the last row and last column
        return range.offset(0, 0, numRows, numColumns);
    }

    static focusCell(a1n) {
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
        const range = sheet.getRange(a1n);
        range.activateAsCurrentCell();
    }

    static focusRange(a1n) {
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
        const range = sheet.getRange(a1n);
        range.activate();
    }

    static highlightRange(a1n) {
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

    static saveValuToCell(a1n, value) {
        throw new Error("Not implemented");
    }
}