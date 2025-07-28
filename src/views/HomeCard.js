// Apps Script code for Google Workspace Add-ons
class HomeCard {
    static create(userLicense, localization, identSpaces = 2) {
        const isPremium = userLicense?.isActive?.() || false;
        const premiumIcon = isPremium ? (localization.actions.premiumIcon + ' ') : '';

        const builder = CardService.newCardBuilder();

        // Set the card header
        builder.setHeader(HomeCard.createHeader(localization, isPremium, premiumIcon));

        // Add Tools section
        builder.addSection(HomeCard.createToolsSection(localization, isPremium, premiumIcon));
        // Add the advanced section
        builder.addSection(HomeCard.createAdvancedCardSection(
            localization, isPremium, premiumIcon, identSpaces));

        // Add the subtitle section
        builder.addSection(HomeCard.createTipSection(localization, isPremium, premiumIcon));
        // Add the footer to the card
        builder.setFixedFooter(HomeCard.createFixedFooter(localization, isPremium, premiumIcon));
        return builder;
    }

    static createHeader(localization, isPremium=false, premiumIcon = '') {
        return CardService.newCardHeader()
            .setTitle(localization.cards.home.title)
            .setSubtitle(localization.cards.home.subtitle)
            .setImageStyle(CardService.ImageStyle.SQUARE)
            .setImageUrl('https://raw.githubusercontent.com/ilanlal/ss-json-editor/refs/heads/main/assets/logo120.png')
            .setImageAltText(localization.cards.home.imageAltText);
    }

    static createToolsSection(localization, isPremium = false, premiumIcon = '') {
        const section = CardService.newCardSection();
        // Add tool buttons to the section
        section.addWidget(
            CardService.newTextButton()
                .setText(localization.actions.format)
                .setOnClickAction(
                    CardService.newAction()
                        .setFunctionName('onFormatRange')));
        section.addWidget(
            CardService.newTextButton()
                // Enable for premium users
                .setDisabled(!isPremium)
                .setText(localization.actions.minify)
                .setOnClickAction(
                    CardService.newAction()
                        .setFunctionName('onMinifyRange')));
        section.addWidget(
            CardService.newTextButton()
                // Enable for premium users
                .setDisabled(!isPremium)
                .setText(`${premiumIcon}${localization.actions.edit}`)
                .setOnClickAction(
                    CardService.newAction()
                        .setFunctionName('onEditCell')));
        return section;
    }

    static createTipSection(localization, isPremium=false, premiumIcon = '') {
        // Create a card section with the decorated text
        return CardService.newCardSection()
            //.setHeader(localization.cards.home.title)
            .addWidget(
                CardService.newDecoratedText()
                    .setText(localization.cards.home.tip)
                    .setWrapText(true));
    }

    static createAdvancedCardSection(localization, isPremium=false, premiumIcon = '', identSpaces = 2) {
        const settingsSection = CardService.newCardSection()
            .setHeader(localization.cards.home.advanced)
            .setCollapsible(true);

        // Add the decorated text to the card section identSpacesContent
        const identSpacesText =
            CardService.newDecoratedText()
                .setText(localization.cards.home.identSpacesContent)
                .setWrapText(true);
        // Add the ident spaces text to the card section
        settingsSection.addWidget(identSpacesText);

        // Create a selection input for indentation spaces
        const spaceSelectionDropdown =
            CardService.newSelectionInput()
                .setType(CardService.SelectionInputType.DROPDOWN)
                // Enable for premium users
                .setTitle( premiumIcon + " " + localization.cards.home.identSpaces)
                .setFieldName(Static_Resources.keys.identSpaces)
                .addItem('1 {.}', '1', identSpaces === "1")
                .addItem('2 {..}', '2', identSpaces === "2") // Default selected
                .addItem(`${premiumIcon}` + '4 {....}', '4', identSpaces === (isPremium ? "4" : "2"))
                .addItem(`${premiumIcon}` + '6 {......}', '6', identSpaces === (isPremium ? "6" : "2"))
                .addItem(`${premiumIcon}` + '8 {........}', '8', identSpaces === (isPremium ? "8" : "2"))
                .setOnChangeAction(
                    CardService
                        .newAction()
                        .setFunctionName('onIdentSpacesSelectorChange'));
        // Add the selection input to the card section
        settingsSection.addWidget(spaceSelectionDropdown);

        return settingsSection;
    }

    static createFixedFooter(localization, isPremium = false, premiumIcon = '') {

        // Create a fixed footer with a button to open the help dialog
        return CardService.newFixedFooter()
            .setPrimaryButton(
                CardService.newTextButton()
                    .setText(localization.menu.format)
                    .setOnClickAction(
                        CardService.newAction()
                            .setFunctionName('onFormatRange')))
            .setSecondaryButton(
                CardService.newTextButton()
                    .setDisabled(isPremium)
                    .setText(isPremium ? localization.messages.premiumActivated : localization.actions.activatePremium)
                    .setBackgroundColor(isPremium ? '#4CAF50' : '#FF9800')
                    .setOnClickAction(
                        CardService.newAction()
                            .setFunctionName('onOpenAccountCard')));
    }
}