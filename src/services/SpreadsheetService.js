class SpreadsheetService {
    constructor() {
        this.activeSheet = null;
    }

    setActiveSheet(sheet) {
        this.activeSheet = sheet;
        return this;
    }

    getActiveSheet() {
        return this.activeSheet;
    }

    static newSpreadsheetService(sheet) {
        if (!sheet) {
            throw new Error("No sheet provided");
        }

        return new SpreadsheetService().setActiveSheet(sheet);
    }

    getSheetByName(name) {
        return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
    }
}
