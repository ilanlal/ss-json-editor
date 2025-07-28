// Google Apps Script code for Google Workspace Add-ons
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