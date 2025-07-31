// Google Apps Script code for Google Workspace Add-ons
class ReportCard {
  /**
   * Constructor for the ReportCard class.
   * @param {UserLicense} userLicense - The user license information.
   * @param {RangeReport} rangeReport - The report for the range.
   * @param {Global_Resources["en"]} localization - Localization resources.
   */
  constructor(userLicense, rangeReport, localization) {
    if (!rangeReport || !rangeReport.getA1Notation) {
      throw new Error("Invalid range provided. Must be a Google Sheets Range object.");
    }
    // Initialize the range report
    /** @type {RangeReport} */
    this.rangeReport = rangeReport;
    this.localization = localization || AppManager.getLocalizationResources();
    this.userLicense = userLicense;
    this.isPremium = userLicense?.isActive?.() || false;
  }

  static create(userLicense, rangeReport, localization) {
    const card = new ReportCard(userLicense, rangeReport, localization);
    return card.newCardBuilder();
  }

  /**
   * Create a card to display the report.
   * @returns {CardService.CardBuilder} - The card containing the report.
   * @throws {Error} - Throws an error if the report is empty or invalid.
   */
  newCardBuilder() {
    const builder = CardService.newCardBuilder()
      // Set the card name for identification
      .setName(Static_Resources.resources.homeCardName)
      // Set the card header
      .setHeader(this.getHeader())
      // Set the fixed footer
      .setFixedFooter(this.getFixedFooter());
      

    // Check if the user has a premium license
    if (!this.isPremium) {
      builder.addSection(this.getPremiumRequiredSection());
    }
    // If the range report has no items, show a message
    if (this.rangeReport.getItems().length === 0) {
      builder.addSection(this.getNoIssuesFoundSection());
    } else {
      // Add the report section
      builder.addSection(this.getReportSection());
    }

    return builder;
  }

  getHeader() {
    return CardService.newCardHeader()
      .setTitle(this.localization.cards.report.title)
      .setSubtitle(this.localization.cards.report.subtitle
        .replace('{0}', this.rangeReport.getItems().length.toString()))
      .setImageStyle(CardService.ImageStyle.SQUARE)
      .setImageUrl('https://raw.githubusercontent.com/ilanlal/ss-json-editor/refs/heads/main/assets/logo120.png')
      .setImageAltText(this.localization.cards.report.imageAltText);
  }

  getReportSection() {
    const section = CardService.newCardSection()
      .setCollapsible(true)
      .setNumUncollapsibleWidgets((4 * 2)-1) // 4 columns, 3 divider widgets;
    // @see https://developers.google.com/apps-script/reference/card-service/grid

    // Iterate over the report items and add them to section
    this.rangeReport.getItems()
      .forEach((item) => {
        // Create a text paragraph widget for each report item
        section
          .addWidget(
            this.getReportItemDecoratedTextWidget(item))
          // add divider for better readability
          .addWidget(CardService.newDivider());
      });
    // If there are no items, add a message indicating no issues found
    if (this.rangeReport.getItems().length === 0) {
      section.addWidget(CardService.newTextParagraph()
        .setText(this.localization.cards.report.noIssuesFound));
    }
    // Add a button to close the report
    return section;
  }

  getReportItemDecoratedTextWidget(item) {
    return CardService.newDecoratedText()
      .setText(`${item.a1Notation}`)
      .setWrapText(true)
      .setBottomLabel(`${Static_Resources.emojis.warning} ${item.message}`)
      .setButton(
        CardService.newTextButton()
          .setDisabled(!this.isPremium)
          .setText(`${!this.isPremium ? (Static_Resources.emojis.lock + ' ') : ''}${this.localization.actions.edit}`)
          .setOnClickAction(
            CardService.newAction()
              .setFunctionName('onReportItemClick')
              .setParameters({ a1Notation: item.a1Notation })));
  }

  getPremiumRequiredSection() {
    // Create a section to display the premium required message
    return CardService.newCardSection()
      .addWidget(CardService.newTextParagraph()
        .setText(this.getPremiumRequiredMessage()));
  }

  getNoIssuesFoundSection() {
    // Create a section to display the no issues found message
    return CardService.newCardSection()
      .addWidget(CardService.newTextParagraph()
        .setText(this.localization.cards.report.noIssuesFound));
  }

  getFixedFooter() {
    if (!this.isPremium) {
      // Create a fixed footer with a button to format the range
      return this.getPremiumRequiredFixedFooter();
    }
    
    const footer = CardService.newFixedFooter()
      /*.setPrimaryButton(
        CardService.newTextButton()
          .setText(this.localization.actions.reload)
          .setOnClickAction(
            CardService.newAction()
              .setFunctionName('onReportRefresh')))*/
      .setPrimaryButton(
        CardService.newTextButton()
          .setText(this.localization.actions.close)
          .setOnClickAction(
            CardService.newAction()
              .setFunctionName('onReportClose')));

    return footer;
  }

  getPremiumRequiredFixedFooter() {
    // Create a fixed footer with a button to activate premium
    return CardService.newFixedFooter()
      .setPrimaryButton(
        CardService.newTextButton()
          .setText(this.localization.actions.activatePremium)
          .setOnClickAction(
            CardService.newAction()
              .setFunctionName('onOpenAccountCard')));
  }

  getPremiumRequiredMessage() {
    // Return the message indicating that the feature requires a premium license
    return `${!this.isPremium ? (Static_Resources.emojis.lock + ' ' + this.localization.messages.premiumRequired) : ''}`;
  }
}