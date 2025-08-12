// Google Apps Script code for Google Workspace Add-ons
class RangeReport {
    constructor() {
        // Array of ReportItem objects
        /** @type {ReportItem[]} */
        this.items = new Array();
        this.effectedCells = 0; // Number of cells affected by the report
    }

    static create() {
        const report = new RangeReport();
        return report;
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
        return this.getRange()?.getA1Notation() || '';
    }

    getRange() {
        return this.range;
    }

    setRange(range) {
        this.range = range;
    }

    getEffectedCells() {
        return this.effectedCells;
    }

    setEffectedCells(count) {
        this.effectedCells = count;
    }

    incrementEffectedCells() {
        this.effectedCells++;
    }

    hasItems() {
        return this.items.length > 0;
    }
}