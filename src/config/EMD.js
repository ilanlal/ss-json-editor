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

EMD.Cards = {
    Home: EMD.Home.card,
    Account: EMD.Account.card,
    Help: EMD.Help.card,
    About: EMD.About.card
};

EMD.Spreadsheet = {
    Logger: EMD.Logger.sheet
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EMD };
}