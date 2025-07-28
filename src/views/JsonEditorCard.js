// Google Apps Script code for Google Workspace Add-ons
class JsonEditorCard {
    /**
     * Creates a new instance of JsonEditorCard.
     * @param {string} a1Notation - The A1 notation of the selected range.
     * @param {Global_Resources["en"]} [localization] - The localization resources.
     */
    constructor(a1Notation, localization) {
        this.a1Notation = a1Notation;
        this.localization = localization || AppManager.getLocalizationResources();
    }

    /**
     * Creates a card for the JSON editor.
     * @returns {CardService.Card} - The card for the JSON editor.
     */
    createCard(data = '') {
        const builder = CardService.newCardBuilder();

        // Set the header of the card
        builder.setHeader(this.createHeader());
        // Add a section for the JSON editor
        builder.addSection(this.createEditorSection(data));
        // Add a section for the footer
        builder.setFixedFooter(this.createFixedFooter());

        return builder;
    }

    createHeader() {
        return CardService.newCardHeader()
            .setTitle(this.localization.cards.editor.title)
            .setSubtitle(this.localization.cards.editor.subtitle
                .replace('{0}', this.a1Notation))
            .setImageStyle(CardService.ImageStyle.SQUARE)
            .setImageUrl('https://raw.githubusercontent.com/ilanlal/ss-json-editor/main/assets/logo120.png')
            .setImageAltText(this.localization.cards.editor.imageAltText);
    }

    /**
     * Creates the section for the JSON editor.
     * @param {string} data - The initial data to display in the editor.
     * @returns {CardService.CardSection} - The section for the JSON editor.
     */
    createEditorSection(data = '') {
        const section = CardService.newCardSection();
        section.addWidget(
            CardService.newTextParagraph()
                .setText(this.localization.cards.editor.content));
        // Add a text input widget for the JSON editor
        section.addWidget(
            CardService.newTextInput()
                .setFieldName('dataInput')
                .setMultiline(true)
                .setValue(data));
        return section;
    }

    /**
     * Creates the fixed footer for the card.
     * @returns {CardService.FixedFooter} - The fixed footer for the card.
     */
    createFixedFooter() {
        const footer = CardService.newFixedFooter();

        footer.addWidget(
            CardService.newTextParagraph()
                .setText(this.localization.cards.editor.footer))
            .setPrimaryButton(CardService.newTextButton()
                .setText(this.localization.cards.editor.saveButton)
                .setOnClickAction(CardService.newAction()
                    .setFunctionName('onSaveEditor')
                    .setParameters({ a1Notation: this.a1Notation })))
            .setSecondaryButton(CardService.newTextButton()
                .setText(this.localization.cards.editor.cancelButton)
                .setOnClickAction(CardService.newAction()
                    .setFunctionName('onCancelEditor')
                    .setParameters({ a1Notation: this.a1Notation })));

        return footer;
    }
}