// AspSpreadsheet.gs
class AspSpreadsheetEventLog {
    static get EVENT_LOG_SHEET_NAME() {
        return "Event Logs";
    }

    static log({ action, title, detail }) {
        const sheet = AspSpreadsheetEventLog.getEventLogSheet_();
        const datestring = new Date().toISOString();
        sheet.appendRow([datestring, action, title, detail]);
    }

    static error({ action, title, detail }) {
        const sheet = AspSpreadsheetEventLog.getEventLogSheet_();
        const datestring = new Date().toISOString();
        sheet.appendRow([datestring, action, title, detail]);
    }

    static getEventLogSheet_() {
        const monthAsNumber = new Date().getMonth() + 1;
        return SpreadsheetApp
            .getActiveSpreadsheet()
            .getSheetByName(AspSpreadsheetEventLog.EVENT_LOG_SHEET_NAME + ' ' + monthAsNumber)
            ?? SpreadsheetApp
                .getActiveSpreadsheet()
                .insertSheet(AspSpreadsheetEventLog.EVENT_LOG_SHEET_NAME + ' ' + monthAsNumber, 0)
                .appendRow(['Created On', 'Action', 'Title', 'Details']);
    }
}
