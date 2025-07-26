// Apps Script code for Google Workspace Add-ons
// src/cards/Report.js
class ReportCard {
  /**
   * Constructor for the ReportCard class.
   * @param {[ReportItem]} reportItems - The report data.
   * @param {Global_Resources["en"]} localization - Localization resources.
   */
  constructor(reportItems, localization) {
    this.reportItems = reportItems;
    // Assuming AppManager is a global object that provides localization resources
    this.localization = localization || AppManager.getLocalizationResources();
  }

  /**
   * Create a card to display the report.
   * @returns {CardService.CardBuilder} - The card containing the report.
   * @throws {Error} - Throws an error if the report is empty or invalid.
   */
  createReportCard() {
    const builder = CardService.newCardBuilder();

    // Set the card header
    builder.setHeader(
      CardService.newCardHeader()
        .setTitle(this.localization.cards.report.title)
        .setSubtitle(this.localization.cards.report.content)
        .setImageStyle(CardService.ImageStyle.SQUARE)
        .setImageUrl('https://raw.githubusercontent.com/ilanlal/ss-json-editor/refs/heads/main/assets/logo120.png')
        .setImageAltText(this.localization.cards.report.imageAltText));

    // Create the report section
    const reportSection = this.createReportSection();
    builder.addSection(reportSection);

    return builder;
  }

  createReportSection() {
    const section = CardService.newCardSection()
      .setHeader(this.localization.cards.report.sectionHeader);
    // @see https://developers.google.com/apps-script/reference/card-service/grid

    // Iterate over the report items and add them to section
    this.reportItems.forEach((item, i) => {
      // create a text paragraph widget for each report item
      let itemWidget = CardService.newDecoratedText()
        .setText(`${item.a1Notation}: ${item.message}`)
        .setWrapText(true)
        .setTopLabel(`Item ${i + 1}`)
        .setBottomLabel(`${item.icon} ${item.status}`)
        .setButton(
          CardService.newTextButton()
            .setText(this.localization.cards.report.itemButton)
            .setOnClickAction(
              CardService.newAction()
                .setFunctionName('onReportItemClick')
                .setParameters({ a1Notation: item.a1Notation })));

      // Add the item widget to the section
      section.addWidget(itemWidget);
    });

    // Add a button to close the report
    return section;
  }
}