// Google Apps Script code for Google Workspace Add-ons
class AppManager {
    /**
     * Initializes the AppManager with the provided context.
     * 
     * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet - The active sheet context.
     * 
     * @returns {Global_Resources['en']} - The localization resources
     */
    static getLocalizationResources(sheet = SpreadsheetApp.getActiveSpreadsheet()) {
        return Global_Resources["en"];
    }
}