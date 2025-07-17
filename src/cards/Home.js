// Apps Script code for Google Workspace Add-ons
// src/cards/HomeCard.js

/**
 * Callback for rendering the home card.
 * @see {https://developers.google.com/workspace/add-ons/concepts/cards}
 * @return {CardService.Card} The card to show the user.
 */
function createHomeCard(e) {
    const localization = getLocalizationResources(e);
    var builder = CardService.newCardBuilder();

    // Set the card header
    builder.setHeader(
        CardService.newCardHeader()
            .setTitle(localization.cards.home.title)
            .setSubtitle(localization.cards.home.subtitle)
            .setImageStyle(CardService.ImageStyle.SQUARE)
            .setImageUrl('https://raw.githubusercontent.com/ilanlal/ss-json-editor/refs/heads/main/assets/logo120.png')
            .setImageAltText(localization.cards.home.imageAltText));

    // Add the top section with the title and switch control
    builder.addSection(createHomeCardTopSection(e));
    // Add the settings section
    builder.addSection(createSettingsCardSection(e));
    // Add the more options section
    builder.addSection(createMoreOptionsCardSection(e));
    // Add the footer to the card
    builder.setFixedFooter(createHomeCardFixedFooter(e));
    return builder.build();
}

function createHomeCardTopSection(e) {
    const localization = getLocalizationResources(e);

    // Create a card section with the decorated text
    return CardService.newCardSection()
        //.setHeader(localization.cards.home.title)
        .addWidget(
            CardService.newDecoratedText()
                .setText(localization.cards.home.content)
                .setWrapText(true));
}

function createSettingsCardSection(e) {
    const localization = getLocalizationResources(e);

    const validateJsonSwitch =
        CardService.newDecoratedText()
            .setText(localization.cards.home.validateJsonSwitchContent)
            .setWrapText(false)
            .setSwitchControl(
                CardService.newSwitch()
                    .setFieldName('validate_json_switch')
                    .setSelected(false) // Default to true
                    .setValue("true")
                    .setOnChangeAction(
                        CardService.newAction()
                            .setFunctionName('onValidateJsonSwitchChange')));

    const userProperties = PropertiesService.getUserProperties();
    const storedIdentSpaces = userProperties.getProperty('ident_spaces_selector') || '2';
    // DROPDOWN
    const identSpacesSelector =
        CardService.newSelectionInput()
            .setType(CardService.SelectionInputType.DROPDOWN)
            .setTitle(localization.cards.home.identSpaces)
            .setFieldName('ident_spaces_selector')
            .addItem('1 {.}', '1', storedIdentSpaces === '1')
            .addItem('2 {..}', '2', storedIdentSpaces === '2') // Default selected
            .addItem('4 {....}', '4', storedIdentSpaces === '4')
            .addItem('6 {......}', '6', storedIdentSpaces === '6')
            .addItem('8 {........}', '8', storedIdentSpaces === '8')
            .setOnChangeAction(
                CardService
                    .newAction()
                    .setFunctionName('onIdentSpacesSelectorChange'));

    // Create a card with formatting options
    return CardService.newCardSection()
        .setHeader(localization.cards.home.settings)
        .setCollapsible(true)
        .addWidget(validateJsonSwitch)
        .addWidget(CardService.newTextParagraph()
            .setText(localization.cards.home.identSpacesContent))
        .addWidget(identSpacesSelector);
}

function createMoreOptionsCardSection(e) {
    const localization = getLocalizationResources(e);


    // Create a card with more options
    return CardService.newCardSection()
        .setHeader(localization.cards.home.moreOptions)
        .setCollapsible(true)
        .addWidget(CardService.newTextParagraph()
            .setText(localization.cards.home.moreOptionsContent));
}

function createHomeCardFixedFooter(e) {
    const localization = getLocalizationResources(e);

    // Create a fixed footer with a button to open the help dialog
    return CardService.newFixedFooter()
        .setPrimaryButton(
            CardService.newTextButton()
                .setText(localization.menu.prettify)
                .setOnClickAction(CardService.newAction().setFunctionName('onPrettifyRange')))
        .setSecondaryButton(
            CardService.newTextButton()
                .setText(localization.menu.minify)
                .setOnClickAction(CardService.newAction().setFunctionName('onMinifyRange')));
}