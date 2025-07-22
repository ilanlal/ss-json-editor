// Apps Script code for Google Workspace Add-ons
// src/SimpleTrigers.js
/**
 * Callback for the add-on install event.
 * This function is called when the add-on is installed.
 * It sets up the menu and initializes the user properties.
 * 
 * @see https://developers.google.com/apps-script/guides/triggers#oninstalle
 * @param {Event} e The event object.
 **/
function onInstall(e) {
    onOpen(e);
}

/** 
 * Callback for the add-on open event.
 * Runs when a user opens a spreadsheet, document, presentation, or form that the user has permission to edit.
 * 
 * @see https://developers.google.com/apps-script/guides/triggers
 */
function onOpen(e) {
    initializeAppMenu(e);
}

/**
 * Sets up the custom menu in the Google Sheets UI.
 * This function is called when the add-on is installed or opened.
 */
function initializeAppMenu(e) {
  const localization = getLocalizationResources(e);
  const ui = SpreadsheetApp.getUi();

  // The label for a menu item should be in sentence case (only the first word capitalized).
  // see https://developers.google.com/apps-script/reference/base/menu#detailed-documentation
  ui.createMenu(localization.menu.top)
    .addItem(localization.menu.format, 'onPrettifyRange')
    .addItem(localization.menu.minify, 'onMinifyRange')
    .addSeparator()
    .addItem(localization.menu.about, 'onShowAboutCard')
    .addToUi();
}