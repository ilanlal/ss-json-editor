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
    // Set a value in the property store.   
    const userProperties = PropertiesService.getUserProperties();
    userProperties.setProperty('localization', "en"); // Default to English
    createAppMenu(e);
}

/** 
 * Callback for the add-on open event.
 * Runs when a user opens a spreadsheet, document, presentation, or form that the user has permission to edit.
 * 
 * @see https://developers.google.com/apps-script/guides/triggers
 */
function onOpen(e) {
    createAppMenu(e);
}