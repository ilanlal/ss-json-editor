// Google Apps Script code for Google Workspace Add-ons
function onMenuFormatRange(e) {
    console.log("onMenuFormatRange called with event:", e);
    // Code to format the selected range
    const localization = AppManager.getLocalizationResources();
    try {
        const rangeReport = ServiceBuilder.newJsonStudio()
            .prettifyRange(SpreadsheetApp
                .getActiveSpreadsheet()
                .getActiveRange());

        const reportItems = rangeReport.getItems();
        // If there are results, toast the user with the number of failed cells
        if (reportItems?.length > 0) {
            // toast the user with the number of failed cells
            SpreadsheetApp
                .getActiveSpreadsheet()
                .toast(
                    JSON.stringify(reportItems, null, 2),
                    localization.messages.totalCellFailed.replace('{0}', reportItems.length),
                    7);
        }
    } catch (error) {
        console.log("Error in onMenuFormatRange:", error);
        SpreadsheetApp
            .getActiveSpreadsheet()
            .toast(
                error.toString(),
                localization.messages.error,
                15);
    }
    // Return nothing to indicate the operation is complete
    // This is important for the add-on to function correctly
    return;
}

function onMenuMinifyRange(e) {
    console.log("onMenuMinifyRange called with event:", e);
    // This function is called when the user selects "Minify" from the add-on menu
    const localization = AppManager.getLocalizationResources();
    try {
        const rangeReport = ServiceBuilder.newJsonStudio()
            .minifyRange(SpreadsheetApp
                .getActiveSpreadsheet()
                .getActiveRange());

        const reportItems = rangeReport.getItems();
        // If there are results, toast the user with the number of failed cells
        if (reportItems?.length > 0) {
            // toast the user with the number of failed cells
            SpreadsheetApp
                .getActiveSpreadsheet()
                .toast(
                    JSON.stringify(reportItems, null, 2),
                    localization.messages.totalCellFailed.replace('{0}', reportItems.length),
                    7);
        }
    } catch (error) {
        console.log("Error in onMenuMinifyRange:", error);
        SpreadsheetApp
            .getActiveSpreadsheet()
            .toast(
                error.toString(),
                localization.messages.error,
                15);
    }
    // Return nothing to indicate the operation is complete
    // This is important for the add-on to function correctly
    return;
}