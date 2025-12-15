require('../../../tests');
const CardViewModel = require('./CardViewModel');

describe('Model.CardWrapper', () => {
    it('should create an instance of CardWrapper with new service instances', () => {
        const wrapper = new CardViewModel.CardServiceWrapper(CardService);
        expect(wrapper).toBeDefined();
    });

    it('should create a new instance of CardWrapper with initiated service references', () => {
        const viewModel = CardViewModel.create({
            cardService: CardService,
            activeSpreadsheet: SpreadsheetApp.getActiveSpreadsheet(),
            userProperties: PropertiesService.getDocumentProperties()
        });
        expect(viewModel.cardWrapper).toBeDefined();
    });

    describe('Testing', () => {
        const viewModel = CardViewModel.create({
            cardService: CardService,
            activeSpreadsheet: SpreadsheetApp.getActiveSpreadsheet(),
            userProperties: PropertiesService.getDocumentProperties()
        });

        const wrapper = viewModel.cardWrapper;
        describe('widgets', () => {
            describe('TextButton', () => {
                //newTextButton 
                it('should create a newTextButton widget with correct text & onClick function', () => {
                    const textButtonMeta = {
                        text: 'Click Me',
                        onClick: {
                            functionName: 'onClick',
                            parameters: {
                                action: 'click'
                            }
                        }
                    };
                    const textButton = wrapper.newTextButton(textButtonMeta);
                    expect(textButton).toBeDefined();
                    const data = textButton.getData();
                    expect(data).toBeDefined();
                    expect(data.textButton.text).toBe(textButtonMeta.text);
                    expect(data.textButton.onClick.action.actionMethodName).toBe(textButtonMeta.onClick.functionName);
                    expect(data.textButton.onClick.action.parameters).toEqual(textButtonMeta.onClick.parameters);
                });

                // openLink
                it('should create a newTextButton widget with correct text & openLink', () => {
                    const textButtonMeta = {
                        text: 'Visit Website',
                        openLink: {
                            url: 'https://example.com'
                        }
                    };
                    const textButton = wrapper.newTextButton(textButtonMeta);
                    expect(textButton).toBeDefined();
                    const data = textButton.getData();
                    expect(data).toBeDefined();
                    expect(data.textButton.text).toBe(textButtonMeta.text);
                });

                it('should throw an error if TextButton properties are missing', () => {
                    const textButtonMeta = {
                        // text is missing
                    };
                    expect(() => wrapper.newTextButton(textButtonMeta))
                        .toThrowError(CardViewModel.CardServiceWrapper.TEXT_BUTTON_MISSING_PROPERTIES_ERROR);
                });


            });


            describe('TextParagraph', () => {
                it('should create a newTextParagraph widget with correct text', () => {
                    const textParagraphMeta = {
                        text: 'This is a test paragraph'
                    };
                    const textParagraph = wrapper.newTextParagraph(textParagraphMeta);
                    expect(textParagraph).toBeDefined();
                    const data = textParagraph.getData();
                    expect(data).toBeDefined();
                    expect(data.text).toBe(textParagraphMeta.text);
                });
            });

            describe('TextInput', () => {
                it('should create a newTextInput widget with correct placeholder', () => {
                    const textInputMeta = {
                        fieldName: 'testInput',
                        title: 'Test Input',
                        hint: 'Enter test value',
                        value: 'Test Value',
                        type: 'string'
                    };
                    const textInput = wrapper.newTextInput(textInputMeta);
                    expect(textInput).toBeDefined();
                    let data = textInput.getData();
                    expect(data).toBeDefined();
                    //console.log(JSON.stringify(data, null, 2));
                });

                it('should throw an error if TextInput fieldName is missing', () => {
                    const textInputMeta = {
                        // fieldName is missing
                        title: 'Test Input',
                        hint: 'Enter test value',
                        value: 'Test Value',
                        type: 'string'
                    };
                    expect(() => wrapper.newTextInput(textInputMeta))
                        .toThrowError(CardViewModel.CardServiceWrapper.TEXT_INPUT_MISSING_FIELD_NAME_ERROR);
                });
            });

            describe('DecoratedText', () => {
                // newDecoratedText
                it('should create a newDecoratedText widget with correct text and labels', () => {
                    const decoratedTextMeta = {
                        text: 'Main Text',
                        topLabel: 'Top Label',
                        bottomLabel: 'Bottom Label',
                    };
                    
                    const decoratedText = wrapper.newDecoratedText(decoratedTextMeta, '');
                    expect(decoratedText).toBeDefined();
                    const data = decoratedText.getData();
                    expect(data).toBeDefined();
                    expect(data.text).toBe(decoratedTextMeta.text);
                    expect(data.topLabel).toBe(decoratedTextMeta.topLabel);
                    expect(data.bottomLabel).toBe(decoratedTextMeta.bottomLabel);
                });

                it('should throw an error if DecoratedText content is missing', () => {
                    const decoratedTextMeta = {
                        // missing text, topLabel, bottomLabel
                    };
                    expect(() => wrapper.newDecoratedText(decoratedTextMeta))
                        .toThrowError(CardViewModel.CardServiceWrapper.DECORATED_TEXT_MISSING_CONTENT_ERROR);
                });

                it('should throw an error if DecoratedText content is missing', () => {
                    const decoratedTextMeta = {
                        text: 'Main Text',
                        // missing topLabel, bottomLabel
                    };
                    expect(() => wrapper.newDecoratedText(decoratedTextMeta))
                        .toThrowError(CardViewModel.CardServiceWrapper.DECORATED_TEXT_MISSING_CONTENT_ERROR);
                });

                it('should throw an error if DecoratedText content is missing', () => {
                    const decoratedTextMeta = {
                        // missing text
                        topLabel: 'Top Label',
                    };
                    expect(() => wrapper.newDecoratedText(decoratedTextMeta))
                        .toThrowError(CardViewModel.CardServiceWrapper.DECORATED_TEXT_MISSING_CONTENT_ERROR);
                });
            });
        });

        describe('sections', () => {
            it('should create a new section with the correct header and widgets', () => {
                const sectionMeta = {
                    header: 'Section 1',
                    collapsible: false,
                    numUncollapsibleWidgets: 0
                };
                const section = wrapper.newCardSection(sectionMeta);
                expect(section).toBeDefined();
                const data = section.getData();
                expect(data).toBeDefined();
                expect(data.header).toBe(sectionMeta.header);
                expect(data.collapsible).toBe(sectionMeta.collapsible);
                expect(data.uncollapsiblewidgetsNum).toBe(sectionMeta.numUncollapsibleWidgets);
            });
        });

        describe('header', () => {
            it('should create a new header with the correct data', () => {
                const headerMeta = {
                    title: 'Test Card',
                    subTitle: 'This is a test card',
                    imageUrl: 'https://example.com/test_card_image.png',
                    imageStyle: CardService.ImageStyle.SQUARE,
                    imageAltText: 'Test Card Image'
                };
                const header = wrapper.newCardHeader(headerMeta, { isActive: true });
                expect(header).toBeDefined();
                const data = header.getData();
                expect(data).toBeDefined();
                expect(data.title).toBe(headerMeta.title);
                expect(data.subTitle).toBe(`${headerMeta.subTitle}`);
                expect(data.imageUrl).toBe(headerMeta.imageUrl);
                expect(data.imageStyle).toBe(headerMeta.imageStyle);
                expect(data.imageAltText).toBe(headerMeta.imageAltText);
            });
        });

        describe('fixedFooter', () => {
            it('should create a fixed footer with a primary button', () => {
                const footerMeta = {
                    primaryButton: {
                        textButton: {
                            text: 'Submit',
                            onClick: {
                                functionName: 'onSubmit',
                                parameters: {
                                    action: 'submitForm'
                                }
                            }
                        }
                    }
                };
                const fixedFooter = wrapper.newFixedFooter(footerMeta);
                expect(fixedFooter).toBeDefined();
                let data = fixedFooter.getData();
                expect(data).toBeDefined();
                expect(data.primaryButton).toBeDefined();
                const primaryButtonData = data.primaryButton.getData();
                expect(primaryButtonData.textButton.text).toBe(footerMeta.primaryButton.textButton.text);
                expect(primaryButtonData.textButton.onClick.action.actionMethodName).toBe(footerMeta.primaryButton.textButton.onClick.functionName);
                expect(primaryButtonData.textButton.onClick.action.parameters).toEqual(footerMeta.primaryButton.textButton.onClick.parameters);                
            });

            it('should throw an error if primary button is not defined', () => {
                const footerMeta = {
                    // primaryButton is missing
                };
                expect(() => {
                    wrapper.newFixedFooter(footerMeta);
                }).toThrow(CardViewModel.CardServiceWrapper.FIXED_FOOTER_BUTTON_NOT_DEFINED_ERROR);
            });

        });
    });
});