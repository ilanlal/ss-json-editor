// Apps Script code for Google Workspace Add-ons
class HomeCard {
    static create(userLicense, localization, identSpaces = 2) {
        const isPremium = userLicense?.isActive?.() || false;
        const premiumIcon = !isPremium ? (localization.actions.premiumIcon + ' ') : '';

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

    static createHeader(localization, isPremium = false, premiumIcon = '') {
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

    static createTipSection(localization, isPremium = false, premiumIcon = '') {
        // Create a card section with the decorated text
        return CardService.newCardSection()
            //.setHeader(localization.cards.home.title)
            .addWidget(
                CardService.newDecoratedText()
                    .setText(localization.cards.home.tip)
                    .setWrapText(true));
    }

    static createAdvancedCardSection(localization, isPremium = false, premiumIcon = '', identSpaces = 2) {
        const section = CardService.newCardSection()
            .setHeader(localization.cards.home.advanced)
            .setCollapsible(true);

        // Add the decorated text to the card section identSpacesContent
        const identSpacesText =
            CardService.newDecoratedText()
                .setText(localization.cards.home.identSpacesContent)
                .setWrapText(true);
        // Add the ident spaces text to the card section
        section.addWidget(identSpacesText);

        if (isPremium) {
            // Create a selection input for indentation spaces
            const spaceSelectionDropdown =
                CardService.newSelectionInput()
                    .setType(CardService.SelectionInputType.DROPDOWN)
                    // Enable for premium users
                    .setTitle(premiumIcon + " " + localization.cards.home.identSpaces)
                    .setFieldName(Static_Resources.identSpaces)
                    .addItem('1 {.}', '1', identSpaces === "1")
                    .addItem('2 {..}', '2', identSpaces === "2") // Default selected
                    .addItem('4 {....}', '4', identSpaces === "4")
                    .addItem('6 {......}', '6', identSpaces === "6")
                    .addItem('8 {........}', '8', identSpaces === "8")
                    .setOnChangeAction(
                        CardService
                            .newAction()
                            .setFunctionName('onIdentSpacesSelectorChange'));
            // Add the selection input to the card section
            section.addWidget(spaceSelectionDropdown);
        }
        else {
            // Add disabled selection input for indentation spaces
            section.addWidget(
                CardService.newSelectionInput()
                    .setType(CardService.SelectionInputType.DROPDOWN)
                    .setTitle(premiumIcon + " " + localization.cards.home.identSpaces)
                    .setFieldName(Static_Resources.identSpaces)
                    .addItem('2 {..}', '2', true));

        }
        // Add about indentation spaces image
        section.addWidget(
            CardService.newImage()
                .setImageUrl('https://lh3.googleusercontent.com/-yqc8J311VzE/aIgb2MpVceI/AAAAAAABSe4/P_6FxFzt0M4S922HkZqt6UKZKyq7AcKzACNcBGAsYHQ/Screenshot%2B1280x800-v0005.png')
                .setAltText('Upgrade to premium for more features')
        );
        return section;
    }

    static createFixedFooter(localization, isPremium = false, premiumIcon = '') {

        // Create a fixed footer with a button to open the help dialog
        const footer = CardService.newFixedFooter()
            .setPrimaryButton(
                CardService.newTextButton()
                    .setText(localization.menu.format)
                    .setOnClickAction(
                        CardService.newAction()
                            .setFunctionName('onFormatRange')));
        // If the user is premium, add the minify button
        if (!isPremium) {
            footer.setSecondaryButton(
                CardService.newTextButton()
                    .setDisabled(isPremium)
                    .setText(localization.actions.activatePremium)
                    .setBackgroundColor('#FF9800')
                    .setOnClickAction(
                        CardService.newAction()
                            .setFunctionName('onOpenAccountCard')));
        }

        return footer;
    }
}