class SheetModel {
    static INVALID_MODEL_ERROR() {
        return 'Sheet model must have a valid name property';
    }

    static create(activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()) {
        return new SheetModel(activeSpreadsheet);
    }

    constructor(activeSpreadsheet) {
        this._activeSpreadsheet = activeSpreadsheet;
        this._columns = [];
        this._sheetName = null;
        this._sheet = null;
    }

    initializeSheet(sheetMeta = {}) {
        if (!sheetMeta.name) {
            throw new Error(SheetModel.INVALID_MODEL_ERROR);
        }
        this._sheetName = sheetMeta.name;
        this._columns = sheetMeta.columns || [];
        let sheet = this._activeSpreadsheet.getSheetByName(this._sheetName);
        if (!sheet) {
            sheet = this._activeSpreadsheet.insertSheet(this._sheetName);

            if (this._columns.length > 0) {
                sheet.appendRow(this._columns);
            }
        }
        this._sheet = sheet;
        return sheet;
    }

    setActiveSheet(sheetMeta = {}) {
        return this._activeSpreadsheet
            .setActiveSheet(this.getSheet(sheetMeta));
    }

    getSheet(sheetMeta = {}) {
        return this._sheet = this.initializeSheet(sheetMeta);
    }

    bindSheetSampleData(sheetMeta = {}) {
        const sampleData = sheetMeta.sample_data || [];
        if (sampleData.length === 0) {
            return;
        }

        const sheet = this.getSheet(sheetMeta);
        const existingValues = sheet.getDataRange().getValues() || [];

        // merge existing values with sample data (existing values first)
        const mergedValues = existingValues.concat(sampleData);

        // set the merged values back to the sheet
        sheet.getRange(1, 1, mergedValues.length, mergedValues[0].length)
            .setValues(mergedValues);
            
        return sheet;
    }

    get columns() {
        return this._columns;
    }

    get sheet() {
        return this._sheet;
    }

    get activeSpreadsheet() {
        return this._activeSpreadsheet;
    }

    get sheetName() {
        return this._sheetName;
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SheetModel
    };
}