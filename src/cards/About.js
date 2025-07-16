// Apps Script code for Google Workspace Add-ons
// src/cards/About.gs

function openAboutCard(e) {
  // Only show the sidebar if the user is authorized to use the add-on
  if (e && e.authMode !== ScriptApp.AuthMode.NONE) {
    const card = createAboutCard(e);

    // Create an action response to push the card to the navigation stack
    const actionResponse = CardService.newActionResponseBuilder()
      .setNavigation(CardService.newNavigation().pushCard(card))
      .build();
    return actionResponse;
  } else {
    SpreadsheetApp.getUi().alert('This add-on can only be used in Google Sheets™️.');
  }
}

function createAboutCard(e) {
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
  builder.setFixedFooter(createFixedFooter(e));

  return builder.build();
}

function createFixedFooter(e) {
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