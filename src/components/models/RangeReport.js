// Google Apps Script code for Google Workspace Add-ons
class RangeReport {
    constructor() {
        // Array of ReportItem objects
        /** @type {ReportItem[]} */
        this.items = new Array();
        this.effectedCells = 0; // Number of cells affected by the report
        this.sheetName = null; // The sheet where the range is located
        this.range = null; // The range object
    }

    setSheetName(sheetName) {
        this.sheetName = sheetName;
        return this;
    }

    getSheetName() {
        return this.sheetName;
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
        return this;
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
        return this;
    }

    getEffectedCells() {
        return this.effectedCells;
    }

    setEffectedCells(count) {
        this.effectedCells = count;
        return this;
    }

    incrementEffectedCells() {
        this.effectedCells++;
        return this;
    }

    hasItems() {
        return this.items.length > 0;
    }

    static newRangeReport() {
        return new RangeReport();
    }
}