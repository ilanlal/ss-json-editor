class LoggerModel {
    static create(scriptProperties = PropertiesService.getScriptProperties(), activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()) {
        return new LoggerModel(scriptProperties, activeSpreadsheet);
    }

    constructor(scriptProperties, activeSpreadsheet) {
        this.debugMode = scriptProperties
            .getProperty(EnvironmentModel.InputMeta.DEBUG_MODE);
        this.archiveSize = parseInt(
            scriptProperties
                .getProperty(EnvironmentModel.InputMeta.LOG_ARCHIVE_SIZE), 10) || 1000;
        this.sheetModel = SheetModel.create(activeSpreadsheet);
        this.sheet = this.sheetModel.initializeSheet(EMD.Spreadsheet.Logger({}));
        // cause runtime error when archiveSize is invalid
        // this.archiveLog();
    }

    logEvent({ dc, action, chat_id, content, event }) {
        if (this.debugMode !== 'true' && this.debugMode !== 'all') {
            return;
        }
        const datestring = new Date().toISOString();
        this.sheet.appendRow([datestring, dc, action, chat_id, content, event]);
    }

    logError({ dc, action, chat_id, content, event }) {
        if (this.debugMode !== 'true' && this.debugMode !== 'all' && this.debugMode !== 'errors' && this.debugMode !== 'error') {
            return;
        }
        const datestring = new Date().toISOString();
        this.sheet.appendRow([datestring, dc, action, chat_id, content, event]);
    }

    archiveLog() {
        if (this.sheet.getLastRow() > this.archiveSize) {
            const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd_HHmmss');
            const archiveSheetName = `${EMD.Spreadsheet.Logger({}).name}_${timestamp}`;
            this.sheetModel.copySheet(this.sheet, archiveSheetName);
            this.sheet.clearContents();
            this.sheet.appendRow([EMD.Spreadsheet.Logger({}).columns]);
        }
    }

}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        LoggerModel
    };
}