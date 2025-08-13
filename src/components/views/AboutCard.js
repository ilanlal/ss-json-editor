// Google Apps Script code for Google Workspace Add-ons
class AboutCard {
  constructor() {
  }

  setLocalization(localization) {
    this.localization = localization;
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
    builder.setHeader(
      CardService.newCardHeader()
        .setTitle(this.localization.cards.about.title)
        .setSubtitle(this.localization.cards.about.subtitle)
        .setImageStyle(CardService.ImageStyle.SQUARE)
        .setImageUrl('https://raw.githubusercontent.com/ilanlal/ss-json-editor/refs/heads/main/assets/logo120.png')
        .setImageAltText(this.localization.appDescription));

    // Add a section with information about the add-on
    builder.addSection(CardService.newCardSection()
      .addWidget(CardService.newTextParagraph()
        .setText(this.localization.cards.about.content)));

    return builder;
  }
}