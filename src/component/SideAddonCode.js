// src/component/SideAddonCode.js

/**
 * Callback for rendering the main card.
 * @return {CardService.Card} The card to show the user.
 */
function onHomepage(e) {
    const DEFAULT_INPUT_TEXT = '';
    const DEFAULT_OUTPUT_TEXT = '';
    const DEFAULT_ORIGIN_LAN = ''; // Empty string means detect langauge
    const DEFAULT_DESTINATION_LAN = 'en' // English

    return createSelectionCard(e, DEFAULT_ORIGIN_LAN, DEFAULT_DESTINATION_LAN, DEFAULT_INPUT_TEXT, DEFAULT_OUTPUT_TEXT);
}

function createSelectionCard(e, originLanguage, destinationLanguage, inputText, outputText) {
    var builder = CardService.newCardBuilder();

    // "From" language selection & text input section
    var fromSection = CardService.newCardSection()
        .addWidget(CardService.newTextInput()
            .setFieldName('input')
            .setValue(inputText)
            .setTitle('Enter text...')
            .setMultiline(true));

    fromSection.addWidget(CardService.newButtonSet()
        .addButton(CardService.newTextButton()
            .setText('Get Selection')
            .setOnClickAction(CardService.newAction().setFunctionName('getSheetsSelection'))
            .setDisabled(false)));


    builder.addSection(fromSection);

    // "Translation" language selection & text input section
    builder.addSection(CardService.newCardSection()
        .addWidget(CardService.newTextInput()
            .setFieldName('output')
            .setValue(outputText)
            .setTitle('Translation...')
            .setMultiline(true)));

    //Buttons section
    builder.addSection(CardService.newCardSection()
        .addWidget(CardService.newButtonSet()
            .addButton(CardService.newTextButton()
                .setText('↹ Minify range')
                .setOnClickAction(CardService.newAction().setFunctionName('minifyRange'))
                .setDisabled(false))
            .addButton(CardService.newTextButton()
                .setText('👁️ Prettify')
                .setOnClickAction(CardService.newAction().setFunctionName('prettifyRange'))
                .setDisabled(false))
            .addButton(CardService.newTextButton()
                .setText('🚥 Verify selected range')
                .setOnClickAction(CardService.newAction().setFunctionName('openSidebarRangeReport'))
                .setDisabled(false))
            .addButton(CardService.newTextButton()
                .setText('✏️ Open selected cell in editor')
                .setOnClickAction(CardService.newAction().setFunctionName('openDialogEditor'))
                .setDisabled(false))
            .addButton(CardService.newTextButton()
                .setText('❔ Help')
                .setOnClickAction(CardService.newAction().setFunctionName('openDialogHelp'))
                .setDisabled(false))
            .addButton(CardService.newTextButton()
                .setText('Clear')
                .setOnClickAction(CardService.newAction().setFunctionName('clearText'))
                .setDisabled(true))));

    //onOpen(e);
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