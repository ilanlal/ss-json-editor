class RangeService {
    constructor() {
    }

    static newRangeService(sheetName, a1Notation) {
        const range =
            ServiceBuilder
                .newSpreadsheetService()
                .getSheetByName(sheetName)
                .getRange(a1Notation);

        return new RangeService()
            .setActiveRange(range);
    }

    // Getters for the RangeService class properties
    getActiveRange() {
        return this.activeRange;
    }

    setActiveRange(range) {
        this.activeRange = range;
        return this;
    }

    getSheetName() {
        return this.getActiveRange().getSheet().getName();
    }

    getActiveSheet() {
        return this.getActiveRange().getSheet();
    }

    getValues() {
        return this.getActiveRange().getValues();
    }

    setValues(values) {
        this.getActiveRange().setValues(values);
    }

    getBackgroundColor() {
        return this.getActiveRange().getBackground();
    }

    setBackgroundColor(color) {
        return this.getActiveRange().setBackground(color);
    }

    // Methods of the RangeService class:
    focusRange() {
        return this.getActiveRange().activate();
    }

    alignLeft() {
        return this.getActiveRange()
            .setHorizontalAlignment("left");
    }
}
