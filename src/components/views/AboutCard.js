// Google Apps Script code for Google Workspace Add-ons
class AboutCard {
  constructor() {
  }

  setLocalization(localization) {
    this.localization = localization;
    return this;
  }

  setPackageInfo(packageInfo) {
    this.packageInfo = packageInfo;
    return this;
  }

  static newAboutCard() {
    return new AboutCard();
  }

  /**
   * @returns {CardService.CardBuilder}
   */
  newCardBuilder() {
    var builder = CardService.newCardBuilder();

    // Set the card header
    builder.setHeader(this.newHeader());

    // Add a section with information about the add-on
    builder.addSection(CardService.newCardSection()
      .addWidget(CardService.newTextParagraph()
        .setText(this.localization.cards.about.content)));

    // Add a section for package information
    if (this.packageInfo) {
      builder.addSection(this.newPackageInfoSection());
    }
    return builder;
  }

  newPackageInfoSection() {
    return CardService.newCardSection()
      .setHeader(this.localization.messages.packageInfo)
      .addWidget(CardService.newTextParagraph()
        .setText(`Version: ${this.packageInfo.version}`))
      .addWidget(CardService.newTextParagraph()
        .setText(`Build: ${this.packageInfo.build}`));
  }

  newHeader() {
    return CardService.newCardHeader()
      .setTitle(this.localization.cards.about.title)
      .setSubtitle(this.localization.cards.about.subtitle)
      .setImageStyle(CardService.ImageStyle.SQUARE)
      .setImageUrl('https://raw.githubusercontent.com/ilanlal/ss-json-editor/refs/heads/main/assets/logo120.png')
      .setImageAltText(this.localization.appDescription);
  }
}