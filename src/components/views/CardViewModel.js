class CardViewModel {
    static create({
        cardService = CardService,
        activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet(),
        userProperties = PropertiesService.getDocumentProperties() } = {}
    ) {
        return new CardViewModel({
            cardWrapper: CardViewModel.CardServiceWrapper.create(cardService, userProperties)
        });
    }

    constructor({ cardWrapper } = {}) {
        // Use the global CardService in Apps Script environment
        /** @type {CardViewModel.CardServiceWrapper} */
        this._cardWrapper = cardWrapper;
    }

    /** @returns {CardViewModel.CardServiceWrapper} */
    get cardWrapper() {
        return this._cardWrapper;
    }
};

CardViewModel.CardServiceWrapper = class {
    static create(cardService = CardService, documentProperties = PropertiesService.getDocumentProperties()) {
        return new CardViewModel.CardServiceWrapper(cardService, documentProperties);
    }

    constructor(cardService, documentProperties) {
        // Use the global CardService in Apps Script environment
        this._cardService = cardService;
        this._documentProperties = documentProperties;
    }

    newCardBuilder(cardMeta = {}) {
        const cardBuilder = this._cardService.newCardBuilder();

        // Set card name
        cardBuilder.setName(`${cardMeta.name || 'No Name'}`);

        // Set card header
        if (cardMeta.header) {
            cardBuilder.setHeader(
                this.newCardHeader(cardMeta.header));
        }

        // Set fixed footer if provided
        if (cardMeta.fixedFooter) {
            cardBuilder.setFixedFooter(
                this.newFixedFooter(cardMeta.fixedFooter)
            );
        }

        // Add sections
        if (cardMeta.sections && Array.isArray(cardMeta.sections)) {
            cardMeta.sections.forEach(section => {
                cardBuilder.addSection(
                    this.newCardSection(section));
            });
        }

        return cardBuilder;
    }

    newCardHeader(headerMeta = {}) {
        return this._cardService.newCardHeader()
            .setTitle(`${headerMeta.title || ''}`)
            .setSubtitle(`${headerMeta.subTitle || ''}`)
            .setImageStyle(headerMeta.imageStyle || CardService.ImageStyle.SQUARE)
            .setImageUrl(headerMeta.imageUrl || EMD.DEFAULT_IMAGE_URL)
            .setImageAltText(headerMeta.imageAltText || 'Card Image');
    }

    newFixedFooter(fixedFooterMeta = {}) {
        if (!fixedFooterMeta.primaryButton?.textButton) {
            throw new Error(CardViewModel.ErrorMessages.FIXED_FOOTER_BUTTON_NOT_DEFINED_ERROR);
        }
        const fixedFooter = this._cardService.newFixedFooter();

        const primaryButton = this.newTextButton(fixedFooterMeta.primaryButton.textButton);
        fixedFooter.setPrimaryButton(primaryButton);

        if (fixedFooterMeta.secondaryButton) {
            fixedFooter.setSecondaryButton(
                this.newTextButton(fixedFooterMeta.secondaryButton.textButton)
            );
        }

        return fixedFooter;
    }

    newCardSection(sectionMeta = {}) {
        const cardSection = this._cardService.newCardSection();
        cardSection.setHeader(sectionMeta.header || '');
        cardSection.setCollapsible(sectionMeta.collapsible || false);
        cardSection.setNumUncollapsibleWidgets(sectionMeta.numUncollapsibleWidgets || 0);
        // cardSection.setCollapserControl(section.collapseControl || 'COLLAPSE_CONTROL_NONE');

        if (sectionMeta.widgets && Array.isArray(sectionMeta.widgets)) {
            sectionMeta.widgets.forEach(widgetMeta => {
                const cardWidget = this.newWidget(widgetMeta);
                if (cardWidget) {
                    cardSection.addWidget(cardWidget);
                }
            });
        }

        return cardSection;
    }

    newWidget(widgetMeta = {}) {
        const _widgetInstance = WidgetModel.create(widgetMeta, this._documentProperties);
        // Bind value from 'propertyName' property if specified
        const value = _widgetInstance.value || '';

        if (widgetMeta.DecoratedText) {
            return this.newDecoratedText(widgetMeta.DecoratedText, value);
        }

        if (widgetMeta.TextInput) {
            return this.newTextInput(widgetMeta.TextInput, value);
        }

        if (widgetMeta.TextParagraph) {
            return this.newTextParagraph(widgetMeta.TextParagraph, value);
        }

        if (widgetMeta.TextButton) {
            return this.newTextButton(widgetMeta.TextButton, !!value);
        }

        throw new Error(`Unsupported widget type in widgetMeta: ${JSON.stringify(widgetMeta)}`);
    }

    newDecoratedText(dtMeta = {}, value = '') {
        // setText(text) and one of the keys: setTopLabel(text), or setBottomLabel(text) are required
        if (!dtMeta.text) {
            throw new Error(CardViewModel.ErrorMessages.DECORATED_TEXT_MISSING_CONTENT_ERROR);
        }
        if (!dtMeta.topLabel && !dtMeta.bottomLabel) {
            throw new Error(CardViewModel.ErrorMessages.DECORATED_TEXT_MISSING_CONTENT_ERROR);
        }
        const decoratedText = this._cardService.newDecoratedText();

        if (dtMeta.topLabel)
            decoratedText.setTopLabel(`${dtMeta.topLabel}`);
        if (dtMeta.wrapText)
            decoratedText.setWrapText(dtMeta.wrapText);
        if (dtMeta.text)
            decoratedText.setText(`${dtMeta.text}`);
        if (dtMeta.bottomLabel)
            decoratedText.setBottomLabel(`${dtMeta.bottomLabel}`);

        if (dtMeta.textButton || dtMeta.TextButton) {
            decoratedText.setButton(
                this.newTextButton(dtMeta.textButton || dtMeta.TextButton, !!value));
        }

        return decoratedText;
    }

    newTextInput(inputTextMeta = {}, value = '') {
        if (!inputTextMeta.fieldName || String(inputTextMeta.fieldName).trim() === '') {
            throw new Error(CardViewModel.ErrorMessages.TEXT_INPUT_MISSING_FIELD_NAME_ERROR);
        }

        return CardService.newTextInput()
            .setFieldName(inputTextMeta.fieldName)
            .setTitle(inputTextMeta.title || '')
            .setValue(value || '')
            .setHint(inputTextMeta.hint || '')
            .setMultiline(inputTextMeta.multiline || false);
    }

    newTextParagraph(tpMeta = {}, value = '') {
        const newTextParagraph = CardService.newTextParagraph()
            .setText(tpMeta.text || value || '');
        if (tpMeta.maxLines) {
            newTextParagraph.setMaxLines(tpMeta.maxLines);
        }
        return newTextParagraph;
    }

    newTextButton(textButtonMeta = {}, disabled = false, style = CardService.TextButtonStyle.TEXT) {
        if (!textButtonMeta.text || (!textButtonMeta.openLink && !textButtonMeta.onClick)) {
            throw new Error(CardViewModel.ErrorMessages.TEXT_BUTTON_MISSING_PROPERTIES_ERROR);
        }

        const _textButton = this._cardService.newTextButton()
            .setText(textButtonMeta.text)
            .setDisabled(typeof disabled === 'boolean' ? disabled : !!textButtonMeta.disabled)
            .setTextButtonStyle(textButtonMeta.style || style);

        if (textButtonMeta.openLink) {
            _textButton.setOpenLink(this._cardService.newOpenLink().setUrl(textButtonMeta.openLink.url || ''));
        }
        else if (textButtonMeta.onClick) {
            _textButton.setOnClickAction(textButtonMeta.onClick.functionName ? this._cardService.newAction()
                .setFunctionName(textButtonMeta.onClick.functionName)
                .setParameters(textButtonMeta.onClick.parameters || {}) : null
            );
        }
        else {
            throw new Error(CardViewModel.ErrorMessages.TEXT_BUTTON_MISSING_PROPERTIES_ERROR);
        }
        return _textButton;
    }
};

CardViewModel.ErrorMessages = {
    FIXED_FOOTER_BUTTON_NOT_DEFINED_ERROR: "Fixed footer must have a primaryButton defined.",
    TEXT_INPUT_MISSING_FIELD_NAME_ERROR: "TextInput widget must have a 'fieldName' property.",
    DECORATED_TEXT_MISSING_CONTENT_ERROR: "DecoratedText widget must have at least one of 'text', 'decoratedText', 'topLabel', or 'bottomLabel' properties defined.",
    TEXT_BUTTON_MISSING_PROPERTIES_ERROR: "TextButton widget must have either 'text', and 'openLink' or 'onClick' defined."
};

if (typeof module !== "undefined" && module.exports) {
    module.exports = CardViewModel;
}