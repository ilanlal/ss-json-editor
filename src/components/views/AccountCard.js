// Google Apps Script code for Google Workspace Add-ons
class AccountCard {
    constructor() {
    }

    static newAccountCard() {
        return new AccountCard();
    }

    setUserLicense(userLicense) {
        this.userLicense = userLicense;
        this.isPremium = userLicense?.isActive?.() || false;
        this.createdOn = userLicense?.createdOn || 'N/A';
        this.expiresOn = userLicense?.expiresOn || 'N/A';

        return this;
    }

    setLocalization(localization) {
        this.localization = localization;
        return this;
    }

    /**
     * @returns {CardService.CardBuilder} - The card builder for the account card.
     */
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
            section
                .addWidget(
                    CardService.newTextParagraph()
                        .setText(this.localization.cards.account.activationInstructions))
                .addWidget(CardService.newTextParagraph()
                    .setText(this.localization.messages.claimPremium.replace('{0}', '90')))
                .addWidget(CardService.newTextButton()
                    .setText(this.localization.actions.activate)
                    .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
                    .setOnClickAction(CardService.newAction()
                        .setFunctionName("onActivatePremium")
                        .setParameters({
                            userId: 'me', planId: 'premium'
                        })));
        }

        return section;
    }
}