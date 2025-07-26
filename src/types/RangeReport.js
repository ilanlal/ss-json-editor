// src/types/RangeReport.js
/**
 * Represents a report for a specific range in Google Sheets.
 */
class RangeReport {
    /**
     * Represents a report for a specific range in Google Sheets.
     * @param {string} a1Notation - A1 notation of the range
     * @param {GoogleAppsScript.Spreadsheet.Range} range - The range to report on
     */
    constructor(a1Notation) {
        // a1 notation of the range
        /** @type {string} */
        this.a1Notation = a1Notation;
        // Array of ReportItem objects
        /** @type {ReportItem[]} */
        this.items = new Array();
    }

    /**
     * Add an item to the report.
     * @param {ReportItem} item - The report item to add.
     */
    addItem(item) {
        // Create a new ReportItem and add it to the items array
        if (!(item instanceof ReportItem)) {
            throw new Error("Item must be an instance of ReportItem");
        }
        this.items.push(item);
    }

    getItems() {
        return this.items;
    }

    getA1Notation() {
        return this.a1Notation;
    }
}