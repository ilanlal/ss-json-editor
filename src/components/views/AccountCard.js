// Google Apps Script code for Google Workspace Add-ons
class AccountCard {
    constructor(userLicense, localization) {
        this.userLicense = userLicense;
        this.localization = localization;
        this.isPremium = userLicense?.isActive?.() || false;
        this.createdOn = userLicense?.createdOn || 'N/A';
        this.expiresOn = userLicense?.expiresOn || 'N/A';
    }

    /**
     * Creates a card for the account information.
     * @param {UserLicense} userLicense - The user license information.
     * @param {Global_Resources['en']} localization - The localization resources.
     * @returns {Card} - The card containing account information.
     */
    static create(userLicense, localization) {
        const thisCard = new AccountCard(userLicense, localization);
        // Create a new card builder
        return thisCard.newCardBuilder();
    }

    newCardBuilder() {
        // Create a new card builder
        const cardBuilder = CardService.newCardBuilder()
            // Set the card header with title and subtitle
            .setHeader(this.getHeader())
            .addSection(this.getTopSection())
            .addSection(this.getMembershipSection());

        return cardBuilder;
    }

    getHeader() {
        return CardService.newCardHeader()
            .setTitle(this.localization.cards.account.title)
            .setSubtitle(this.localization.cards.account.subtitle)
            .setImageStyle(CardService.ImageStyle.SQUARE)
            .setImageUrl('https://raw.githubusercontent.com/ilanlal/ss-json-editor/refs/heads/main/assets/logo120.png')
            .setImageAltText(this.localization.cards.account.imageAltText);
    }

    getTopSection() {
        return CardService.newCardSection()
            .setHeader(this.localization.cards.account.subtitle)
            .addWidget(CardService.newTextParagraph()
                .setText(this.localization.cards.account.license
                    .replace('{0}', this.isPremium ?
                        Static_Resources.emojis.premium :
                        Static_Resources.emojis.lock)));
    }

    getMembershipSection() {
        const section = CardService.newCardSection()
            .setHeader(this.localization.cards.account.subtitle);

        if (this.isPremium) {
            section.addWidget(CardService.newTextParagraph()
                .setText(this.localization.messages.premiumActivated))
                .addWidget(CardService.newTextButton()
                    .setText(this.localization.actions.revokeLicense)
                    .setOnClickAction(CardService.newAction()
                        .setFunctionName("onRevokeLicense")));
        } else {
            section.addWidget(CardService.newTextParagraph()
                .setText(this.localization.cards.account.activationInstructions))
                .addWidget(CardService.newTextButton()
                    .setText(this.localization.actions.activatePremium)
                    .setOnClickAction(CardService.newAction()
                        .setFunctionName("onActivatePremium")
                        .setParameters({
                            userId: 'me', planId: 'premium'
                        })));
        }

        return section;
    }
}