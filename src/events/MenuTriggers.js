// Google Apps Script code for Google Workspace Add-ons
function onMenuFormatRange(e) {
    console.log("onMenuFormatRange called with event:", e);
    // Code to format the selected range
    const localization = AppManager.getLocalizationResources();
    try {
        const userStore = new UserStore();
        const jsonStudio = new JsonStudio(
            SpreadsheetApp
                .getActiveSpreadsheet(), localization, userStore);

        // format the range
        const rangeReport = jsonStudio.formatRange();
        const reportItems = rangeReport.getItems();
        // If there are results, toast the user with the number of failed cells
        if (reportItems?.length > 0) {
            // toast the user with the number of failed cells
            SpreadsheetApp
                .getActiveSpreadsheet()
                .toast(
                    localization.messages.totalCellFailed.replace('{0}', reportItems.length),
                    localization.messages.failure,
                    7);
        }
    } catch (error) {
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
        const userStore = new UserStore();
        const jsonStudio = new JsonStudio(
            SpreadsheetApp
                .getActiveSpreadsheet(), localization, userStore);

        // minify the range
        const rangeReport = jsonStudio.minifyRange();
        const reportItems = rangeReport.getItems();
        // If there are results, toast the user with the number of failed cells
        if (reportItems?.length > 0) {
            // toast the user with the number of failed cells
            SpreadsheetApp
                .getActiveSpreadsheet()
                .toast(
                    localization.messages.totalCellFailed.replace('{0}', reportItems.length),
                    localization.messages.failure,
                    15);
        }
    } catch (error) {
        SpreadsheetApp
            .getActiveSpreadsheet()
            .toast(
                error.toString(),
                localization.messages.error,
                7);
    }
    // Return nothing to indicate the operation is complete
    // This is important for the add-on to function correctly
    return;
}