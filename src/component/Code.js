// src/component/Code.gs
/**
 * Callback for rendering the main card.
 * @return {CardService.Card} The card to show the user.
 */
function onHomepage(e) {
    // If the user is not an add-on, show an alert
    if (e && e.authMode === ScriptApp.AuthMode.NONE) {
        SpreadsheetApp.getUi().alert('This add-on can only be used in Google Sheets™️.');
        return;
    }
    else {
        // Initialize the menu
        // Return the home card

        return createHomeCard(e);
        //return createNavigationCard(e);
    }
}

// https://developers.google.com/apps-script/guides/triggers
function onOpen(e) {
    // If the add-on is installed, the menu will be set automatically.
    // If the add-on is not installed, the menu will not be set.
    if (e && e.authMode !== ScriptApp.AuthMode.NONE) {
        setupMenu(e);
    } else {
        SpreadsheetApp.getUi().alert('This add-on can only be used in Google Sheets™️.');
    }
}

/**
 * Callback for the add-on install event.
 * This function is called when the add-on is installed.
 * It sets up the menu and initializes the user properties.
 **/
function onInstall(e) {
    // Set a value in the property store.   
    const userProperties = PropertiesService.getUserProperties();
    userProperties.setProperty('sidebarOpen', 'false');
    setupMenu(e);
}

/** 
 * Callback for adding the sidebar menu.
 * @param {Object} e The event object.
 */
function addSidebarMenu(e) {
    // todo: add "About" item and "Settings" item to the menu

}

function setupMenu(e) {
    // If the add-on is installed, the menu will be set automatically.
    // If the add-on is not installed, the menu will not be set.
    if (e && e.authMode !== ScriptApp.AuthMode.NONE) {
        const ui = SpreadsheetApp.getUi();

        // The label for a menu item should be in sentence case (only the first word capitalized).
        // see https://developers.google.com/apps-script/reference/base/menu#detailed-documentation
        ui.createMenu('Json')
            .addItem("✏️ Edit", 'openDialogEditor')
            .addItem('💫 Range', 'openSidebarRangeReport')
            .addSeparator()
            .addSubMenu(SpreadsheetApp.getUi().createMenu('{👁️} Format')
                .addItem('Minify', 'minifyRange')
                .addItem('Prettify', 'prettifyRange'))
            //.addSeparator()
            //.addItem('⚙️ Setting', 'openDialogSetting')
            .addSeparator()
            .addItem('❔ Help', 'openDialogHelp')
            .addToUi();
    } else {
        SpreadsheetApp.getUi().alert('This add-on can only be used in Google Sheets™️.');
    }
}