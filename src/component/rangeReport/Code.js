// Apps Script code for Google Workspace Add-ons
// src/component/rangeReport/Code.gs

// This function is called when the user clicks on the "Open Sidebar" button in the add-on menu
function openReportCard(e) {
  // Only show the sidebar if the user is authorized to use the add-on
  if (e && e.authMode !== ScriptApp.AuthMode.NONE) {
    const file = 'component/rangeReport/Index';
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
    const card = createReportCard(e);
    
    // Create an action response to push the card to the navigation stack
    // This will replace the current card with the new card in the navigation stack
    const actionResponse = CardService.newActionResponseBuilder()
      .setNavigation(CardService.newNavigation().pushCard(card))
      .build();
    return actionResponse;
  } else {
    SpreadsheetApp.getUi().alert('This add-on can only be used in Google Sheets™️.');
  }
}

function createReportCard(e) {
  var builder = CardService.newCardBuilder();

  // Set the card header
  builder.setHeader(
    CardService.newCardHeader()
      .setTitle('Range Report')
      .setSubtitle('Generate a report for selected range')
      .setImageStyle(CardService.ImageStyle.SQUARE)
      .setImageUrl('https://raw.githubusercontent.com/ilanlal/ss-json-editor/refs/heads/main/assets/logo120.png')
      .setImageAltText('JSON Studio for Google Sheets™️'));

  // Add state section with buttons for generating and clearing the report
  builder.addSection(createStatesCardSection(e));


  // Add a section for the range report
  // This section includes a button to open the sidebar for generating a report
  //builder.addSection(createMoreOptionsCardSection(e));

  // Add the footer to the card
  // builder.setFixedFooter(createFixedFooter(e));
  return builder.build();
}

function createStatesCardSection(e) {
  // Create a card with formatting options
  return CardService.newCardSection()
    .setHeader('👁️ State')
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
      .setText('Select <b>range</b> of cells containing JSON data and use the buttons below to minify the JSON.'))
    .addWidget(CardService.newButtonSet()
      .addButton(CardService.newTextButton()
        .setText('{..} Minify')
        .setOnClickAction(CardService.newAction().setFunctionName('minifyRange'))
        .setDisabled(false)))
    .addWidget(CardService.newTextParagraph()
      .setText('Select <b>one</b> cell containing JSON data and use the button below to edit the JSON.'))
    .addWidget(CardService.newButtonSet()
      .addButton(CardService.newTextButton()
        .setText('✏️ Open Editor')
        .setOnClickAction(CardService.newAction().setFunctionName('openDialogEditor'))
        .setDisabled(false)));
}
