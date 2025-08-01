// Google Apps Script code for Google Workspace Add-ons
class AboutCard {
  constructor(localization) {
    this.localization = localization;
  }

  /**
   * @returns {CardService.CardBuilder}
   */
  static create(localization) {
    const aboutCard = new AboutCard(localization);
    return aboutCard.newCardBuilder();
  }

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