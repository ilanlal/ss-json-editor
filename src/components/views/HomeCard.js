// Apps Script code for Google Workspace Add-ons
class HomeCard {
    /**
     * Constructor for the HomeCard class.
     * @param {boolean} isPremium - Indicates if the user has a premium license.
     * @param {number} indentationSpaces - The number of spaces to use for indentation.
     * @param {Global_Resources["en"]} localization - The localization object for the card.
     */
    constructor(userLicense, indentationSpaces, localization) {
        this.userLicense = userLicense;
        this.isPremium = userLicense?.isActive?.() || false;
        // Set the indentation level based on the provided spaces
        this.indentationLevel = indentationSpaces;
        this.localization = localization;
    }

    static create(userLicense, localization, indentationSpaces = 2) {
        const thisCard = new HomeCard(
            userLicense,
            indentationSpaces,
            localization
        );
        // Build the card using the builder pattern
        return thisCard.newCardBuilder();
    }

    newCardBuilder() {
        // Create a new card builder
        const cardBuilder = CardService.newCardBuilder()
            .setName(Static_Resources.resources.homeCardName)
            // Set the card header
            .setHeader(this.getHeader());
        if (!this.isPremium) {
            // Add the premium required section if the user is not premium
            cardBuilder.addSection(this.getPremiumRequiredSection());
        }

        // Add the format section
        cardBuilder.addSection(this.getFormatSection())
            // Add Minify section
            .addSection(this.getMinifySection())
            // Add Edit section
            .addSection(this.getEditSection());

        if (!this.isPremium) {
            // Add the footer to the card
            cardBuilder.setFixedFooter(this.getFixedFooter());
        }

        return cardBuilder;
    }

    getHeader() {
        return CardService.newCardHeader()
            .setTitle(this.localization.cards.home.title)
            .setSubtitle(this.localization.cards.home.subtitle)
            .setImageStyle(CardService.ImageStyle.SQUARE)
            .setImageUrl('https://raw.githubusercontent.com/ilanlal/ss-json-editor/refs/heads/main/assets/logo120.png')
            .setImageAltText(this.localization.cards.home.imageAltText);
    }

    getFormatSection() {
        // Create a card section with the decorated text
        const section = CardService.newCardSection()
            .setCollapsible(true)
            .setNumUncollapsibleWidgets(1);
        section.addWidget(
            this.getFormatDecoratedTextWidget());

        if (this.isPremium) {
            // Create a selection input for indentation spaces
            const spaceSelectionDropdown =
                CardService.newSelectionInput()
                    .setType(CardService.SelectionInputType.DROPDOWN)
                    // Enable for premium users
                    .setTitle(this.localization.cards.home.indentSpaces)
                    .setFieldName(Static_Resources.resources.indentSpaces)
                    .addItem('1 {.}', '1', this.indentationLevel === "1")
                    .addItem('2 {..}', '2', this.indentationLevel === "2") // Default selected
                    .addItem('4 {....}', '4', this.indentationLevel === "4")
                    .addItem('6 {......}', '6', this.indentationLevel === "6")
                    .addItem('8 {........}', '8', this.indentationLevel === "8")
                    .setOnChangeAction(
                        CardService
                            .newAction()
                            .setFunctionName('onIndentSpacesSelectorChange'));
            // Add the selection input to the card section
            section.addWidget(spaceSelectionDropdown);
        }
        else {
            section.addWidget(
                CardService.newDecoratedText()
                    .setText(`${this.getPremiumRequiredMessage()}`)
                    .setWrapText(true));

            // Add about indentation spaces image
            section.addWidget(
                CardService.newImage()
                    .setImageUrl('https://lh3.googleusercontent.com/-yqc8J311VzE/aIgb2MpVceI/AAAAAAABSe4/P_6FxFzt0M4S922HkZqt6UKZKyq7AcKzACNcBGAsYHQ/Screenshot%2B1280x800-v0005.png')
                    .setAltText('Upgrade to premium for more features')
            );
        }
        return section;
    }

    getFormatDecoratedTextWidget() {
        return CardService.newDecoratedText()
            .setText(this.localization.cards.home.formatAlt)
            .setWrapText(true)
            .setBottomLabel(`${this.localization.cards.home.formatTip}`)
            .setButton(
                CardService.newTextButton()
                    .setText(`${this.localization.actions.format}`)
                    .setOnClickAction(
                        CardService.newAction()
                            .setFunctionName('onFormatRange')));
    }

    getMinifySection() {
        // Create a section for the minify action
        const section = CardService.newCardSection()
            .setCollapsible(false);

        section.addWidget(
            this.getMinifyDecoratedTextWidget());

        return section;
    }

    getMinifyDecoratedTextWidget() {
        return CardService.newDecoratedText()
            .setText(this.localization.cards.home.minifyAlt)
            .setWrapText(true)
            .setBottomLabel(`${this.localization.cards.home.minifyTip}`)
            //.setTopLabel(`${this.getPremiumRequiredMessage()}`)
            .setButton(
                CardService.newTextButton()
                    .setDisabled(!this.isPremium)
                    .setText(`${this.getPremiumLockedEmoji()}${this.localization.actions.minify}`)
                    .setOnClickAction(
                        CardService.newAction()
                            .setFunctionName('onMinifyRange')));
    }

    getEditSection() {
        // Create a section for the edit action
        const section = CardService.newCardSection()
            .setCollapsible(false);

        section.addWidget(
            this.getEditDecoratedTextWidget());

        return section;
    }

    getEditDecoratedTextWidget() {
        return CardService.newDecoratedText()
            .setText(this.localization.cards.home.editAlt)
            .setWrapText(true)
            .setBottomLabel(`${this.localization.cards.home.editTip}`)
            //.setTopLabel(`${this.getPremiumRequiredMessage()}`)
            .setButton(
                CardService.newTextButton()
                    .setDisabled(!this.isPremium)
                    .setText(`${this.getPremiumLockedEmoji()}${this.localization.actions.edit}`)
                    .setOnClickAction(
                        CardService.newAction()
                            .setFunctionName('onEditRange')));
    }

    getPremiumRequiredSection() {
        // Create a section to display the premium required message
        return CardService.newCardSection()
            .addWidget(CardService.newTextParagraph()
                .setText(this.getPremiumRequiredMessage()));
    }
    getFixedFooter() {
        // Create a fixed footer with a button to open the help dialog
        return CardService.newFixedFooter()
            .setPrimaryButton(
                CardService.newTextButton()
                    .setDisabled(this.isPremium)
                    .setText(this.localization.actions.activatePremium)
                    .setOnClickAction(
                        CardService.newAction()
                            .setFunctionName('onOpenAccountCard')));
    }

    getPremiumRequiredMessage() {
        // Return the message indicating that the feature requires a premium license
        return `${!this.isPremium ? (Static_Resources.emojis.lock + ' ' + this.localization.messages.premiumRequired) : ''}`;
    }

    getPremiumLockedEmoji() {
        if (this.isPremium) {
            // Return an empty string if the user has a premium license
            return '';
        }

        // Return the emoji indicating that the feature is locked for non-premium users
        return Static_Resources.emojis.lock + ' ';
    }
}