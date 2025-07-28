// Apps Script code for Google Workspace Add-ons
class HomeCard {
    /**
     * Constructor for the HomeCard class.
     * @param {Global_Resources['en']} localization - The localization resources.
     * @param {UserStore} userStore - The user store instance.
     */
    constructor(localization, userStore) {
        this.userStore = userStore || new UserStore();
        this.localization = localization || AppManager.getLocalizationResources();
    }
    /**
     * Callback for rendering the home card.
     * @see {https://developers.google.com/workspace/add-ons/concepts/cards}
     * @return {CardService.Card} The card to show the user.
     */
    createHomeCard() {
        var builder = CardService.newCardBuilder();

        // Set the card header
        builder.setHeader(this.createHeader());

        // Add Tools section
        builder.addSection(this.createToolsSection());
        // Add the advanced section
        builder.addSection(this.createAdvancedCardSection());

        // Add the subtitle section
        builder.addSection(this.createTipSection());
        // Add the footer to the card
        builder.setFixedFooter(this.createFixedFooter());
        return builder;
    }

    createHeader() {
        return CardService.newCardHeader()
            .setTitle(this.localization.cards.home.title)
            .setSubtitle(this.localization.cards.home.subtitle)
            .setImageStyle(CardService.ImageStyle.SQUARE)
            .setImageUrl('https://raw.githubusercontent.com/ilanlal/ss-json-editor/refs/heads/main/assets/logo120.png')
            .setImageAltText(this.localization.cards.home.imageAltText);
    }

    createToolsSection() {
        const section = CardService.newCardSection();
        // Add tool buttons to the section
        section.addWidget(
            CardService.newTextButton()
                .setText(this.localization.actions.format)
                .setOnClickAction(
                    CardService.newAction()
                        .setFunctionName('onFormatRange')));
        section.addWidget(
            CardService.newTextButton()
                .setText(this.localization.actions.minify)
                .setOnClickAction(
                    CardService.newAction()
                        .setFunctionName('onMinifyRange')));
        section.addWidget(
            CardService.newTextButton()
                .setText(this.localization.actions.edit)
                .setOnClickAction(
                    CardService.newAction()
                        .setFunctionName('onEditCell')));
        return section;
    }

    createTipSection() {
        // Create a card section with the decorated text
        return CardService.newCardSection()
            //.setHeader(localization.cards.home.title)
            .addWidget(
                CardService.newDecoratedText()
                    .setText(this.localization.cards.home.tip)
                    .setWrapText(true));
    }

    createAdvancedCardSection() {
        const settingsSection = CardService.newCardSection()
            .setHeader(this.localization.cards.home.advanced)
            .setCollapsible(true);

        // Add the decorated text to the card section identSpacesContent
        const identSpacesText =
            CardService.newDecoratedText()
                .setText(this.localization.cards.home.identSpacesContent)
                .setWrapText(true);
        // Add the ident spaces text to the card section
        settingsSection.addWidget(identSpacesText);
        
        // Add the ident spaces selector to the card section
        const storedIdentSpaces = this.userStore.getIdentSpaces(); // Get the stored indentation spaces from user properties
        // Create a selection input for indentation spaces
        const spaceSelectionDropdown =
            CardService.newSelectionInput()
                .setType(CardService.SelectionInputType.DROPDOWN)
                .setTitle(this.localization.cards.home.identSpaces)
                .setFieldName(Static_Resources.keys.identSpaces)
                .addItem('1 {.}', '1', storedIdentSpaces === "1")
                .addItem('2 {..}', '2', storedIdentSpaces === "2") // Default selected
                .addItem('4 {....}', '4', storedIdentSpaces === "4")
                .addItem('6 {......}', '6', storedIdentSpaces === "6")
                .addItem('8 {........}', '8', storedIdentSpaces === "8")
                .setOnChangeAction(
                    CardService
                        .newAction()
                        .setFunctionName('onIdentSpacesSelectorChange'));
        // Add the selection input to the card section
        settingsSection.addWidget(spaceSelectionDropdown);

        return settingsSection;
    }

    createFixedFooter() {
        // Create a fixed footer with a button to open the help dialog
        return CardService.newFixedFooter()
            .setPrimaryButton(
                CardService.newTextButton()
                    .setText(this.localization.menu.format)
                    .setOnClickAction(
                        CardService.newAction()
                            .setFunctionName('onFormatRange')))
            .setSecondaryButton(
                CardService.newTextButton()
                    .setText(this.localization.menu.minify)
                    .setOnClickAction(
                        CardService.newAction()
                            .setFunctionName('onMinifyRange')));
    }
}