// Google Apps Script code for Google Workspace Add-ons
/**
 * @see https://developers.google.com/apps-script/guides/triggers#oninstalle
 **/
function onInstall(e) {
    onOpen(e);
}

/** 
 * @see https://developers.google.com/apps-script/guides/triggers
 */
function onOpen(e) {
    // This function is called when the add-on is opened
    if (e && e.authMode !== ScriptApp.AuthMode.NONE) {
        SpreadsheetApp
            .getUi()
            .createAddonMenu()
            .addItem('Format', 'onMenuFormatRange')
            .addItem('Minify', 'onMenuMinifyRange')
            .addToUi();
    }
}

/**
 * @see https://developers.google.com/apps-script/guides/web
 */
function doGet(e) {
    try {
        // Call the QUnit runner to execute tests
        return doGetQUnit(e);
    } catch (error) {
        Logger.log("Error in doGet: " + error);
        return HtmlService.createHtmlOutput("Error: " + error.message);
    }
}