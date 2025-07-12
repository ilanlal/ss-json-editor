// This function is called when the user clicks on the "Open Sidebar" button in the add-on menu
function openSidebar(e, file) {
  // Only show the sidebar if the user is authorized to use the add-on
  if (e && e.authMode !== ScriptApp.AuthMode.NONE) {
    const htmlOutput = HtmlService
      .createTemplateFromFile(file)
      .evaluate()
      .setTitle('JSON Studio')
      // Uncomment the following lines to set the width and height of the sidebar
      // .setWidth(300)
      // .setHeight(600)
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
    // Show the sidebar in Google Sheets
    // SpreadsheetApp.getUi().showSidebar(htmlOutput);

    // todo: open child card with the "htmlOutput" content (the sidebar is already opened)
    const card = CardService.newCardBuilder()
      .setName('Range Report')
      .addSection(CardService.newCardSection()
        .addWidget(CardService.newTextParagraph().setText(htmlOutput.getContent())))
      .build();
    const actionResponse = CardService.newActionResponseBuilder()
      .setNavigation(CardService.newNavigation().pushCard(card))
      .build();
    return actionResponse;
  } else {
    SpreadsheetApp.getUi().alert('This add-on can only be used in Google Sheets™️.');
  }
}