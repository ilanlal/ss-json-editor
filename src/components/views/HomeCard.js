// Apps Script code for Google Workspace Add-ons
class HomeCard {
    /**
     * Constructor for the HomeCard class.
     * @param {boolean} isPremium - Indicates if the user has a premium license.
     * @param {number} indentationSpaces - The number of spaces to use for indentation.
     * @param {Global_Resources["en"]} localization - The localization object for the card.
     */
    constructor(isPremium = false, indentationSpaces, localization) {
        this.isPremium = isPremium;
        this.indentationLevel = indentationSpaces;
        this.localization = localization;
    }

    static create(userLicense, localization, indentationSpaces = 2) {
        const isPremium = userLicense?.isActive?.() || false;
        const thisCard = new HomeCard(
            isPremium,
            indentationSpaces,
            localization
        );
        // Build the card using the builder pattern
        return thisCard.newCardBuilder();
    }

    newCardBuilder() {
        // Create a new card builder
        const cardBuilder = CardService.newCardBuilder()
            // Set the card header
            .setHeader(this.getHeader())
            // Add the format section
            .addSection(this.getFormatSection())
            // Add Tools section
            .addSection(this.getToolsSection());

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

    getToolsSection() {
        const section = CardService.newCardSection();

        section.addWidget(
            this.getMinifyDecoratedTextWidget());

        section.addWidget(
            this.getEditDecoratedTextWidget());

        return section;
    }

    getFormatSection() {
        // Create a card section with the decorated text
        const section = CardService.newCardSection()
            .setCollapsible(true)
            .setNumUncollapsibleWidgets(1);
        section.addWidget(
            this.getFormatDecoratedTextWidget());

        // Add the ident spaces text to the card section
        section.addWidget(CardService.newDecoratedText()
            .setText(`${this.getPremiumRequiredMessage()}`)
            .setWrapText(true));

        if (this.isPremium) {
            // Create a selection input for indentation spaces
            const spaceSelectionDropdown =
                CardService.newSelectionInput()
                    .setType(CardService.SelectionInputType.DROPDOWN)
                    // Enable for premium users
                    .setTitle(this.localization.cards.home.indentSpaces)
                    .setFieldName(Static_Resources.identSpaces)
                    .addItem('1 {.}', '1', this.indentationLevel === "1")
                    .addItem('2 {..}', '2', this.indentationLevel === "2") // Default selected
                    .addItem('4 {....}', '4', this.indentationLevel === "4")
                    .addItem('6 {......}', '6', this.indentationLevel === "6")
                    .addItem('8 {........}', '8', this.indentationLevel === "8")
                    .setOnChangeAction(
                        CardService
                            .newAction()
                            .setFunctionName('onIdentSpacesSelectorChange'));
            // Add the selection input to the card section
            section.addWidget(spaceSelectionDropdown);
        }
        else {
            // Add disabled button for indentation spaces
            /*section.addWidget(
                CardService.newTextButton()
                    .setText(`${Static_Resources.emojis.lock} ${this.localization.actions.change}`)
                    .setDisabled(true)
            );*/
        }
        // Add about indentation spaces image
        section.addWidget(
            CardService.newImage()
                .setImageUrl('https://lh3.googleusercontent.com/-yqc8J311VzE/aIgb2MpVceI/AAAAAAABSe4/P_6FxFzt0M4S922HkZqt6UKZKyq7AcKzACNcBGAsYHQ/Screenshot%2B1280x800-v0005.png')
                .setAltText('Upgrade to premium for more features')
        );
        return section;
    }

    getFormatDecoratedTextWidget() {
        return CardService.newDecoratedText()
            .setText(this.localization.cards.home.formatAlt)
            .setWrapText(true)
            .setButton(
                CardService.newTextButton()
                    .setText(`${this.localization.actions.format}`)
                    .setOnClickAction(
                        CardService.newAction()
                            .setFunctionName('onFormatRange')));
    }

    getMinifyDecoratedTextWidget() {
        return CardService.newDecoratedText()
            .setText(this.localization.cards.home.minifyAlt)
            .setWrapText(true)
            .setBottomLabel(`${this.getPremiumRequiredMessage()}`)
            //.setTopLabel(`${this.isPremium ? '' : Static_Resources.emojis.lock}`)
            .setButton(
                CardService.newTextButton()
                    .setDisabled(!this.isPremium)
                    .setText(`${this.localization.actions.minify}`)
                    .setOnClickAction(
                        CardService.newAction()
                            .setFunctionName('onMinifyRange')));
    }

    getEditDecoratedTextWidget() {
        return CardService.newDecoratedText()
            .setText(this.localization.cards.home.editAlt)
            .setWrapText(true)
            .setBottomLabel(`${this.getPremiumRequiredMessage()}`)
            //.setTopLabel(`${this.isPremium ? '' : Static_Resources.emojis.lock}`)
            .setButton(
                CardService.newTextButton()
                    .setDisabled(!this.isPremium)
                    .setText(`${this.localization.actions.edit}`)
                    .setOnClickAction(
                        CardService.newAction()
                            .setFunctionName('onEditRange')));
    }

    getFixedFooter() {
        // Create a fixed footer with a button to open the help dialog
        const footer = CardService.newFixedFooter()
            .setPrimaryButton(
                CardService.newTextButton()
                    .setText(this.localization.menu.format)
                    .setOnClickAction(
                        CardService.newAction()
                            .setFunctionName('onFormatRange')));
        // If the user is premium, add the minify button
        if (!this.isPremium) {
            footer.setSecondaryButton(
                CardService.newTextButton()
                    .setDisabled(this.isPremium)
                    .setText(this.localization.actions.activatePremium)
                    .setBackgroundColor('#FF9800')
                    .setOnClickAction(
                        CardService.newAction()
                            .setFunctionName('onOpenAccountCard')));
        }

        return footer;
    }

    getPremiumRequiredMessage() {
        // Return the message indicating that the feature requires a premium license
        return `${!this.isPremium ? (Static_Resources.emojis.lock + ' ' + this.localization.messages.premiumRequired) : ''}`;
    }
}