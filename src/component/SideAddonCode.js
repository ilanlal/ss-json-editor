// src/component/SideAddonCode.js

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
        onOpen(e);
        return createHomeCard(e);
    }
}

/**
 * Callback for rendering the home card.
 * @see {https://developers.google.com/workspace/add-ons/concepts/cards}
 * @return {CardService.Card} The card to show the user.
 */
function createHomeCard(e) {
    var builder = CardService.newCardBuilder();
    // Set the card header
    builder.setHeader(
        CardService.newCardHeader()
            .setTitle('Welcome to JSON Studio')
            .setSubtitle('Edit and validate JSON data in Google Sheets™️')
            .setImageStyle(CardService.ImageStyle.SQUARE)
            .setImageUrl('https://raw.githubusercontent.com/ilanlal/ss-json-editor/refs/heads/main/assets/logo120.png')
            .setImageAltText('JSON Studio for Google Sheets™️'));

    builder.addSection(CardService.newCardSection()
        .setHeader('Formatting Options')
        .addWidget(CardService.newButtonSet()
            .addButton(CardService.newTextButton()
                .setText('↹ Minify')
                .setOnClickAction(CardService.newAction().setFunctionName('minifyRange'))
                .setDisabled(false))
            .addButton(CardService.newTextButton()
                .setText('👁️ Prettify')
                .setOnClickAction(CardService.newAction().setFunctionName('prettifyRange'))
                .setDisabled(false))));

    builder.addSection(CardService.newCardSection()
        .setHeader('✏️ Editor')
        .addWidget(CardService.newButtonSet()
            .addButton(CardService.newTextButton()
                .setText('Open Editor')
                .setOnClickAction(CardService.newAction().setFunctionName('openDialogEditor'))
                .setDisabled(false))));

    builder.addSection(CardService.newCardSection()
        .setHeader('📊 Range')
        .setCollapsible(false)
        .addWidget(CardService.newButtonSet()
            .addButton(CardService.newTextButton()
                .setText('Range Report')
                .setOnClickAction(CardService.newAction().setFunctionName('openSidebarRangeReport'))
                .setDisabled(false))));
                
    const footer = CardService.newFixedFooter()
        .setSecondaryButton(
            CardService.newTextButton()
                .setText('🌐 Website')
                .setOpenLink(
                    CardService.newOpenLink().setUrl('https://www.easyadm.com'))
                .setDisabled(false))
        .setPrimaryButton(
            CardService.newTextButton()
                .setText('⛑️ Help')
                .setOnClickAction(CardService.newAction().setFunctionName('openDialogHelp'))
                .setDisabled(false));
    // Add the footer to the card
    builder.setFixedFooter(footer);
    return builder.build();

}

function getSheetsSelection() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const range = sheet.getActiveRange();
    const values = range.getValues();
    const inputText = values.map(row => row.join(' ')).join('\n');

    // Update the card with the selected text
    const card = createSelectionCard(null, '', '', inputText, '');
    return card;
}