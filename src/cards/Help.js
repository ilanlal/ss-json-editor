// Apps Script code for Google Workspace Add-ons
// src/cards/Help.js

function openHelpCard(e) {
    // Only show the sidebar if the user is authorized to use the add-on
    if (e && e.authMode !== ScriptApp.AuthMode.NONE) {
        const card = createHelpCard(e);
        // Create an action response to push the card to the navigation stack
        const actionResponse = CardService.newActionResponseBuilder()
            .setNavigation(CardService.newNavigation().pushCard(card))
            .build();
        return actionResponse;
    } else {
        SpreadsheetApp.getUi().alert('This add-on can only be used in Google Sheets™️.');
    }
}

function createHelpCard(e) {
    var builder = CardService.newCardBuilder();

    // Set the card header
    builder.setHeader(
        CardService.newCardHeader()
            .setTitle('Help & Support')
            .setSubtitle('Get help with JSON Studio')
            .setImageStyle(CardService.ImageStyle.SQUARE)
            .setImageUrl('https://raw.githubusercontent.com/ilanlal/ss-json-editor/refs/heads/main/assets/logo120.png')
            .setImageAltText('JSON Studio for Google Sheets™️'));

    // Add a section with help information
    builder.addSection(CardService.newCardSection()
        .addWidget(CardService.newTextParagraph()
            .setText('<b>Need help?</b> Visit our <a href="https://www.easyadm.com/json-studio">documentation</a> or <a href="https://www.easyadm.com/contact">contact us</a> for support.')));
    // Add a footer with links to documentation and support
    builder.setFixedFooter(createHelpCardFixedFooter(e));
    return builder.build();
}

function createHelpCardFixedFooter(e) {
    return CardService.newFixedFooter()
        .setPrimaryButton(CardService.newTextButton()
            .setText('Documentation')
            .setOpenLink(CardService.newOpenLink()
                .setUrl('https://www.easyadm.com/json-studio')))
        .setSecondaryButton(CardService.newTextButton()
            .setText('Contact Support')
            .setOpenLink(CardService.newOpenLink()
                .setUrl('https://www.easyadm.com/contact')));
}