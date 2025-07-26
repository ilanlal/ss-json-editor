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

    // todo: create clickable Grid 
    // @see https://developers.google.com/apps-script/reference/card-service/grid
    const grid = CardService.newGrid()
      .setTitle(this.localization.cards.report.title)
      .setNumColumns(1);
    // Iterate over the report items and add them to the grid
    this.reportItems.forEach((item,i) => {
      const gridItem = CardService.newGridItem()
        .setTitle(item.a1Notation || '?')
        .setSubtitle(item.message || '-');

      grid.addItem(gridItem);
    });
    // Add the grid to the section
    section.addWidget(grid);
    // Add a button to close the report
    return section;
  }
}