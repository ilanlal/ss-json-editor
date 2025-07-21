// Apps Script code for Google Workspace Add-ons
// src/cards/About.gs

function createAboutCard() {
  var builder = CardService.newCardBuilder();

  // Set the card header
  builder.setHeader(
    CardService.newCardHeader()
      .setTitle('About JSON Studio')
      .setSubtitle('Learn more about this add-on')
      .setImageStyle(CardService.ImageStyle.SQUARE)
      .setImageUrl('https://raw.githubusercontent.com/ilanlal/ss-json-editor/refs/heads/main/assets/logo120.png')
      .setImageAltText('JSON Studio for Google Sheets™️'));

  // Add a section with information about the add-on
  builder.addSection(CardService.newCardSection()
    .addWidget(CardService.newTextParagraph()
      .setText('<b>JSON Studio</b> is a powerful tool for working with JSON data in Google Sheets.')));
  
  // Add a footer with links to documentation and support
  builder.setFixedFooter(createFixedFooter());

  return builder.build();
}