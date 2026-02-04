// src/Addon.js
class Addon {
    static primaryColor() {
        return '#88001b'; // Matching the primary color from appsscript.json
    }

    static secondaryColor() {
        return '#1010ff'; // Matching the secondary color from appsscript.json
    }

    static accentColor() {
        return '#f4b400';
    }
};

Addon.Media = {
    DEFAULT_IMAGE_URL: 'https://raw.githubusercontent.com/ilanlal/ss-json-editor/refs/heads/main/assets/logo24.png',
    WELCOME_IMG_URL: 'https://raw.githubusercontent.com/ilanlal/ss-json-editor/refs/heads/main/assets/logo24.png',
    YOU_GOT_IT_IMG_URL: 'https://raw.githubusercontent.com/ilanlal/telegram-bot-studio/main/assets/bitmoji-you-got-it.webp',
    BIG_TIME_IMG_URL: 'https://raw.githubusercontent.com/ilanlal/telegram-bot-studio/main/assets/bitmoji-big-time.webp',
    I_AM_THINKING_IMG_URL: 'https://raw.githubusercontent.com/ilanlal/telegram-bot-studio/main/assets/bitmoji-i-am-thinking.webp',
    YES_IMG_URL: 'https://raw.githubusercontent.com/ilanlal/telegram-bot-studio/main/assets/bitmoji-yes.webp',
    PAY_ATTENTION_IMG_URL: 'https://raw.githubusercontent.com/ilanlal/telegram-bot-studio/main/assets/bitmoji-pay-attention.webp',
    LOGO_PNG_URL: 'https://raw.githubusercontent.com/ilanlal/ss-json-editor/refs/heads/main/assets/logo24.png'
};

Addon.Package = {
    name: 'Json Studio',
    short_description: 'JSON editing tools for Sheets',
    description: 'A comprehensive tool for parsing, formatting, and managing JSON data directly within Google Sheets. Enhance your productivity with easy-to-use JSON editing features.',
    version: '1.0.0',
    build: '20260202.01190',
    author: 'Ilan Laloum',
    license: 'MIT',
    imageUrl: Addon.Media.LOGO_PNG_URL,
    gitRepository: 'https://github.com/ilanlal/ss-json-editor'
};

Addon.Modules = {
    App: {
        get MEMBERSHIP_PROPERTY_KEY() {
            return 'membership';
        },
        getData() {
            const rawData = PropertiesService.getUserProperties().getProperty(Addon.Modules.App.MEMBERSHIP_PROPERTY_KEY);
            const membershipInfo = rawData ? JSON.parse(rawData) : {};
            const expiresAt = membershipInfo.expiresAt ? new Date(membershipInfo.expiresAt) : null;
            const balance = membershipInfo.balance || 0;
            const isPremium = (expiresAt && expiresAt > new Date()) || balance > 0;
            const indentationSpaces = PropertiesService.getUserProperties().getProperty('indentation_spaces') || '2';
            const showErrorsSwitch = PropertiesService.getUserProperties().getProperty('show_errors_switch') || 'ON';

            return {
                indentationSpaces: parseInt(indentationSpaces, 10),
                showErrorsSwitch: showErrorsSwitch === 'ON',
                // Membership Info
                isPremium: isPremium,
                balance: balance,
                expiresAt: expiresAt,
                // Package Info
                version: Addon.Package.version,
                build: Addon.Package.build,
                author: Addon.Package.author,
                license: Addon.Package.license,
                gitRepository: Addon.Package.gitRepository
            };
        }
    },
    Sheet: {
        INVALID_MODEL_ERROR: 'Sheet model must have a valid name property',
        DUMP_SHEET_NAME: 'JSON Tools Report',

        initializeSheet(activeSpreadsheet, sheetMeta = {}) {
            if (!sheetMeta.name) {
                throw new Error(Addon.Modules.Sheet.INVALID_MODEL_ERROR);
            }

            let sheet = activeSpreadsheet.getSheetByName(sheetMeta.name);
            if (!sheet) {
                sheet = activeSpreadsheet.insertSheet(sheetMeta.name);

                if ((sheetMeta.columns || []).length > 0) {
                    sheet.appendRow(sheetMeta.columns);
                }
            }

            return sheet;
        },

        setActiveSheet(activeSpreadsheet, sheetMeta = {}) {
            return activeSpreadsheet
                .setActiveSheet(this.getSheet(activeSpreadsheet, sheetMeta));
        },

        getSheet(activeSpreadsheet, sheetMeta = {}) {
            return this._sheet = this.initializeSheet(activeSpreadsheet, sheetMeta);
        },

        bindSheetSampleData(activeSpreadsheet, sheetMeta = {}) {
            const sampleData = sheetMeta.sample_data || [];
            if (sampleData.length === 0) {
                return;
            }

            const sheet = this.getSheet(activeSpreadsheet, sheetMeta);
            const existingValues = sheet.getDataRange().getValues() || [];

            // merge existing values with sample data (existing values first)
            const mergedValues = existingValues.concat(sampleData);

            // pad rows to match columns length
            const columnsLength = (sheetMeta.columns || []).length;
            for (let row = 0; row < mergedValues.length; row++) {
                while (mergedValues[row].length < columnsLength) {
                    mergedValues[row].push('');
                }
            }

            // set the merged values back to the sheet
            sheet.getRange(1, 1, mergedValues.length, mergedValues[0].length)
                .setValues(mergedValues);

            return sheet;
        },

        dumpObjectToSheet(activeSpreadsheet, range = 'A1', report = []) {
            const sheetMeta = {
                name: Addon.Modules.Sheet.DUMP_SHEET_NAME,
                columns: ['Index', 'Range', 'Cell', 'Error', 'Details']
            };

            const sheet = this.getSheet(activeSpreadsheet, sheetMeta);

            report.forEach((item, index) => {
                const row = [
                    index,
                    range,
                    item.cell || '',
                    item.error || '',
                    JSON.stringify(report)];

                sheet.appendRow(row);
            });

            return sheet;
        }
    },
    TerminalOutput: class {
        static get SHEET_META() {
            return {
                name: '💻 Terminal Output',
                columns: ['Timestamp', 'Source', 'Message', 'Event Object', 'More Info']
            };
        }

        static write(
            activeSpreadsheet, source, message, e, param1, param2, param3) {

            // Check if terminal output is enabled
            const terminalOutputEnabled = PropertiesService.getUserProperties()
                .getProperty('terminal_output_switch') || 'OFF';

            // Check if terminal output is enabled
            const focusTerminalOutput = PropertiesService.getUserProperties()
                .getProperty('focus_terminal_output') || 'OFF';

            if (terminalOutputEnabled !== 'ON') {
                return;
            }

            const sheet = Addon.Modules.Sheet
                .getSheet(activeSpreadsheet, Addon.Modules.TerminalOutput.SHEET_META);

            sheet.appendRow([
                // Created On as iso string
                new Date().toISOString(),
                // source
                source, // chat side
                // Message
                (typeof message === 'object' || Array.isArray(message)) ? JSON.stringify(message) : String(message || ''),
                // Event Object
                (typeof e === 'object' || Array.isArray(e)) ? JSON.stringify(e) : String(e || ''),
                // Details 
                (typeof param1 === 'object' || Array.isArray(param1)) ? JSON.stringify(param1) : String(param1 || ''),
                (typeof param2 === 'object' || Array.isArray(param2)) ? JSON.stringify(param2) : String(param2 || ''),
                (typeof param3 === 'object' || Array.isArray(param3)) ? JSON.stringify(param3) : String(param3 || '')
            ]);

            // Focus the last row if enabled
            if (focusTerminalOutput !== 'ON') {
                return sheet;
            }

            // Set active selection to the last row
            const lastRow = sheet.getLastRow();
            const lastRowA1Notation = `A${lastRow}:G${lastRow}`;
            sheet.setActiveSelection(lastRowA1Notation);
            return sheet;
        }
    },
    JsonStudio: class {
        static beautifyActiveRange(activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()) {
            const indent = PropertiesService.getUserProperties().getProperty('indentation_spaces') || '2';
            const activeRange = activeSpreadsheet.getActiveSheet().getActiveRange();
            const indentationLevel = parseInt(indent, 10);
            const report = [];

            // for each cell in range, beautify JSON
            activeRange.getValues().forEach((row, i) => {
                row.forEach((cell, j) => {
                    try {
                        // if cell is empty after cleaning, skip
                        if (this.trimValue(cell) === '') {
                            return; // Skip empty cells
                        }
                        const beautifiedJson = JSON.stringify(
                            JSON.parse(cell),
                            null,
                            indentationLevel
                        );
                        activeRange.getCell(i + 1, j + 1).setValue(beautifiedJson);
                    } catch (error) {
                        // Handle JSON parsing error if needed
                        report.push({
                            cell: activeRange.getCell(i + 1, j + 1).getA1Notation(),
                            error: error.message
                        });
                    }
                });
            });

            return { range: activeRange, report };
        }

        static minifyActiveRange(activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()) {
            const activeRange = activeSpreadsheet.getActiveSheet().getActiveRange();
            const report = [];
            // for each cell in range, minify JSON
            activeRange.getValues().forEach((row, i) => {
                row.forEach((cell, j) => {
                    try {
                        // if cell is empty after cleaning, skip
                        if (this.trimValue(cell) === '') {
                            return; // Skip empty cells
                        }
                        const minifiedJson = JSON.stringify(JSON.parse(cell));
                        activeRange.getCell(i + 1, j + 1).setValue(minifiedJson);
                    } catch (error) {
                        // Handle JSON parsing error if needed
                        report.push({
                            cell: activeRange.getCell(i + 1, j + 1).getA1Notation(),
                            error: error.message
                        });
                    }
                });
            });

            return { range: activeRange, report };
        }

        static validateActiveRange(activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()) {
            const activeRange = activeSpreadsheet.getActiveSheet().getActiveRange();
            const report = [];
            // for each cell in range, validate JSON
            activeRange.getValues().forEach((row, i) => {
                row.forEach((cell, j) => {
                    try {
                        // if cell is empty after cleaning, skip
                        if (this.trimValue(cell) === '') {
                            return; // Skip empty cells
                        }
                        JSON.parse(cell);
                    } catch (error) {
                        report.push({
                            cell: activeRange.getCell(i + 1, j + 1).getA1Notation(),
                            error: error.message
                        });
                    }
                });
            });

            return { range: activeRange, report };
        }

        static trimValue(value) {
            if (typeof value === 'string') {
                return value.trim();
            }
            return value;
        }
    }
};

Addon.Home = {
    id: 'HomeAddon',
    name: 'Json Studio',
    short_description: 'JSON editing tools for Sheets',
    description: 'A collection of tools for editing and managing JSON data in Google Sheets.',
    version: '1.0.0',
    Controller: {
        Load: (e) => {
            // Build and return the Home Card
            const appModelData = Addon.Modules.App.getData();

            // Build and return the Home Card
            const homeCard = Addon.Home.View.HomeCard({ ...appModelData });

            let cardNavigation = null;
            if (e.parameters && e.parameters.refresh === 'true') {
                cardNavigation = CardService.newNavigation()
                    .updateCard(homeCard);
            } else {
                cardNavigation = CardService.newNavigation()
                    .pushCard(homeCard);
            }

            // Return action response to update card
            return CardService.newActionResponseBuilder()
                .setNavigation(cardNavigation)
                .build();
        },
        About: (e) => {
            // Build and return the About Card
            const appModelData = Addon.Modules.App.getData();
            return CardService.newActionResponseBuilder()
                .setNavigation(
                    CardService.newNavigation()
                        .pushCard(Addon.Home.View.AboutCard({ ...appModelData }))
                ).build();
        },
        Help: (e) => {
            // Build and return the Help Card
            const appModelData = Addon.Modules.App.getData();
            return CardService.newActionResponseBuilder()
                .setNavigation(
                    CardService.newNavigation()
                        .pushCard(Addon.Home.View.HelpCard({ ...appModelData }))
                ).build();
        },
        Beautify: (e) => {
            try {
                const showResultCard = PropertiesService.getUserProperties().getProperty('show_errors_switch');
                const result = Addon.Modules.JsonStudio.beautifyActiveRange();
                if (showResultCard !== 'ON') {
                    return CardService.newActionResponseBuilder()
                        .setNotification(
                            CardService.newNotification()
                                .setText('Completed!' + (result.report.length > 0 ? ` ${result.report.length} error(s) found.` : ' successfully.')))
                        .build();
                }
                // Build and return the result card
                return CardService.newActionResponseBuilder()
                    .setNavigation(
                        CardService.newNavigation()
                            .pushCard(
                                Addon.ResultWidget.View
                                    .BuildResultCard(result))
                    ).build();
            }
            catch (error) {
                return CardService.newActionResponseBuilder()
                    .setNotification(
                        CardService.newNotification()
                            .setText(`Error during Beautify: ${error.message}`))
                    .build();
            }
        },
        Minify: (e) => {
            try {
                const showResultCard = PropertiesService.getUserProperties().getProperty('show_errors_switch');
                const result = Addon.Modules.JsonStudio.minifyActiveRange();
                if (showResultCard !== 'ON') {
                    return CardService.newActionResponseBuilder()
                        .setNotification(
                            CardService.newNotification()
                                .setText('Completed!' + (result.report.length > 0 ? ` ${result.report.length} error(s) found.` : ' successfully.')))
                        .build();
                }
                // Build and return the result card
                return CardService.newActionResponseBuilder()
                    .setNavigation(
                        CardService.newNavigation()
                            .pushCard(
                                Addon.ResultWidget.View
                                    .BuildResultCard(result))
                    ).build();
            }
            catch (error) {
                return CardService.newActionResponseBuilder()
                    .setNotification(
                        CardService.newNotification()
                            .setText(`Error during Minify: ${error.message}`))
                    .build();
            }
        },
        Validate: (e) => {
            // Implement validate logic
            try {
                const showResultCard = PropertiesService.getUserProperties().getProperty('show_errors_switch');
                const result = Addon.Modules.JsonStudio.validateActiveRange();
                if (showResultCard !== 'ON') {
                    return CardService.newActionResponseBuilder()
                        .setNotification(
                            CardService.newNotification()
                                .setText('Completed!' + (result.report.length > 0 ? ` ${result.report.length} error(s) found.` : ' successfully.')))
                        .build();
                }
                // Build and return the result card
                return CardService.newActionResponseBuilder()
                    .setNavigation(
                        CardService.newNavigation()
                            .pushCard(
                                Addon.ResultWidget.View
                                    .BuildResultCard(result))
                    ).build();
            }
            catch (error) {
                return CardService.newActionResponseBuilder()
                    .setNotification(
                        CardService.newNotification()
                            .setText(`Error during Validate: ${error.message}`))
                    .build();
            }
        }
    },
    View: {
        HomeCard: (data = {}) => {
            const cardBuilder = CardService.newCardBuilder()
                .setName(Addon.Home.id + '-Home')
                .setHeader(CardService.newCardHeader()
                    .setTitle(Addon.Package.name)
                    .setSubtitle(Addon.Package.short_description)
                    .setImageStyle(CardService.ImageStyle.SQUARE)
                    .setImageUrl(Addon.Package.imageUrl)
                    .setImageAltText('Json Studio Logo'));

            // 1. Main Plugin Hub - Professional Grid-like feel
            const pluginHub = CardService.newCardSection()
                .setHeader('🛠️ Available Tools')
                .setCollapsible(false);

            // Add a tool - Beautify JSON
            const beautifyJson = CardService.newDecoratedText()
                .setText('🪄 Beautify JSON')
                .setBottomLabel('Edit and manage your JSON data with ease.')
                .setStartIcon(
                    CardService.newIconImage()
                        .setIconUrl(Addon.Package.imageUrl))
                .setWrapText(true)
                .setButton(
                    CardService.newTextButton()
                        .setText('Beautify JSON')
                        .setOnClickAction(
                            CardService.newAction()
                                .setFunctionName(`Addon.Home.Controller.Beautify`)
                        )
                );

            pluginHub.addWidget(beautifyJson);

            // Add another tool - Minify JSON
            const minifyJson = CardService.newDecoratedText()
                .setText('🗜️ Minify JSON')
                .setBottomLabel('Compress your JSON data for efficient storage.')
                .setStartIcon(
                    CardService.newIconImage()
                        .setIconUrl(Addon.Package.imageUrl))
                .setWrapText(true)
                .setButton(
                    CardService.newTextButton()
                        .setText('Minify JSON')
                        .setOnClickAction(
                            CardService.newAction()
                                .setFunctionName(`Addon.Home.Controller.Minify`)
                        )
                );

            pluginHub.addWidget(minifyJson);

            // Add another tool - Validate JSON
            const validateJson = CardService.newDecoratedText()
                .setText('✅ Validate JSON')
                .setBottomLabel('Check your JSON data for errors.')
                .setStartIcon(
                    CardService.newIconImage()
                        .setIconUrl(Addon.Package.imageUrl))
                .setWrapText(true)
                .setButton(
                    CardService.newTextButton()
                        .setText('Validate JSON')
                        .setOnClickAction(
                            CardService.newAction()
                                .setFunctionName(`Addon.Home.Controller.Validate`)
                        )
                );

            pluginHub.addWidget(validateJson);

            cardBuilder.addSection(pluginHub);

            // 2. System Quick Actions (Professional Footer Section)
            cardBuilder.addSection(CardService.newCardSection()
                .setHeader('⚙️ Quick Access')
                .setCollapsible(true)
                .addWidget(CardService.newButtonSet()
                    .addButton(CardService.newTextButton()
                        .setText('Settings')
                        .setOnClickAction(CardService.newAction()
                            .setFunctionName('Addon.Settings.Controller.Load')))
                    .addButton(CardService.newTextButton()
                        .setText('Help')
                        .setOnClickAction(CardService.newAction()
                            .setFunctionName('Addon.Home.Controller.Help')))
                    .addButton(CardService.newTextButton()
                        .setText('About')
                        .setOnClickAction(CardService.newAction()
                            .setFunctionName('Addon.Home.Controller.About')))
                ));

            // 3. Premium Call-to-Action (Only if not premium)
            if (!data.isPremium) {
                const premiumSection = CardService.newCardSection()
                    .addWidget(CardService.newDecoratedText()
                        .setTopLabel('Premium Status')
                        .setText('Free Membership')
                        .setStartIcon(CardService.newIconImage().setMaterialIcon(
                            CardService.newMaterialIcon().setName('workspace_premium')))
                        .setBottomLabel('Upgrade to unlock advanced JSON tools.'));

                cardBuilder.addSection(premiumSection);

                cardBuilder.setFixedFooter(CardService.newFixedFooter()
                    .setPrimaryButton(CardService.newTextButton()
                        .setText('💎 Upgrade to Premium')
                        .setBackgroundColor(Addon.primaryColor())
                        .setOnClickAction(CardService.newAction()
                            .setFunctionName('Addon.UserProfile.Controller.Load'))));
            }

            return cardBuilder.build();
        },
        AboutCard: (data = {}) => {
            const cardBuilder = CardService.newCardBuilder()
                .setName(Addon.Home.id + '-About')
                .setHeader(CardService.newCardHeader()
                    .setTitle('About ' + Addon.Package.name)
                    .setSubtitle(Addon.Package.short_description)
                    .setImageStyle(CardService.ImageStyle.SQUARE)
                    .setImageUrl(Addon.Media.BIG_TIME_IMG_URL)
                    .setImageAltText('Card Image'))
                .addSection(
                    CardService.newCardSection()
                        .setHeader('App Information')
                        .addWidget(
                            CardService.newTextParagraph()
                                .setText(`Name: ${Addon.Package.name}`))
                        .addWidget(
                            CardService.newTextParagraph()
                                .setText(`Version: ${Addon.Package.version}`))
                        .addWidget(
                            CardService.newTextParagraph()
                                .setText(`Build: ${Addon.Package.build}`))
                        .addWidget(
                            CardService.newTextParagraph()
                                .setText(`Description: ${Addon.Package.description}`))
                        .addWidget(
                            CardService.newTextParagraph()
                                .setText(`Developed by Easy ADM (https://easyadm.com).`)));

            // Add useful links section
            cardBuilder.addSection(
                CardService.newCardSection()
                    .setHeader('🔗 Useful Links')
                    .addWidget(
                        CardService.newTextButton()
                            .setText('📄 Documentation')
                            .setOpenLink(
                                CardService.newOpenLink()
                                    .setUrl(`${Addon.Package.gitRepository}#readme`)))
                    .addWidget(
                        CardService.newTextButton()
                            .setText('📢 Report Issues')
                            .setOpenLink(
                                CardService.newOpenLink()
                                    .setUrl(`${Addon.Package.gitRepository}/issues`))));

            return cardBuilder.build();
        },
        HelpCard: (data = {}) => {
            const cardBuilder = CardService.newCardBuilder()
                .setName(Addon.Home.id + '-Help')
                .setHeader(CardService.newCardHeader()
                    .setTitle('Help & Support')
                    .setSubtitle(Addon.Home.short_description)
                    .setImageStyle(CardService.ImageStyle.SQUARE)
                    .setImageUrl(Addon.Media.YES_IMG_URL)
                    .setImageAltText('Help Image'));

            // 1. Getting Started Guide Section
            cardBuilder.addSection(CardService.newCardSection()
                .setHeader('🚀 Getting Started')
                .addWidget(CardService.newTextParagraph()
                    .setText('To start editing JSON, follow these simple steps:'))
                .addWidget(CardService.newDecoratedText()
                    .setTopLabel('Step 1')
                    .setText('Open the Json Editor tool.')
                    .setWrapText(true))
                .addWidget(CardService.newDecoratedText()
                    .setTopLabel('Step 2')
                    .setText('Paste or input your JSON data.')
                    .setWrapText(true))
                .addWidget(CardService.newDecoratedText()
                    .setTopLabel('Step 3')
                    .setText('Use the tools to beautify, validate, or export.')
                    .setWrapText(true)));

            // 2. Common Issues / FAQ Section
            cardBuilder.addSection(CardService.newCardSection()
                .setHeader('💡 Quick Troubleshooting')
                .setCollapsible(true)
                .setNumUncollapsibleWidgets(1)
                .addWidget(CardService.newDecoratedText()
                    .setTopLabel('Invalid JSON?')
                    .setText('Ensure your JSON is properly formatted.')
                    .setWrapText(true))
                .addWidget(CardService.newDecoratedText()
                    .setTopLabel('Large files?')
                    .setText('Consider splitting large JSON into smaller parts.')
                    .setWrapText(true)));

            // 3. Useful Links & Support Section
            cardBuilder.addSection(CardService.newCardSection()
                .setHeader('🔗 Resources')
                .addWidget(CardService.newTextButton()
                    .setText('📄 Read Documentation')
                    .setOpenLink(CardService.newOpenLink()
                        .setUrl(`${Addon.Package.gitRepository}#readme`)))
                .addWidget(CardService.newTextButton()
                    .setText('📢 Report a Bug')
                    .setOpenLink(CardService.newOpenLink()
                        .setUrl(`${Addon.Package.gitRepository}/issues`))));
            return cardBuilder.build();
        }
    }
};

Addon.Settings = {
    id: 'SettingsPlugin',
    name: 'Settings',
    short_description: 'Manage addon settings',
    description: 'Configure your Json Studio preferences and settings.',
    version: '1.0.0',
    imageUrl: Addon.Media.WELCOME_IMG_URL,
    Controller: {
        Load: (e) => {
            // Build and return the Settings Home Card
            const appModelData = Addon.Modules.App.getData();
            return CardService.newActionResponseBuilder()
                .setNavigation(
                    CardService.newNavigation()
                        .pushCard(Addon.Settings.View.HomeCard({ ...appModelData }))
                ).build();
        },
        SaveSettings: (e) => {
            const selectedSpaces = e?.commonEventObject
                ?.formInputs?.['indentation_spaces']
                ?.stringInputs?.value[0] || "2";

            PropertiesService.getUserProperties().setProperty('indentation_spaces', selectedSpaces);

            // show_errors_switch
            const showErrorsState = e?.commonEventObject
                ?.formInputs?.['show_errors_switch']
                ?.stringInputs?.value[0] || "OFF";

            PropertiesService.getUserProperties().setProperty('show_errors_switch', showErrorsState);

            // Build and return the Home Card
            const appModelData = Addon.Modules.App.getData();
            return CardService.newActionResponseBuilder()
                .setNavigation(
                    CardService.newNavigation()
                        .popToRoot()
                        .updateCard(Addon.Home.View.HomeCard({ ...appModelData }))
                ).build();
        },
        ToggleAction(e) {
            try {
                const actionName = e?.commonEventObject?.parameters?.actionName;
                // actionName like: 'debug_mode_switch' or 'form_input_switch_key'
                const preState = e?.commonEventObject?.formInputs?.[actionName]?.stringInputs?.value?.[0];
                // store the new state within user properties or perform necessary actions
                PropertiesService.getUserProperties().setProperty(actionName, preState === 'ON' ? 'ON' : 'OFF');
                // return success notification
                return CardService.newActionResponseBuilder()
                    .setNotification(
                        CardService.newNotification()
                            .setText(`${actionName} set to ${preState}`))
                    .build();
            } catch (error) {
                return CardService.newActionResponseBuilder()
                    .setNotification(
                        CardService.newNotification()
                            .setText(
                                error.toString()))
                    .build();
            }
        }
    },
    View: {
        HomeCard: (data = {}) => {
            // Data Initialization
            // Create a random demo key if none exists (for display purposes)
            const privateKeyDemo = Array(65).fill(0).map(() => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');

            // Fetch properties with robust fallbacks
            data.terminal_output_switch = PropertiesService.getUserProperties().getProperty('terminal_output_switch') || 'OFF';
            data.focus_terminal_output = PropertiesService.getUserProperties().getProperty('focus_terminal_output') || 'OFF';
            data.praittfy_json = PropertiesService.getUserProperties().getProperty('praittfy_json') || 'OFF';
            data.txt_secret_private_key = PropertiesService.getUserProperties().getProperty('txt_secret_private_key') || privateKeyDemo;
            data.indentationLevel = parseInt(PropertiesService.getUserProperties().getProperty('indentation_spaces') || '2', 10);
            data.show_errors_switch = PropertiesService.getUserProperties().getProperty('show_errors_switch') || 'ON';

            const cardBuilder = CardService.newCardBuilder()
                .setName(Addon.Settings.name + '-Home')
                .setHeader(CardService.newCardHeader()
                    .setTitle(Addon.Settings.name)
                    .setSubtitle(Addon.Settings.short_description)
                    .setImageStyle(CardService.ImageStyle.SQUARE)
                    .setImageUrl(Addon.Settings.imageUrl)
                    .setImageAltText('Settings Logo'));

            // Indentation Level Selector (only for premium users)
            const devSection = CardService.newCardSection()
                .setHeader('⚙️ Indentation Settings')
                .setCollapsible(true)
                .setNumUncollapsibleWidgets(1);

            // create show errors caard decorator text with switch widget
            const showErrorsDecoratedText = CardService.newDecoratedText()
                .setTopLabel('Show errors in results card')
                .setWrapText(true)
                .setStartIcon(
                    CardService.newIconImage()
                        .setIconUrl(Addon.Media.I_AM_THINKING_IMG_URL))
                .setButton(
                    CardService.newSwitch()
                        .setFieldName('show_errors_switch')
                        .setValue(data.show_errors_switch === 'ON' ? 'ON' : 'OFF')
                        .setSelected(data.show_errors_switch === 'ON')
                );

            devSection.addWidget(showErrorsDecoratedText);


            // Create a selection input for indentation spaces
            const indentationLevelSelector =
                CardService.newSelectionInput()
                    .setType(CardService.SelectionInputType.DROPDOWN)
                    // Enable for premium users
                    .setTitle('Indentation Spaces')
                    .setFieldName('indentation_spaces')
                    .addItem('1 {.}', '1', data.indentationLevel === 1)
                    .addItem('2 {..} (default)', '2', data.indentationLevel === 2) // Default selected
                    .addItem('4 {....}', '4', data.indentationLevel === 4)
                    .addItem('6 {......}', '6', data.indentationLevel === 6)
                    .addItem('8 {........}', '8', data.indentationLevel === 8);

            // Add the selection input to the card section
            devSection.addWidget(indentationLevelSelector);

            cardBuilder.addSection(devSection);

            // Professional Fixed Footer
            // High-contrast primary button for the "Save" action
            const fixedFooter = CardService.newFixedFooter()
                .setPrimaryButton(
                    CardService.newTextButton()
                        .setText('Save Configuration')
                        .setBackgroundColor(Addon.primaryColor())
                        //.setTextButtonStyle(CardService.TextButtonStyle.FILLED)
                        .setMaterialIcon(CardService.newMaterialIcon().setName('save'))
                        .setOnClickAction(
                            CardService.newAction()
                                .setFunctionName('Addon.Settings.Controller.SaveSettings')
                        )
                );

            cardBuilder.setFixedFooter(fixedFooter);

            return cardBuilder.build();
        }
    }
};

Addon.UserProfile = {
    id: 'UserProfilePlugin',
    name: 'User Profile',
    short_description: 'Manage your account and membership',
    description: 'The User Profile plugin allows you to manage your account information, view your membership status, and upgrade to premium features. You can easily access your profile details and make changes to your subscription directly from this card.',
    version: '1.0.0',
    imageUrl: Addon.Media.YOU_GOT_IT_IMG_URL,
    Controller: {
        Load(e) {
            try {
                const membershipStr = PropertiesService.getUserProperties().getProperty('membership') || null;
                const membership = membershipStr ? JSON.parse(membershipStr) : null;
                const isPremium = membership && membership.type === 'premium' && new Date(membership.expiresAt) > new Date();

                const appModelData = Addon.Modules.App.getData();
                return CardService.newActionResponseBuilder()
                    .setNavigation(
                        CardService.newNavigation()
                            .pushCard(Addon.UserProfile.View.HomeCard({ ...appModelData, isPremium }))
                    ).build();
            } catch (error) {
                return this.handleOperationError(error);
            }
        },
        ActivatePremium(e) {
            try {
                // Simulate activation logic
                // In a real implementation, you would interact with a payment gateway or licensing server here
                const membership = {
                    licenseKey: 'SAMPLE_LICENSE_KEY',
                    type: 'premium',
                    activatedAt: new Date().toISOString(),
                    // Add one 90 days to the current date
                    expiresAt: new Date(new Date().setDate(new Date().getDate() + 90)).toISOString(),
                    balance: 0
                }

                // Save membership info to user properties
                PropertiesService.getUserProperties().setProperty('membership', JSON.stringify(membership));

                // Build and return the Home Card
                const appModelData = Addon.Modules.App.getData();
                return CardService.newActionResponseBuilder()
                    .setNavigation(
                        CardService.newNavigation()
                            .popToRoot()
                            .updateCard(Addon.Home.View.HomeCard({ ...appModelData }))
                    ).build();
            } catch (error) {
                return this.handleOperationError(error);
            }
        },
        ConfirmRevokeLicense(e) {
            // Show confirmation card before revoking license
            const title = 'Cancel Subscription';
            const message = 'Are you sure you want to cancel your premium subscription? You will lose access to premium features.';
            const onClickFunctionName = 'Addon.UserProfile.Controller.RevokeLicense';
            const onClickParameters = e?.commonEventObject?.parameters || {};

            // Push Confirmation Card
            return Addon.ConfirmationCard.Controller.Load({
                commonEventObject: {
                    parameters: { title, message, onClickFunctionName, onClickParameters }
                }
            });
        },
        RevokeLicense(e) {
            const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
            try {
                // Simulate revocation logic
                PropertiesService.getUserProperties().deleteProperty('membership');
                // Build and return the Home Card
                const appModelData = Addon.Modules.App.getData();
                return CardService.newActionResponseBuilder()
                    .setNavigation(
                        CardService.newNavigation()
                            .popToRoot()
                            .updateCard(Addon.Home.View.HomeCard({ ...appModelData }))
                    ).build();
            } catch (error) {
                // Return error notification
                return this.handleOperationError(error);
            }
        },
        handleOperationError(error) {
            // Show an error message to the user
            return CardService.newActionResponseBuilder()
                .setNotification(
                    CardService.newNotification()
                        .setText(
                            error.toString()))
                .build();
        }
    },
    View: {
        HomeCard: (data = {}) => {
            const cardBuilder = CardService.newCardBuilder()
                .setName(Addon.UserProfile.id + '-Home')
                .setHeader(CardService.newCardHeader()
                    .setTitle('Account Overview')
                    .setSubtitle('Manage your profile & membership')
                    .setImageStyle(CardService.ImageStyle.SQUARE)
                    .setImageUrl(Addon.Media.YOU_GOT_IT_IMG_URL)
                    .setImageAltText('User Profile Avatar'));

            // 1. Membership Status Section
            cardBuilder.addSection(Addon.UserProfile.View.buildMembershipSection(data));

            // 2. Feature Comparison Section (Professional Touch)
            const featureSection = CardService.newCardSection()
                .setHeader('🚀 Premium Features')
                .setCollapsible(true)
                .setNumUncollapsibleWidgets(1);

            const features = [
                { name: 'Unlimited Webhooks', premium: true },
                { name: 'Real-time Log Monitoring', premium: true },
                { name: 'Priority Support', premium: true },
                { name: 'Ad-free Experience', premium: true }
            ];

            features.forEach(f => {
                featureSection.addWidget(CardService.newDecoratedText()
                    .setText(f.name)
                    .setStartIcon(CardService.newIconImage().setMaterialIcon(
                        CardService.newMaterialIcon().setName('check_circle').setFill(false)))
                    .setBottomLabel(data.isPremium ? 'Active' : 'Premium Only'));
            });

            cardBuilder.addSection(featureSection);

            return cardBuilder.build();
        },
        buildMembershipSection: (data = {}) => {
            const isPremium = data.isPremium ?? false;

            const newSection = CardService.newCardSection()
                .setHeader('Membership & Billing');

            // Professional Membership Badge
            newSection.addWidget(CardService.newDecoratedText()
                .setTopLabel('Current Plan')
                .setText(isPremium ? '💎 PREMIUM ACCESS' : '🆓 FREE TIER')
                .setStartIcon(CardService.newIconImage().setMaterialIcon(
                    CardService.newMaterialIcon()
                        .setName(isPremium ? 'workspace_premium' : 'person')
                        .setFill(false)))
                .setBottomLabel(isPremium ? 'Your pro subscription is active.' : 'Upgrade to unlock advanced tools.')
                .setWrapText(true));

            if (isPremium) {
                newSection.addWidget(CardService.newTextButton()
                    .setText('Cancel Subscription')
                    .setTextButtonStyle(CardService.TextButtonStyle.TEXT)
                    .setOnClickAction(CardService.newAction()
                        .setFunctionName('Addon.UserProfile.Controller.ConfirmRevokeLicense')));
            } else {
                newSection.addWidget(CardService.newTextButton()
                    .setText('💎 Upgrade Now')
                    .setBackgroundColor(Addon.primaryColor())
                    .setTextButtonStyle(CardService.TextButtonStyle.TEXT)
                    .setMaterialIcon(CardService.newMaterialIcon().setName('bolt'))
                    .setOnClickAction(CardService.newAction()
                        .setFunctionName('Addon.UserProfile.Controller.ActivatePremium')));
            }

            return newSection;
        }
    }
};

Addon.ConfirmationCard = {
    id: 'ConfirmationCardPlugin',
    name: 'Confirmation Card',
    short_description: 'Standardized confirmation dialog',
    description: 'A reusable confirmation dialog plugin to standardize user confirmations across various actions within the add-on.',
    version: '1.0.0',
    imageUrl: Addon.Media.PAY_ATTENTION_IMG_URL,
    Controller: {
        Load: (e) => {
            const title = e?.commonEventObject?.parameters?.title || 'Confirm Action';
            const message = e?.commonEventObject?.parameters?.message || 'Are you sure you want to proceed?';
            const onClickFunctionName = e?.commonEventObject?.parameters?.onClickFunctionName || null;
            const onClickParameters = e?.commonEventObject?.parameters?.onClickParameters || {};

            if (!onClickFunctionName) {
                throw new Error('Missing required parameters: message, onClickFunctionName');
            }

            // Push the confirmation card
            return CardService.newActionResponseBuilder()
                .setNavigation(
                    CardService.newNavigation()
                        .pushCard(
                            Addon.ConfirmationCard.View.HomeCard({
                                title: title,
                                message: message,
                                onClickFunctionName: onClickFunctionName,
                                onClickParameters: onClickParameters
                            })
                        )
                )
                .build();
        },
        Confirm: (e) => {
            // extract parameters from event object onClickFunctionName = 'Plugins['Name'].Controller['Function']', onClickParameters={}
            const onClickFunctionName = e?.commonEventObject?.parameters?.onClickFunctionName || null;
            const onClickParameters = e?.commonEventObject?.parameters?.onClickParameters || {};

            if (!onClickFunctionName) {
                throw new Error('Missing required parameters: message, onClickFunctionName');
            }

            // Resolve the function from the string name 
            // onClickFunctionName = 'Addon.Name.Controller.Function'
            const functionPathParts = onClickFunctionName.split('.');
            let actionResult = null;
            try {
                let func = Plugins;
                for (let i = 1; i < functionPathParts.length; i++) {
                    func = func[functionPathParts[i]];
                }
                actionResult = func(e);
            } catch (error) {
                throw new Error(`Error executing function "${onClickFunctionName}": ${error.message}`);
            }

            return actionResult;
        },
        Cancel: (e) => {
            // Simply pop the card on cancel
            return CardService.newActionResponseBuilder()
                .setNavigation(CardService.newNavigation().popCard())
                .build();
        },
    },
    View: {
        HomeCard: (data = {}) => {
            // Build the Confirmation Card.
            const cardBuilder = CardService.newCardBuilder()
                .setName(Addon.ConfirmationCard.id + '-Home')
                .setHeader(CardService.newCardHeader()
                    .setTitle(data.title || 'Confirm Action')
                    .setImageStyle(CardService.ImageStyle.SQUARE)
                    .setImageUrl(Addon.ConfirmationCard.imageUrl)
                    .setImageAltText('Confirmation Image'));

            // Build the main section
            const mainSection = CardService.newCardSection()
                .addWidget(
                    CardService.newTextParagraph()
                        .setText(data.message || 'Are you sure you want to proceed?'));

            cardBuilder.addSection(mainSection);

            // Add Confirm and Cancel buttons to the footer
            cardBuilder.setFixedFooter(
                CardService.newFixedFooter()
                    .setPrimaryButton(
                        CardService.newTextButton()
                            .setText('Confirm')
                            .setOnClickAction(CardService.newAction()
                                .setFunctionName('Addon.ConfirmationCard.Controller.Confirm')
                                .setParameters({ onClickFunctionName: data.onClickFunctionName, onClickParameters: JSON.stringify(data.onClickParameters || {}) })))
                    .setSecondaryButton(
                        CardService.newTextButton()
                            .setText('Cancel')
                            .setOnClickAction(CardService.newAction()
                                .setFunctionName('Addon.ConfirmationCard.Controller.Cancel'))));

            return cardBuilder.build();
        }
    }
};

Addon.ResultWidget = {
    id: 'ResultWidget',
    name: 'Export Widget',
    short_description: 'Widget to export result data to Google Sheets',
    description: 'A widget that allows users to export JSON operation results directly to a Google Sheets spreadsheet for further analysis and record-keeping.',
    version: '1.0.0',
    imageUrl: Addon.Media.YOU_GOT_IT_IMG_URL,
    Controller: {
        DumpResultToSheet: (e) => {
            const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();

            try {
                // extract parameters
                const range = e?.commonEventObject?.parameters?.range || 'A1';
                const report = e?.commonEventObject?.parameters?.report || '[]';

                // Dump data to sheet
                Addon.Modules.Sheet
                    .dumpObjectToSheet(activeSpreadsheet, range, JSON.parse(report));

                // Return action response with notification
                return CardService.newActionResponseBuilder()
                    .setNotification(
                        CardService.newNotification()
                            .setText(`✅ Data dumped to sheet successfully at range "${range}".`))
                    .build();
            }
            catch (error) {
                return CardService.newActionResponseBuilder()
                    .setNotification(
                        CardService.newNotification()
                            .setText(`❌ Error dumping data to sheet: ${error.toString()}`))
                    .build();
            }
        }
    },
    HighlightRange: (e) => {
        const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
        try {
            // extract parameters
            const rangeA1 = e?.commonEventObject?.parameters?.range || 'A1';
            const sheet = activeSpreadsheet.getActiveSheet();
            const range = sheet.getRange(rangeA1);
            // Highlight the range with a yellow background
            range.setBackground('#FFFF00');

            // Return action response with notification
            return CardService.newActionResponseBuilder()
                .setNotification(
                    CardService.newNotification()
                        .setText(`✅ Range "${rangeA1}" highlighted successfully.`))
                .build();
        }
        catch (error) {
            return CardService.newActionResponseBuilder()
                .setNotification(
                    CardService.newNotification()
                        .setText(`❌ Error highlighting range: ${error.toString()}`))
                .build();
        }
    },
    View: {
        BuildResultCard: (result = {}) => {
            const cardBuilder = CardService.newCardBuilder()
                .setName(Addon.ResultWidget.id + '-ResultCard')
                .setHeader(CardService.newCardHeader()
                    .setTitle('Operation Result')
                    .setSubtitle('View and export operation results')
                    .setImageStyle(CardService.ImageStyle.SQUARE)
                    .setImageUrl(Addon.ResultWidget.imageUrl)
                    .setImageAltText('Result Image'));

            // Add Result Summary Section
            cardBuilder.addSection(
                Addon.ResultWidget.View
                    .BuildResultSummarySection(result.range, result.report)
            );

            // Add Detailed Result Widgets
            const detailSection = CardService.newCardSection()
                .setHeader('Detailed Results')
                .setCollapsible(true)
                .setNumUncollapsibleWidgets(1);

            // Iterate over each report item and add a widget
            result.report.forEach(reportItem => {
                detailSection.addWidget(
                    Addon.ResultWidget.View
                        // Add a widget for each detailed result item
                        .BuildResultWidget(reportItem)
                );
            });

            cardBuilder.addSection(detailSection);

            // Add Export Widget
            cardBuilder.addSection(
                CardService.newCardSection()
                    .addWidget(
                        Addon.ResultWidget.View
                            .BuildExportWidget(result.range, result.report)
                    )
            );
            return cardBuilder;
        },
        BuildResultSummarySection: (range, report) => {
            return CardService.newCardSection()
                .setHeader('📊 Operation Result Summary')
                .addWidget(
                    CardService.newDecoratedText()
                        .setTopLabel('Affected Range')
                        .setText(range.getA1Notation())
                        .setStartIcon(
                            CardService.newIconImage()
                                .setMaterialIcon(
                                    CardService.newMaterialIcon()
                                        .setName('grid_on'))))
                .addWidget(
                    CardService.newDecoratedText()
                        .setTopLabel('Report Summary')
                        .setText(report.length)
                        .setStartIcon(
                            CardService.newIconImage()
                                .setMaterialIcon(
                                    CardService.newMaterialIcon()
                                        .setName('assessment'))));
        },
        BuildResultWidget: (reportItem = {}) => {
            return CardService.newDecoratedText()
                .setTopLabel('📝 Detail')
                .setText(`Cell: ${reportItem.cell}`)
                .setWrapText(true)
                .setBottomLabel(`Error: ${reportItem.error}`)
                .setStartIcon(
                    CardService.newIconImage()
                        .setMaterialIcon(
                            CardService.newMaterialIcon()
                                .setName('description')))
                .setButton(
                    CardService.newTextButton()
                        .setText('Highlight')
                        .setOnClickAction(
                            CardService.newAction()
                                .setFunctionName('Addon.ResultWidget.Controller.HighlightRange')
                                .setParameters({
                                    range: JSON.stringify(reportItem.cell)
                                })
                        )
                );
        },
        BuildExportWidget: (range = '', report = {}) => {
            return CardService.newDecoratedText()
                .setTopLabel('📥 Export Data')
                .setText('Export to Sheet')
                .setWrapText(true)
                .setBottomLabel(`Export the operation results to a Google Sheets spreadsheet for further analysis.`)
                .setStartIcon(
                    CardService.newIconImage()
                        .setMaterialIcon(
                            CardService.newMaterialIcon()
                                .setName('save_alt')))
                .setButton(
                    CardService.newTextButton()
                        .setText('Export')
                        .setOnClickAction(
                            CardService.newAction()
                                .setFunctionName('Addon.ResultWidget.Controller.DumpResultToSheet')
                                .setParameters({
                                    sheetName: '📦 Dumps',
                                    report: JSON.stringify(report),
                                    range: JSON.stringify(range.getA1Notation())
                                })
                        )
                );
        }
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Addon
    };
};