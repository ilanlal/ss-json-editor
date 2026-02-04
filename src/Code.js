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
    // return html content
    let htmlContent = '<h1>Json Studio</h1>';
    htmlContent += '<p>Welcome to Json Studio Google Workspace Add-on!</p>';
    htmlContent += '<p>This add-on helps you format and minify JSON data directly within your Google Sheets.</p>';
    if (typeof HtmlService !== 'undefined') {
        return HtmlService.createHtmlOutput(htmlContent);
    } else {
        return null;
    }
}

// Export the functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        onInstall,
        onOpen,
        doGet
    };
}