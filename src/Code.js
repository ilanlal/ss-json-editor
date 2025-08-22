// Google Apps Script code for Google Workspace Add-ons
/**
 * @see https://developers.google.com/apps-script/guides/triggers#oninstalle
 **/
function onInstall(e) {
    onOpen(e);
}

/** 
 * @see https://developers.google.com/apps-script/guides/triggers
 * @see https://docs.google.com/document/d/1v1wmNKzckcgCwe46gIytjaMdR04HaLLIwsj0idDNF-M/edit?tab=t.0
 */
function onOpen(e) {
    // This function is called when the add-on is opened
    // If an add-on only creates a basic menu, the mode doesn’t matter.
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
        const runner = new QUnitRunner(e);
        return runner.getHtml();
    } catch (error) {
        // Handle any errors that occur during the execution
        Logger.log("Error in doGet: " + error.message);
        // Return an error message to the user
        return HtmlService.createHtmlOutput("qUnit runner compilation error: " + error.toString());
    }
}