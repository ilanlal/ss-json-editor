// Google Apps Script code for Google Workspace Add-ons
/**
 * @see https://developers.google.com/apps-script/guides/triggers#oninstalle
 **/
function onInstall(e) {
    console.log("onInstall called with event:", JSON.stringify(e));
    onOpen(e);
}

/** 
 * @see https://developers.google.com/apps-script/guides/triggers
 * @see https://docs.google.com/document/d/1v1wmNKzckcgCwe46gIytjaMdR04HaLLIwsj0idDNF-M/edit?tab=t.0
 */
function onOpen(e) {
    console.log("Menu created. Current auth mode:", e && e.authMode.toString());
    SpreadsheetApp
        .getUi()
        .createAddonMenu()
        .addItem('Format', 'onMenuFormatRange')
        .addItem('Minify', 'onMenuMinifyRange')
        .addToUi();
}

/**
 * @see https://developers.google.com/apps-script/guides/web
 */
function doGet(e) {
    console.log("doGet called with event:", e);
    try {
        // Call the QUnit runner to execute tests
        const runner = new QUnitRunner(e);
        return runner.getHtml();
    } catch (error) {
        console.error("Error in doGet:", error);
        // Return an error message to the user
        return HtmlService.createHtmlOutput("qUnit runner compilation error: " + error.toString());
    }
}