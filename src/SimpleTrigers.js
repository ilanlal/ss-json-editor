// Apps Script code for Google Workspace Add-ons
// src/SimpleTrigers.js
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
    SpreadsheetApp
        .getUi()
        .createAddonMenu()
        .addItem('Format', 'onFormatRange')
        .addItem('Minify', 'onMinifyRange')
        .addToUi();

}