// src/lib/RangeReport.js
/**
 * Represents a report for a specific range in Google Sheets.
 * @param {GoogleAppsScript.Spreadsheet.Range} range - The range to report on
 */
class RangeReport {
    /**
     * Represents a report for a specific range in Google Sheets.
     * @param {GoogleAppsScript.Spreadsheet.Range} range - The range to report on
     */
    constructor(range) {
        // Google Sheets range object
        if (!range || !range.getA1Notation) {
            throw new Error("Invalid range object");
        }
        // Initialize the range property
        /** @type {GoogleAppsScript.Spreadsheet.Range} */
        this.range = range;
        
        // Array of ReportItem objects
        /** @type {ReportItem[]} */
        this.items = new Array();
    }

    setRange(range) {
        this.range = range;
    }

    /**
     * Add a new item to the report.
     * @param {string} a1Notation - A1 notation of the cell
     * @param {string} message - Error message, if any
     * @param {ReportItem.Status} status - Status of the report item
     */
    addItem(a1Notation, message, status = ReportItem.Status.VALID) {
        // Create a new ReportItem and add it to the items array
        const item = new ReportItem(a1Notation, message, status);
        this.items.push(item);
    }

    
    /**
     * Get the report as an array of ReportItem objects.
     * @returns {Object} - An object containing the range A1 notation and the array of ReportItem objects
     */
    getResults() {
        // Return the array of ReportItem objects
        return {
            range: this.range.getA1Notation(),
            items: this.items
        }
    }
}