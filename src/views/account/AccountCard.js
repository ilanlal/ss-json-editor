// Google Apps Script code for Google Workspace Add-ons
class AccountCard {
    /**
     * Creates a card for the account information.
     * @param {UserLicense} userLicense - The user license information.
     * @param {Global_Resources['en']} localization - The localization resources.
     * @returns {Card} - The card containing account information.
     */
    static create(userLicense, localization) {
        // Create a new card builder
        const card = CardService.newCardBuilder()
            // Set the card header with title and subtitle
            .setHeader(CardService.newCardHeader()
                .setTitle(localization.cards.account.title)
                .setSubtitle(localization.cards.account.subtitle))
            .addSection(CardService.newCardSection()
                .setHeader(localization.cards.account.subtitle)
                .addWidget(CardService.newTextParagraph()
                    .setText(localization.cards.account.license + ": "
                            + (userLicense?.isActive() ? "Active" : "Inactive"))));
        // Add a section for account description
        return card;
    }
}