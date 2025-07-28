// Google Apps Script code for Google Workspace Add-ons
class AccountCard {
    /**
     * Creates a card for the account information.
     * @param {UserLicense} userLicense - The user license information.
     * @param {Global_Resources['en']} localization - The localization resources.
     * @returns {Card} - The card containing account information.
     */
    static create(userLicense, localization) {
        const isPremium = userLicense?.isActive?.() || false;
        const createdOn = userLicense?.createdOn || 'N/A';
        const utcExpirationDate = userLicense?.utcExpirationDate || 'N/A';
        const amount = userLicense?.amount || 0;
        const premiumIcon = isPremium ? (localization.actions.premiumIcon + ' ') : '';

        // Create a new card builder
        const card = CardService.newCardBuilder()
            // Set the card header with title and subtitle
            .setHeader(CardService.newCardHeader()
                .setTitle(localization.cards.account.title)
                .setSubtitle(localization.cards.account.subtitle))
            .addSection(CardService.newCardSection()
                .setHeader(localization.cards.account.subtitle)
                .addWidget(CardService.newTextParagraph()
                    .setText(localization.cards.account.license
                        .replace('{0}', isPremium ? premiumIcon : 'N/A'))));
        // if the user license is active, add additional information
        if (isPremium) {
            // Add a section for account description
            card.addSection(CardService.newCardSection()
                .addWidget(CardService.newTextParagraph()
                    .setText(localization.messages.premiumActivated))
                .addWidget(CardService.newTextButton()
                    .setText(localization.actions.revokeLicense)
                    .setOnClickAction(CardService.newAction()
                        .setFunctionName("onRevokeLicense"))));
        }
        else {
            // Add a section for account activation instructions with activate button
            card.addSection(CardService.newCardSection()
                .addWidget(CardService.newTextParagraph()
                    .setText(localization.cards.account.activationInstructions))
                .addWidget(CardService.newTextButton()
                    .setText(localization.actions.activatePremium)
                    .setOnClickAction(CardService.newAction()
                        .setFunctionName("onActivatePremium")
                        .setParameters({ userId: 'me', planId: 'premium' }))));
        }
        return card;
    }
}