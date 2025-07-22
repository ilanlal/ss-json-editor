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
}