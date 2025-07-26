// src/lib/ReportController.gs
/**
 * Class representing a report controller for a specific range in Google Sheets.
 * This class manages the report items for a given range and provides methods to add items and retrieve the report.
 * @param {GoogleAppsScript.Spreadsheet.Range} range - The range to report on
 */
class ReportController {
    /**
     * Represents a report for a specific range in Google Sheets.
     * @param {RangeReport} rangeReport - The report for the range.
     */
    constructor(rangeReport) {
        // Google Sheets range object
        if (!rangeReport || !rangeReport.getA1Notation) {
            throw new Error("Invalid range report object");
        }

        // A1 notation of the range
        /** @type {string} */
        this.a1Notation = rangeReport.getA1Notation();

        // Initialize the range report
        /** @type {RangeReport} */
        this.rangeReport = rangeReport;
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
        this.rangeReport.addItem(item);
    }

    /**
     * Get the report as an array of ReportItem objects.
     * @returns {RangeReport} - The range report containing all items.
     */
    getResults() {
        // Return the array of ReportItem objects
        return this.rangeReport;
    }
}