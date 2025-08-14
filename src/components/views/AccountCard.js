// Google Apps Script code for Google Workspace Add-ons
class AccountCard {
    constructor() {
        this.FREE_ACTIVATION_DAYS = Static_Resources.parameters.freeActivationDays;
    }

    static newAccountCard() {
        return new AccountCard();
    }

    getUserInfo() {
        return this.userInfo;
    }

    setUserInfo(userInfo) {
        this.userInfo = userInfo;
        return this;
    }

    getUserLicense() {
        return this.getUserInfo()?.getUserLicense();
    }

    setLocalization(localization) {
        this.localization = localization;
        return this;
    }

    isPremium() {
        return this?.getUserInfo()?.getUserLicense()?.isActive?.() || false;
    }

    /**
     * @returns {CardService.CardBuilder} - The card builder for the account card.
     */
    newCardBuilder() {
        // Create a new card builder
        const cardBuilder = CardService.newCardBuilder()
            // Set the card header with title and subtitle
            .setHeader(this.newHeader())
            .addSection(this.newUserInfoSection())
            .addSection(this.newMembershipSection());

        return cardBuilder;
    }

    newHeader() {
        return CardService.newCardHeader()
            .setTitle(this.localization.cards.account.title)
            .setSubtitle(this.localization.cards.account.subtitle)
            .setImageStyle(CardService.ImageStyle.SQUARE)
            .setImageUrl('https://raw.githubusercontent.com/ilanlal/ss-json-editor/refs/heads/main/assets/logo120.png')
            .setImageAltText(this.localization.cards.account.imageAltText);
    }

    newUserInfoSection() {
        return CardService.newCardSection()
            //.setHeader(this.localization.cards.account.subtitle)
            .addWidget(CardService.newTextParagraph()
                .setText("No information available for this user."));
    }

    newMembershipSection() {
        const section = CardService.newCardSection();

        if (this.isPremium()) {
            section
                .addWidget(CardService.newTextParagraph()
                    .setText(this.localization.messages.premiumActivated))
                .addWidget(CardService.newTextParagraph()
                    .setText(new Date(this.getUserLicense()?.getCreatedOn()).toLocaleString()))
                .addWidget(CardService.newTextParagraph()
                    .setText(this.getUserLicense()?.getPlanId() || ''))
                .addWidget(CardService.newTextParagraph()
                    .setText(new Date(this.getUserLicense()?.getExpirationDate())?.toLocaleString() || ''))
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
                    .setText(this.localization.messages.claimPremium.replace('{0}', this.FREE_ACTIVATION_DAYS)))
                .addWidget(CardService.newTextButton()
                    .setText(this.localization.actions.activate)
                    .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
                    .setOnClickAction(CardService.newAction()
                        .setFunctionName("onActivatePremium")
                        .setParameters({
                            userId: 'me', planId: 'premium', days: this.FREE_ACTIVATION_DAYS.toString()
                        })));
        }

        return section;
    }
}