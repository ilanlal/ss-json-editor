// Apps Script code for Google Workspace Add-ons
// src/cards/Help.js

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
    builder.setFixedFooter(createFixedFooter(e));
    return builder.build();
}