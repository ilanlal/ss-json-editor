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
 * The event handler triggered when the selection changes in the spreadsheet.
 * @param {Event} e The onSelectionChange event.
 * @see https://developers.google.com/apps-script/guides/triggers#onselectionchangee
 */
function onSelectionChange(e) {
  // Set background to red if a single empty cell is selected.
  const range = e.range;
  /*if (range.getNumRows() === 1 &&
    range.getNumColumns() === 1 &&
    range.getCell(1, 1).getValue() === '') {
    range.setBackground('red');
  }*/
}

/**
 * The event handler triggered when editing the spreadsheet.
 * @param {Event} e The onEdit event.
 * @see https://developers.google.com/apps-script/guides/triggers#onedite
 */
function onEdit(e) {
  // Set a comment on the edited cell to indicate when it was changed.
  const range = e.range;
  //range.setNote('Last modified: ' + new Date());
}

function openAboutCard(e) {
    // Create a card with information about the add-on
    var builder = CardService.newCardBuilder();

    // Set the card header
    builder.setHeader(
        CardService.newCardHeader()
            .setTitle('About JSON Studio')
            .setSubtitle('Best JSON tools for Google Sheets™️')
            .setImageStyle(CardService.ImageStyle.SQUARE)
            .setImageUrl('https://raw.githubusercontent.com/ilanlal/ss-json-editor/refs/heads/main/assets/logo120.png')
            .setImageAltText('JSON Studio for Google Sheets™️'));

    // Add a section with information about the add-on
    builder.addSection(CardService.newCardSection()
        .addWidget(CardService.newTextParagraph()
            .setText('This add-on provides various tools for working with JSON data in Google Sheets.')));

    return builder.build();
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