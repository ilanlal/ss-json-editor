// Entity Metadata Configuration Class
class EMD {
    constructor(model = {}) {
        this.model = model;
    }
}

EMD.DEFAULT_IMAGE_URL = 'https://raw.githubusercontent.com/ilanlal/ss-json-editor/main/assets/logo240.png';
EMD.WELCOME_IMG_URL = 'https://raw.githubusercontent.com/ilanlal/basic-telegram-bot-remastered/main/assets/bitmoji-20190109115847.webp';
EMD.HELP_IMG_URL = 'https://raw.githubusercontent.com/ilanlal/basic-telegram-bot-remastered/main/assets/bitmoji-20190109115939.webp';
EMD.ABOUT_IMG_URL = 'https://raw.githubusercontent.com/ilanlal/basic-telegram-bot-remastered/main/assets/bitmoji-20190528070537.webp';
EMD.MATH_IMG_URL = 'https://raw.githubusercontent.com/ilanlal/basic-telegram-bot-remastered/main/assets/bitmoji-20190109115604.webp';
EMD.SUPPORT_IMG_URL = 'https://raw.githubusercontent.com/ilanlal/basic-telegram-bot-remastered/main/assets/bitmoji-20190109120015.webp';
EMD.THANK_YOU_IMG_URL = 'https://raw.githubusercontent.com/ilanlal/basic-telegram-bot-remastered/main/assets/bitmoji-20190109115743.webp';
EMD.YOU_GOT_IT_IMG_URL = 'https://raw.githubusercontent.com/ilanlal/basic-telegram-bot-remastered/main/assets/bitmoji-20190528070739.webp';
EMD.BIG_TIME_IMG_URL = 'https://raw.githubusercontent.com/ilanlal/basic-telegram-bot-remastered/main/assets/bitmoji-20190528070720.webp';
EMD.PEACH_IMG_URL = 'https://raw.githubusercontent.com/ilanlal/basic-telegram-bot-remastered/main/assets/bitmoji-20190109115654.webp';
EMD.HAVE_A_NICE_DAY_IMG_URL = 'https://raw.githubusercontent.com/ilanlal/basic-telegram-bot-remastered/main/assets/bitmoji-20190528070956.webp';
EMD.I_AM_THINKING_IMG_URL = 'https://raw.githubusercontent.com/ilanlal/basic-telegram-bot-remastered/main/assets/bitmoji-20190109115627.webp';
EMD.WAIT_FOR_IT_IMG_URL = 'https://raw.githubusercontent.com/ilanlal/basic-telegram-bot-remastered/main/assets/bitmoji-20190528070537.webp';
EMD.YES_IMG_URL = 'https://raw.githubusercontent.com/ilanlal/basic-telegram-bot-remastered/main/assets/bitmoji-20190528070629.webp';
EMD.PAY_ATTENTION_IMG_URL = 'https://raw.githubusercontent.com/ilanlal/basic-telegram-bot-remastered/main/assets/bitmoji-20190528070905.webp';
EMD.KISS_IMG_URL = 'https://raw.githubusercontent.com/ilanlal/basic-telegram-bot-remastered/main/assets/bitmoji-20190109115813.webp';
EMD.CHEERS_IMG_URL = 'https://raw.githubusercontent.com/ilanlal/basic-telegram-bot-remastered/main/assets/bitmoji-20190109115847.webp';
EMD.BLINK_IMG_URL = 'https://raw.githubusercontent.com/ilanlal/basic-telegram-bot-remastered/main/assets/bitmoji-20190109115905.webp';
EMD.LOGO_PNG_URL = 'https://raw.githubusercontent.com/ilanlal/ss-json-editor/main/assets/logo240.png';
EMD.GIT_REPO_URL = 'https://github.com/ilanlal/ss-json-editor';

EMD.Home = {
    entityName: 'Home',
    card: (data = {}) => {
        return {
            name: 'homeCard',
            header:
            {
                title: '🏠 Welcome to Json Studio',
                subTitle: 'Formatted JSON in Google Sheets™',
                imageUrl: EMD.DEFAULT_IMAGE_URL,
                imageStyle: CardService.ImageStyle.SQUARE,
                imageAltText: 'Home Image'
            },
            sections: [
                {   // Prettified JSON.
                    //header: 'Prettified JSON.',
                    collapsible: true,
                    numUncollapsibleWidgets: 1,
                    widgets: [
                        {   // Prettified JSON widget
                            id: 'prettified_json_widget',
                            DecoratedText: {
                                bottomLabel: 'Select a range of cells containing JSON data and click the \'🖌️ Format\' button to prettify the JSON.',
                                text: 'Prettified JSON.',
                                wrapText: false,
                                textButton: {
                                    disabled: false,
                                    text: '🖌️ Format',
                                    onClick: {
                                        functionName: 'EntityHandler.Addon.onOpenCardClick',
                                        parameters: {
                                            entityName: 'EnvironmentVariables'
                                        }
                                    }
                                }
                            }
                        },
                        {   // indentation spaces widget pre set info
                            id: 'indentation_spaces_info',
                            TextParagraph: {
                                text: `Current Indentation Spaces: ${data?.indentationSpaces || 2}`
                            }
                        },
                        {   // indentation spaces widget
                            id: 'indentation_spaces_widget',
                            TextInput: {
                                title: 'Set Indentation Spaces',
                                fieldName: 'txt_indentation_spaces',
                                hint: 'Enter number of spaces for indentation (e.g., 2)',
                                value: data?.indentationSpaces?.toString() || '2'
                            }
                        }
                    ]
                },
                {   // Minified JSON.
                    // header: 'Minified JSON.',
                    collapsible: false,
                    numUncollapsibleWidgets: 0,
                    widgets: [
                        {   // Minified JSON widget
                            id: 'minified_json_widget',
                            DecoratedText: {
                                text: 'Minified JSON.',
                                bottomLabel: 'Select a range of cells containing JSON data and click the \'🗜️ Minify\' button to minify the JSON.',
                                wrapText: false,
                                textButton: {
                                    disabled: false,
                                    text: '🗜️ Minify',
                                    onClick: {
                                        functionName: 'EntityHandler.Addon.onOpenCardClick',
                                        parameters: {
                                            entityName: 'EnvironmentVariables'
                                        }
                                    }
                                }
                            }
                        }
                    ]
                },
                { // Data view
                    header: 'Data View',
                    collapsible: true,
                    numUncollapsibleWidgets: 0,
                    widgets: [
                        {   // Data View widget
                            id: 'data_view_widget',
                            TextParagraph: {
                                text: `Data: ${JSON.stringify(data, null, 2)}`,
                                maxLines: 35
                            }
                        }
                    ]
                }
            ]
        };
    }
}

EMD.About = {
    entityName: 'About',
    card: (data = {}) => {
        return {
            name: 'about_Card',
            header: {
                title: 'About This Addon',
                subTitle: 'Learn more about this Addon.',
                imageUrl: EMD.I_AM_THINKING_IMG_URL,
                imageStyle: CardService.ImageStyle.SQUARE,
                imageAltText: 'About Image'
            },
            sections: [
                {
                    // header: 'About This Addon',
                    widgets: [
                        {
                            id: 'about_text_paragraph',
                            TextParagraph: {
                                text: 'This addon is designed to help you manage your tasks efficiently.'
                            }
                        },
                        { // Version Info widget
                            id: 'version_info_widget',
                            TextParagraph: {
                                text: `Version: ${data.packageInfo?.version || 'N/A'} (Build: ${data.packageInfo?.build || 'N/A'})`
                            }
                        }
                    ]
                },
                {   // Data view
                    header: 'Data View',
                    collapsible: true,
                    numUncollapsibleWidgets: 0,
                    widgets: [
                        {   // Data View widget
                            id: 'data_view_widget',
                            TextParagraph: {
                                text: `Data: ${JSON.stringify(data, null, 2)}`,
                                maxLines: 35
                            }
                        }
                    ]
                }
            ]
        };
    }
}

EMD.Help = {
    entityName: 'Help',
    card: (data = {}) => {
        return {
            name: 'help_Card',
            header: {
                title: 'Help & Support',
                subTitle: 'Get help and support for this Addon.',
                imageUrl: EMD.HELP_IMG_URL,
                imageStyle: CardService.ImageStyle.SQUARE,
                imageAltText: 'Help Image'
            },
            sections: [
                {   // Help Information
                    widgets: [
                        {   // Help text paragraph
                            id: 'help_text_paragraph',
                            TextParagraph: {
                                text: 'If you need assistance, please contact our support team or visit our help center.'
                            }
                        }
                    ]
                },
                {   // View Help Sheets
                    header: 'Help Sheets',
                    collapsible: false,
                    numUncollapsibleWidgets: 0,
                    widgets: [
                        {   // View Help Sheets with sample data widget
                            id: 'view_help_sheets_widget',
                            DecoratedText: {
                                text: 'Need Assistance?',
                                bottomLabel: 'Click the \'📄 Sample\' button to view help sheets with sample data.',
                                wrapText: false,
                                textButton: {
                                    text: '📄 Sample',
                                    disabled: false,
                                    onClick: {
                                        functionName: 'SpreadsheetHandler.Addon.onInsertSampleDataClick',
                                        parameters: {
                                            sheet: 'EMD.Spreadsheet.Help',
                                        }
                                    }
                                }
                            }
                        }
                    ]
                },
                {   // Data view
                    header: 'Data View',
                    collapsible: true,
                    numUncollapsibleWidgets: 0,
                    widgets: [
                        {   // Data View widget
                            id: 'data_view_widget',
                            TextParagraph: {
                                text: `Data: ${JSON.stringify(data, null, 2)}`,
                                maxLines: 35
                            }
                        }
                    ]
                }
            ]
        };
    },
    sheet: (data = {}) => {
        return {
            name: '📄 Help Sheet',
            columns: ['Topic', 'Description', 'Link'],
            sample_data: [
                ['Getting Started', 'Learn how to use the addon.', 'https://example.com/getting-started'],
                ['FAQ', 'Frequently Asked Questions.', 'https://example.com/faq'],
                ['Contact Support', 'Get in touch with our support team.', 'https://example.com/contact-support']
            ]
        };
    }
}

EMD.Account = {
    entityName: 'Account',
    card: (data = {}) => {
        return {
            name: 'account_Card',
            header: {
                title: 'Account Management',
                subTitle: 'Manage your account settings and preferences.',
                imageUrl: EMD.BLINK_IMG_URL,
                imageStyle: CardService.ImageStyle.SQUARE,
                imageAltText: 'Account Image'
            },
            sections: [
                {
                    // header: 'Account Management',
                    widgets: [
                        {
                            id: 'account_text_paragraph',
                            TextParagraph: {
                                text: 'Manage your account settings and preferences here.'
                            }
                        },
                        { // user Info widget
                            id: 'user_info_widget',
                            TextParagraph: {
                                text: `User is ${data.userInfo?.isPremium ? 'a Premium' : 'a Free'} user.`
                            }
                        }
                    ]
                },
                {   // Data view
                    header: 'Data View',
                    collapsible: true,
                    numUncollapsibleWidgets: 0,
                    widgets: [
                        {   // Data View widget
                            id: 'data_view_widget',
                            TextParagraph: {
                                text: `Data: ${JSON.stringify(data, null, 2)}`,
                                maxLines: 35
                            }
                        }
                    ]
                }
            ]
        };
    }
}

EMD.Logger = {
    entityName: 'eventLog',
    sheet: (data = {}) => {
        return {
            name: '📜 Event Log',
            columns: ['Created On', 'DC', 'Action', 'chat_id', 'content', 'event'],
            sample_data: []
        };
    }
}

EMD.CardSample = {
    entityName: 'CardSample',
    card: (data = {}) => {
        return {
            name: `${data.cardName || 'rootCard'}`,
            header: {
                title: `${data.cardName || 'Sample'} Card`,
                subTitle: `Time: ${new Date().toLocaleString()}`,
                imageUrl: EMD.MATH_IMG_URL,
                imageStyle: CardService.ImageStyle.SQUARE,
                imageAltText: 'Sample Image'
            },
            sections: [
                {
                    // header: 'Sample Card Section',
                    widgets: [
                        {
                            id: 'sample_card_text_paragraph',
                            TextParagraph: {
                                text: 'This is a sample card that has been pushed onto the card stack. You can navigate back to the previous card using the back button.'
                            }
                        }
                    ]
                },
                {   // Card operations section
                    header: 'Card Operations',
                    collapsible: true,
                    numUncollapsibleWidgets: 2,
                    widgets: [
                        {   // TextParagraph widget
                            id: 'card_operations_text_paragraph',
                            TextParagraph: {
                                text: 'Use the buttons below to demonstrate card operations like popping to root or opening a new card.'
                            }
                        },
                        {   // TextButton to open a new card
                            id: 'open_new_card_button',
                            TextButton: {
                                text: '🆕 Open New Card',
                                onClick: {
                                    functionName: 'NavigationHandler.ViewModel.onPushCardClick',
                                    parameters: { template: 'EMD.Cards.CardSample', cardName: 'cardB' }
                                }
                            }
                        },
                        {   // TextButton to pop to root card
                            id: 'pop_to_root_card_button',
                            TextButton: {
                                text: '⬆️ Pop to Root Card',
                                onClick: {
                                    functionName: 'NavigationHandler.ViewModel.onPopToRootCardClick'
                                }
                            }
                        },
                        {   // TextButton to update current card
                            id: 'update_current_card_button',
                            TextButton: {
                                text: '♻️ Update Current Card',
                                onClick: {
                                    functionName: 'NavigationHandler.ViewModel.onUpdateCardClick',
                                    parameters: { template: 'EMD.Cards.CardSample', cardName: 'updatedCard' }
                                }
                            }
                        },
                        {   // TextButton to pop to named card
                            id: 'pop_to_named_card_button',
                            TextButton: {
                                text: '🔙 Pop to Named Card (Home)',
                                onClick: {
                                    functionName: 'NavigationHandler.ViewModel.onPopToNamedCardClick',
                                    parameters: { cardName: 'EMD.Cards.Home' }
                                }
                            }
                        }
                    ]
                },
                {   // TextButton to show terminal output sheet with welcome message
                    collapsible: false,
                    numUncollapsibleWidgets: 0,
                    widgets: [
                        {  // Welcome widget
                            id: 'welcome_text_paragraph',
                            TextParagraph: {
                                text: 'Welcome to the Addon! Use the menu to navigate through different sections.'
                            }
                        },
                        {  // DecoratedText with TextButton to show terminal output sheet
                            id: 'show_terminal_output_button',
                            DecoratedText: {
                                text: '💻 Terminal Output',
                                bottomLabel: 'View the terminal output log sheet',
                                wrapText: false,
                                textButton: {
                                    disabled: false,
                                    text: '💻',
                                    onClick: {
                                        functionName: 'SpreadsheetHandler.Addon.onInsertSampleDataClick',
                                        parameters: { sheet: 'EMD.Spreadsheet.TerminalOutput' }
                                    }
                                }
                            }
                        },
                        {  // DecoratedText with TextButton to push 'Help' card
                            id: 'basic_bot_operation_button',
                            DecoratedText: {
                                text: '❓ Need Help?',
                                bottomLabel: 'Click \'❓\' to open the Help card',
                                wrapText: false,
                                textButton: {
                                    disabled: false,
                                    text: '❓',
                                    onClick: {
                                        functionName: 'NavigationHandler.ViewModel.onPushCardClick',
                                        parameters: { template: 'EMD.Cards.Help', cardName: 'Help' }
                                    }
                                }
                            }
                        }
                    ]
                },
                {   // Demonstration navigation features section
                    header: 'EMD.Cards Demonstration',
                    collapsible: true,
                    numUncollapsibleWidgets: 0,
                    widgets: [
                        {   // TextParagraph widget
                            id: 'card_handler_demo_text_paragraph',
                            TextParagraph: {
                                text: 'This section demonstrates various features including input widgets and data views.'
                            }
                        },
                        {   // DecoratedText with TextButton to push 'Sample' card
                            id: 'about_card_button',
                            DecoratedText: {
                                text: 'Push Card',
                                bottomLabel: 'Click \'➡️\' to push Sample card onto the stack',
                                wrapText: false,
                                textButton: {
                                    disabled: false,
                                    text: '➡️',
                                    onClick: {
                                        functionName: 'NavigationHandler.ViewModel.onPushCardClick',
                                        parameters: { template: 'EMD.Cards.Sample', cardName: 'Sample' }
                                    }
                                }
                            }
                        }
                    ]
                },
                {   // Demonstration collapsible section with various input widgets
                    header: 'Text Input Samples',
                    collapsible: true,
                    numUncollapsibleWidgets: 2,
                    widgets: [
                        {
                            id: 'demo_text_paragraph',
                            TextParagraph: {
                                text: 'This is a demonstration collapsible section to showcase how to structure cards and sections in your Addon.'
                            }
                        },
                        {   // TextInput sample with rich text input mode and text validation
                            id: 'sample_text_input_widget',
                            TextInput: {
                                title: 'Sample Text Input with RICH_TEXT Mode and Validation on Text',
                                fieldName: 'sample_text_input',
                                hint: 'Enter some text here',
                                multiline: false,
                                // inputMode (CardService.TextInputMode.PLAIN_TEXT || CardService.TextInputMode.RICH_TEXT)
                                inputMode: CardService.TextInputMode.RICH_TEXT,
                                validation: {
                                    characterLimit: '150',
                                    // InputType.INTEGER || InputType.EMAIL || InputType.FLOAT || InputType.TEXT
                                    type: CardService.InputType.TEXT
                                },
                                value: data.sampleTextInputValue || ''
                            }
                        },
                        {   // TextInput sample with plain text input mode and INTEGER validation, character limit 3
                            id: 'sample_integer_input_widget',
                            TextInput: {
                                title: 'Sample Integer Input with PLAIN_TEXT Mode and Validation on Integer, Character Limit 3',
                                fieldName: 'sample_integer_input',
                                hint: 'Enter an integer value here',
                                multiline: false,
                                // inputMode (CardService.TextInputMode.PLAIN_TEXT || CardService.TextInputMode.RICH_TEXT)
                                inputMode: CardService.TextInputMode.PLAIN_TEXT,
                                validation: {
                                    characterLimit: '3',
                                    // InputType.INTEGER || InputType.EMAIL || InputType.FLOAT || InputType.TEXT
                                    type: CardService.InputType.INTEGER
                                },
                                value: data.sampleIntegerInputValue || ''
                            }
                        },
                        {   // TextInput sample with plain text input mode and FLOAT validation, character limit 7
                            id: 'sample_float_input_widget',
                            TextInput: {
                                title: 'Sample Float Input with PLAIN_TEXT Mode and Validation on Float, Character Limit 7',
                                fieldName: 'sample_float_input',
                                hint: 'Enter a float value here',
                                multiline: false,
                                // inputMode (CardService.TextInputMode.PLAIN_TEXT || CardService.TextInputMode.RICH_TEXT)
                                inputMode: CardService.TextInputMode.PLAIN_TEXT,
                                validation: {
                                    characterLimit: '7',
                                    // InputType.INTEGER || InputType.EMAIL || InputType.FLOAT || InputType.TEXT
                                    type: CardService.InputType.FLOAT
                                },
                                value: data.sampleFloatInputValue || ''
                            }
                        }
                    ]

                },
                {   // Data view
                    header: 'Data View',
                    collapsible: true,
                    numUncollapsibleWidgets: 0,
                    widgets: [
                        {   // Data View widget
                            id: 'data_view_widget',
                            TextParagraph: {
                                text: `Data: ${JSON.stringify(data, null, 2)}`,
                                maxLines: 35
                            }
                        }
                    ]
                }
            ]
        };
    }
}

EMD.Cards = {
    Home: EMD.Home.card,
    Account: EMD.Account.card,
    Help: EMD.Help.card,
    About: EMD.About.card,
    CardSample: EMD.CardSample.card
};

EMD.Spreadsheet = {
    Logger: EMD.Logger.sheet
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EMD };
}