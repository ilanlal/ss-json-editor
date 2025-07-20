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
            .setSubtitle(localization.cards.home.content)
            .setImageStyle(CardService.ImageStyle.SQUARE)
            .setImageUrl('https://raw.githubusercontent.com/ilanlal/ss-json-editor/refs/heads/main/assets/logo120.png')
            .setImageAltText(localization.cards.home.imageAltText));

    // Add the settings section
    builder.addSection(createSettingsCardSection(e));
    // Add the more options section
    builder.addSection(createMoreOptionsCardSection(e));
    // Add the subtitle section
    builder.addSection(createSubtitleCardTopSection(e));
    // Add the footer to the card
    builder.setFixedFooter(createFixedFooter(e));
    return builder.build();
}

function createSubtitleCardTopSection(e) {
    const localization = getLocalizationResources(e);

    // Create a card section with the decorated text
    return CardService.newCardSection()
        //.setHeader(localization.cards.home.title)
        .addWidget(
            CardService.newDecoratedText()
                .setText(localization.cards.home.subtitle)
                .setWrapText(true));
}

function createSettingsCardSection(e) {
    const localization = getLocalizationResources(e);
    const settingsSection = CardService.newCardSection()
        .setHeader(localization.cards.home.settings)
        .setCollapsible(true);
    const userStore = new UserStore();
    const showErrorsFlag = userStore.getShowErrorsFlag(); // Get the show errors flag from user properties
    const showErrorsToggle =
        CardService.newDecoratedText()
            .setText(localization.cards.home.showErrorsToastFlagContent)
            .setWrapText(true)
            .setSwitchControl(
                CardService.newSwitch()
                    .setFieldName(Static_Resources.keys.showErrorsFlag)
                    .setSelected(showErrorsFlag ?? 'true') // Default to true
                    .setValue("true")
                    .setOnChangeAction(
                        CardService.newAction()
                            .setFunctionName('onShowErrorFlagChange')));
    // Add the show errors toggle to the card section
    settingsSection.addWidget(showErrorsToggle);

    // Add the decorated text to the card section
    const failNoteFlag = userStore.getFailNoteFlag(); // Get the fail note flag from user properties
    const failNoteToggle =
        CardService.newDecoratedText()
            .setText(localization.cards.home.failNoteSwitchContent)
            .setWrapText(true)
            .setSwitchControl(
                CardService.newSwitch()
                    .setFieldName(Static_Resources.keys.failNoteFlag)
                    .setSelected(failNoteFlag) // Default to true
                    .setValue("true")
                    .setOnChangeAction(
                        CardService.newAction()
                            .setFunctionName('onFailNoteFlagChange')));
    // Add the fail note toggle to the card section
    settingsSection.addWidget(failNoteToggle);

    // Add the ident spaces selector to the card section
    const storedIdentSpaces = userStore.getIdentSpaces(); // Get the stored indentation spaces from user properties
    // Create a selection input for indentation spaces
    const spaceSelectionDropdown =
        CardService.newSelectionInput()
            .setType(CardService.SelectionInputType.DROPDOWN)
            .setTitle(localization.cards.home.identSpaces)
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

function createMoreOptionsCardSection(e) {
    const localization = getLocalizationResources(e);


    // Create a card with more options
    return CardService.newCardSection()
        .setHeader(localization.cards.home.moreOptions)
        .setCollapsible(true)
        .addWidget(CardService.newTextParagraph()
            .setText(localization.cards.home.moreOptionsContent));
}

function createFixedFooter(e) {
    const localization = getLocalizationResources(e);

    // Create a fixed footer with a button to open the help dialog
    return CardService.newFixedFooter()
        .setPrimaryButton(
            CardService.newTextButton()
                .setText(localization.menu.format)
                .setOnClickAction(CardService.newAction().setFunctionName('onPrettifyRange')))
        .setSecondaryButton(
            CardService.newTextButton()
                .setText(localization.menu.minify)
                .setOnClickAction(CardService.newAction().setFunctionName('onMinifyRange')));
}