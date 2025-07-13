// Apps Script code for Google Workspace Add-ons
// src/component/HomeCard.js

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
            .setTitle('JSON Studio')
            .setSubtitle('Best JSON tools for Google Sheets™️')
            .setImageStyle(CardService.ImageStyle.SQUARE)
            .setImageUrl('https://raw.githubusercontent.com/ilanlal/ss-json-editor/refs/heads/main/assets/logo120.png')
            .setImageAltText('JSON Studio for Google Sheets™️'));

    // Add formatting section with buttons for minifying and prettifying JSON
    builder.addSection(createFormattingCardSection(e));

    // Add a section for the range report
    // This section includes a button to open the sidebar for generating a report
    //builder.addSection(createMoreOptionsCardSection(e));

    // Add the footer to the card
    builder.setFixedFooter(createFixedFooter(e));
    return builder.build();
}

/**
 * Create a card section with formatting options.
 * This section includes buttons for prettifying, minifying, and editing JSON.
 * @param {*} e 
 * @returns {CardService.CardSection} The card section with formatting options.
 * @see {https://developers.google.com/workspace/add-ons/concepts/cards#card_sections
 */
function createFormattingCardSection(e) {
    // Create a card with formatting options
    return CardService.newCardSection()
        .setHeader('👁️ Formatting Options')
        //.setCollapsible(true)
        .addWidget(CardService.newTextParagraph()
            .setText('Select <b>range</b> of cells containing JSON data and use the buttons below to format (prettify) the JSON.'))
        .addWidget(CardService.newButtonSet()
            .addButton(CardService.newTextButton()
                .setText('↹ Prettify')
                .setOnClickAction(CardService.newAction().setFunctionName('prettifyRange'))
                .setDisabled(false)))
        .addWidget(CardService.newTextParagraph()
            //.setText('↹ Select a range of cells containing JSON data and use the buttons below to format the JSON.'))
            .setText('Use the buttons below to minify the JSON.'))
        .addWidget(CardService.newButtonSet()
            .addButton(CardService.newTextButton()
                .setText('{..} Minify')
                .setOnClickAction(CardService.newAction().setFunctionName('minifyRange'))
                .setDisabled(false)));
    /*.addWidget(CardService.newTextParagraph()
        .setText('Select <b>one</b> cell containing JSON data and use the button below to edit the JSON.'))
    .addWidget(CardService.newButtonSet()
        .addButton(CardService.newTextButton()
            .setText('✏️ Open Editor')
            .setOnClickAction(CardService.newAction().setFunctionName('openDialogEditor'))
            .setDisabled(false)));*/
}

function createMoreOptionsCardSection(e) {
    // Create a card with more options
    return CardService.newCardSection()
        .setHeader('🔍 More Options')
        .setCollapsible(true)
        .addWidget(CardService.newTextParagraph()
            .setText('Select a range of cells containing JSON data and use the button below to generate a report.'))
        .addWidget(CardService.newButtonSet()
            .addButton(CardService.newTextButton()
                .setText('Start Report')
                .setOnClickAction(CardService.newAction().setFunctionName('openReportCard'))
                .setDisabled(false)))
        .addWidget(CardService.newTextParagraph()
            .setText('This section can include more options in the future.'))
        .addWidget(CardService.newImage()
            .setImageUrl('https://raw.githubusercontent.com/ilanlal/ss-json-editor/refs/heads/main/assets/logo240.png')
            .setAltText('JSON Studio for Google Sheets™️'))
        .addWidget(CardService.newButtonSet()
            .addButton(CardService.newTextButton()
                .setText('Coming Soon')
                .setOnClickAction(CardService.newAction().setFunctionName('openDialogHelp'))
                .setDisabled(true)));
}

function createFixedFooter(e) {
    // Create a fixed footer with a button to open the help dialog
    return CardService.newFixedFooter()
        .setPrimaryButton(
            CardService.newTextButton()
                .setText('❔ Help')
                .setOnClickAction(CardService.newAction().setFunctionName('openDialogHelp')));
}