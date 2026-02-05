// Google Apps Script code for Google Workspace Add-ons
function onMenuFormatRange(e) {
    // Code to format the selected range
    const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    try {
        const result = Addon.Modules.JsonStudio.beautifyActiveRange(activeSpreadsheet, 2);
        // If there are results, toast the user with the number of failed cells
        if (result.report?.length > 0) {
            // toast the user with the number of failed cells
            SpreadsheetApp
                .getActiveSpreadsheet()
                .toast(                    
                    `Some cells could not be formatted. Total failed cells: ${result.report.length}`,
                    '⚠️ Warning!',
                    15);
        }
    } catch (error) {
        SpreadsheetApp
            .getActiveSpreadsheet()
            .toast(
                error.toString(),
                '⚠️ Error',
                15);
    }
    // Return nothing to indicate the operation is complete
    // This is important for the add-on to function correctly
    return;
}

function onMenuMinifyRange(e) {
    // This function is called when the user selects "Minify" from the add-on menu
    const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    try {
        const result = Addon.Modules.JsonStudio.minifyActiveRange(activeSpreadsheet);
        const reportItems = result.report;
        // If there are results, toast the user with the number of failed cells
        if (reportItems?.length > 0) {
            // toast the user with the number of failed cells
            SpreadsheetApp
                .getActiveSpreadsheet()
                .toast(
                    `Some cells could not be formatted. Total failed cells: ${result.report.length}`,
                    '⚠️ Warning!',
                    15);
        }
    } catch (error) {
        SpreadsheetApp
            .getActiveSpreadsheet()
            .toast(
                error.toString(),
                '⚠️ Error',
                15);
    }
    // Return nothing to indicate the operation is complete
    // This is important for the add-on to function correctly
    return;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        onMenuFormatRange,
        onMenuMinifyRange
    };
}