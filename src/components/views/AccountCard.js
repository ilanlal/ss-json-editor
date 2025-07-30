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

        // Create a new card builder
        const cardBuilder = CardService.newCardBuilder()
            // Set the card header with title and subtitle
            .setHeader(AccountCard
                ._createHeader(localization, isPremium))
            .addSection(AccountCard
                ._createTopSection(localization, isPremium))
            .addSection(AccountCard
                ._createMembershipSection(localization, isPremium));

        return cardBuilder;
    }

    static _createHeader(localization, isPremium = false) {
        return CardService.newCardHeader()
            .setTitle(localization.cards.account.title)
            .setSubtitle(localization.cards.account.subtitle)
            .setImageStyle(CardService.ImageStyle.SQUARE)
            .setImageUrl('https://raw.githubusercontent.com/ilanlal/ss-json-editor/refs/heads/main/assets/logo120.png')
            .setImageAltText(localization.cards.account.imageAltText);
    }

    static _createTopSection(localization, isPremium = false) {
        return CardService.newCardSection()
            .setHeader(localization.cards.account.subtitle)
            .addWidget(CardService.newTextParagraph()
                .setText(localization.cards.account.license
                    .replace('{0}', isPremium ? 
                        Static_Resources.emojis.premium : 
                        Static_Resources.emojis.lock)));
    }

    static _createMembershipSection(localization, isPremium) {
        const section = CardService.newCardSection()
            .setHeader(localization.cards.account.subtitle);

        if (isPremium) {
            section.addWidget(CardService.newTextParagraph()
                .setText(localization.messages.premiumActivated))
                .addWidget(CardService.newTextButton()
                    .setText(localization.actions.revokeLicense)
                    .setOnClickAction(CardService.newAction()
                        .setFunctionName("onRevokeLicense")));
        } else {
            section.addWidget(CardService.newTextParagraph()
                .setText(localization.cards.account.activationInstructions))
                .addWidget(CardService.newTextButton()
                    .setText(localization.actions.activatePremium)
                    .setOnClickAction(CardService.newAction()
                        .setFunctionName("onActivatePremium")
                        .setParameters({
                            userId: 'me', planId: 'premium'
                        })));
        }

        return section;
    }
}