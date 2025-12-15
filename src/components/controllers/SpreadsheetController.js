class SpreadsheetController {
    static create(
        activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet(),
        documentProperties = PropertiesService.getDocumentProperties()
    ) {
        return new SpreadsheetController(activeSpreadsheet, documentProperties);
    }

    constructor(activeSpreadsheet, documentProperties) {
        this.activeSpreadsheet = activeSpreadsheet;
        this.documentProperties = documentProperties;
    }

    activateSheet(sheetMeta = {}) {
        const sheetModel = SheetModel.create(this.activeSpreadsheet);
        return sheetModel.setActiveSheet(sheetMeta);
    }
    
    bindSheetSampleData(sheetMeta = {}) {
        const sheetModel = SheetModel.create(this.activeSpreadsheet);
        return sheetModel.bindSheetSampleData(sheetMeta);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SpreadsheetController
    };
}