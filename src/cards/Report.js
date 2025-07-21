// Apps Script code for Google Workspace Add-ons
// src/cards/Report.g

function createReportCard() {
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
  builder.addSection(createStatesCardSection());


  // Add a section for the range report
  // This section includes a button to open the sidebar for generating a report
  //builder.addSection(createMoreOptionsCardSection());

  // Add the footer to the card
  // builder.setFixedFooter(createFixedFooter());
  return builder.build();
}

function createStatesCardSection() {
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
