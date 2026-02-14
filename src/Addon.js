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
    description: 'A collection of tools for working with JSON data in Google Sheets, including beautification, minification, validation, and more.',
    version: '1.11.0',
    build: '20260214.125400',
    author: 'Ilan Laloum',
    license: 'MIT',
    imageUrl: Addon.Media.LOGO_PNG_URL,
    gitRepository: 'https://github.com/ilanlal/ss-json-editor'
};

Addon.INPUT_PARAMETERS = {
    get indentation_spaces() {
        return 'indentation_spaces';
    },
    get show_errors_switch() {
        return 'show_errors_switch';
    },
    get highlight_color() {
        return 'highlight_color';
    },
    get terminal_output_switch() {
        return 'terminal_output_switch';
    },
    get focus_terminal_output() {
        return 'focus_terminal_output';
    },
    get ignore_whitespace_switch() {
        return 'ignore_whitespace_switch';
    }
};

Addon.Modules = {
    App: {
        get DEFAULT_INDENTATION_SPACES() {
            return '2';
        },
        get MEMBERSHIP_PROPERTY_KEY() {
            return 'membership';
        },
        getData() {
            const properties = PropertiesService.getUserProperties();
            const rawData = properties.getProperty(this.MEMBERSHIP_PROPERTY_KEY);
            const membershipInfo = rawData ? JSON.parse(rawData) : {};
            const expiresAt = membershipInfo.expiresAt ? new Date(membershipInfo.expiresAt) : null;
            const balance = membershipInfo.balance || 0;
            const isPremium = (expiresAt && expiresAt > new Date()) || balance > 0;
            const indentationSpaces = properties.getProperty(Addon.INPUT_PARAMETERS.indentation_spaces) || Addon.Modules.App.DEFAULT_INDENTATION_SPACES;
            const showErrorsSwitch = properties.getProperty(Addon.INPUT_PARAMETERS.show_errors_switch) || 'ON';
            const highlightColor = properties.getProperty(Addon.INPUT_PARAMETERS.highlight_color) || '#FFFF00';
            const terminalOutputSwitch = properties.getProperty(Addon.INPUT_PARAMETERS.terminal_output_switch) || 'OFF';
            const focusTerminalOutput = properties.getProperty(Addon.INPUT_PARAMETERS.focus_terminal_output) || 'OFF';
            const ignoreWhitespaceSwitch = properties.getProperty(Addon.INPUT_PARAMETERS.ignore_whitespace_switch) || 'ON';

            return {
                indentation_spaces: parseInt(indentationSpaces, 10),
                show_errors_switch: showErrorsSwitch,
                highlight_color: highlightColor,
                terminal_output_switch: terminalOutputSwitch,
                focus_terminal_output: focusTerminalOutput,
                ignore_whitespace_switch: ignoreWhitespaceSwitch,
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
        DUMP_SHEET_NAME: '📥 Data',

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

        dumpObjectToSheet(activeSpreadsheet, sheetName, range = 'A1', report = []) {
            const sheetMeta = {
                name: Addon.Modules.Sheet.DUMP_SHEET_NAME,
                columns: ['Timestamp', 'Index', 'Sheet', 'Range', 'Cell', 'Error', 'Details']
            };

            const sheet = this.getSheet(activeSpreadsheet, sheetMeta);
            // Activate the target sheet
            activeSpreadsheet.setActiveSheet(activeSpreadsheet.getSheetByName(sheetMeta.name));

            report.forEach((item, index) => {
                const row = [
                    new Date().toISOString(),
                    index,
                    sheetName || '',
                    range,
                    item.a1n || '',
                    item.error || '',
                    JSON.stringify(item)];

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
        static get MAX_PROCESS_CELLS() {
            return 100;
        }

        static beautifyActiveRange(activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet(), indentationSpaces = 2, ignoreWhitespace = true) {
            const activeRange = activeSpreadsheet.getActiveSheet().getActiveRange();
            const report = [];

            // Ensure we do not exceed max process cells
            if (activeRange.getNumRows() * activeRange.getNumColumns() > this.MAX_PROCESS_CELLS) {
                throw new Error(`Selected range exceeds the maximum allowed cells (${this.MAX_PROCESS_CELLS}). Please select a smaller range.`);
            }

            // for each cell in range, beautify JSON
            activeRange.getValues().forEach((row, i) => {
                row.forEach((cell, j) => {
                    try {
                        // if cell is empty after cleaning, skip
                        if (ignoreWhitespace && this.trimValue(cell) === '') {
                            return; // Skip empty cells
                        }
                        const beautifiedJson = JSON.stringify(
                            JSON.parse(cell),
                            null,
                            indentationSpaces
                        );
                        activeRange.getCell(i + 1, j + 1).setValue(beautifiedJson);
                    } catch (error) {
                        // Handle JSON parsing error if needed
                        report.push({
                            a1n: activeRange.getCell(i + 1, j + 1).getA1Notation(),
                            sheetName: activeSpreadsheet.getActiveSheet().getName(),
                            error: error.message
                        });
                    }
                });
            });

            return { range: activeRange, report };
        }

        static minifyActiveRange(activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet(), ignoreWhitespace = true) {
            const activeRange = activeSpreadsheet.getActiveSheet().getActiveRange();
            const report = [];
            // Ensure we do not exceed max process cells
            if (activeRange.getNumRows() * activeRange.getNumColumns() > this.MAX_PROCESS_CELLS) {
                throw new Error(`Selected range exceeds the maximum allowed cells (${this.MAX_PROCESS_CELLS}). Please select a smaller range.`);
            }
            // for each cell in range, minify JSON
            activeRange.getValues().forEach((row, i) => {
                row.forEach((cell, j) => {
                    try {
                        // if cell is empty after cleaning, skip
                        if (ignoreWhitespace && this.trimValue(cell) === '') {
                            return; // Skip empty cells
                        }
                        const minifiedJson = JSON.stringify(JSON.parse(cell));
                        activeRange.getCell(i + 1, j + 1).setValue(minifiedJson);
                    } catch (error) {
                        // Handle JSON parsing error if needed
                        report.push({
                            a1n: activeRange.getCell(i + 1, j + 1).getA1Notation(),
                            sheetName: activeSpreadsheet.getActiveSheet().getName(),
                            error: error.message
                        });
                    }
                });
            });

            return { range: activeRange, report };
        }

        static validateActiveRange(activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet(), ignoreWhitespace = true) {
            const activeRange = activeSpreadsheet.getActiveSheet().getActiveRange();
            const report = [];
            // Ensure we do not exceed max process cells
            if (activeRange.getNumRows() * activeRange.getNumColumns() > this.MAX_PROCESS_CELLS) {
                throw new Error(`Selected range exceeds the maximum allowed cells (${this.MAX_PROCESS_CELLS}). Please select a smaller range.`);
            }
            // for each cell in range, validate JSON
            activeRange.getValues().forEach((row, i) => {
                row.forEach((cell, j) => {
                    try {
                        // if cell is empty after cleaning, skip
                        if (ignoreWhitespace && this.trimValue(cell) === '') {
                            return; // Skip empty cells
                        }
                        JSON.parse(cell);
                    } catch (error) {
                        report.push({
                            a1n: activeRange.getCell(i + 1, j + 1).getA1Notation(),
                            sheetName: activeSpreadsheet.getActiveSheet().getName(),
                            error: error.message
                        });
                    }
                });
            });

            return { range: activeRange, report };
        }

        static trimValue(value) {
            if (typeof value === 'string') {
                return value.trim()
                    .replace(/^\uFEFF/, '') // Remove BOM if present
                    .replace(/\n/g, '') // Remove newlines
                    .replace(/\s+/g, ''); // Remove all whitespace
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
            const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();

            try {
                const formInputs = e?.commonEventObject?.formInputs || {};

                // Read settings from properties
                const indentationSpaces = formInputs?.[Addon.INPUT_PARAMETERS.indentation_spaces]?.stringInputs?.value[0] || "2";
                PropertiesService.getUserProperties().setProperty(Addon.INPUT_PARAMETERS.indentation_spaces, indentationSpaces);

                // show_errors_switch
                const showErrorsState = formInputs?.[Addon.INPUT_PARAMETERS.show_errors_switch]?.stringInputs?.value[0] || "OFF";
                PropertiesService.getUserProperties().setProperty(Addon.INPUT_PARAMETERS.show_errors_switch, showErrorsState);

                // ignore_whitespace_switch
                const ignoreWhitespaceState = PropertiesService.getUserProperties().getProperty(Addon.INPUT_PARAMETERS.ignore_whitespace_switch) || 'ON';

                const result = Addon.Modules.JsonStudio.beautifyActiveRange(activeSpreadsheet, parseInt(indentationSpaces, 10), ignoreWhitespaceState === 'ON');
                return Addon.Home.Controller._HandleResultNavigation(e, result);
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
            const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
            try {
                const formInputs = e?.commonEventObject?.formInputs || {};

                // show_errors_switch
                const showErrorsState = formInputs?.[Addon.INPUT_PARAMETERS.show_errors_switch]?.stringInputs?.value[0] || "OFF";
                PropertiesService.getUserProperties().setProperty(Addon.INPUT_PARAMETERS.show_errors_switch, showErrorsState);

                // Indentation spaces (not used in validate, but saved for consistency)
                const indentationSpaces = formInputs?.[Addon.INPUT_PARAMETERS.indentation_spaces]?.stringInputs?.value[0] || "2";
                PropertiesService.getUserProperties().setProperty(Addon.INPUT_PARAMETERS.indentation_spaces, indentationSpaces);

                // ignore_whitespace_switch
                const ignoreWhitespaceState = PropertiesService.getUserProperties().getProperty(Addon.INPUT_PARAMETERS.ignore_whitespace_switch) || 'ON';

                const result = Addon.Modules.JsonStudio.minifyActiveRange(activeSpreadsheet, ignoreWhitespaceState === 'ON');
                return Addon.Home.Controller._HandleResultNavigation(e, result);
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
            const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
            const properties = PropertiesService.getUserProperties();
            try {
                const formInputs = e?.commonEventObject?.formInputs || {};
                // show_errors_switch
                const showErrorsState = formInputs?.[Addon.INPUT_PARAMETERS.show_errors_switch]?.stringInputs?.value[0] || "OFF";
                properties.setProperty(Addon.INPUT_PARAMETERS.show_errors_switch, showErrorsState);

                // Indentation spaces (not used in validate, but saved for consistency)
                const indentationSpaces = formInputs?.[Addon.INPUT_PARAMETERS.indentation_spaces]?.stringInputs?.value[0] || "2";
                properties.setProperty(Addon.INPUT_PARAMETERS.indentation_spaces, indentationSpaces);

                // ignore_whitespace_switch
                const ignoreWhitespaceState = properties.getProperty(Addon.INPUT_PARAMETERS.ignore_whitespace_switch) || 'ON';
                const result = Addon.Modules.JsonStudio.validateActiveRange(activeSpreadsheet, ignoreWhitespaceState === 'ON');
                return Addon.Home.Controller._HandleResultNavigation(e, result);
            }
            catch (error) {
                return CardService.newActionResponseBuilder()
                    .setNotification(
                        CardService.newNotification()
                            .setText(`Error during Validate: ${error.message}`))
                    .build();
            }
        },
        _HandleResultNavigation: (e, result) => {
            const formInputs = e?.commonEventObject?.formInputs || {};
            const showErrorsState = formInputs?.[Addon.INPUT_PARAMETERS.show_errors_switch]?.stringInputs?.value[0] || "OFF";
            if (result.report.length > 0) {
                if (showErrorsState === 'ON') {
                    // Build and return the result card
                    return CardService.newActionResponseBuilder()
                        .setNavigation(
                            CardService.newNavigation()
                                .pushCard(
                                    Addon.ResultWidget.View
                                        .BuildResultCard(result))
                        ).build();
                }
                else {
                    return CardService.newActionResponseBuilder()
                        .setNotification(
                            CardService.newNotification()
                                .setText('⚠️ Completed with ' + result.report.length + ' error(s). \n\nEnable "Show Errors" in Advanced Settings to view details.'))
                        .build();
                }
            }

            // show notification if no errors or if show errors is off
            return CardService.newActionResponseBuilder()
                .setNotification(
                    CardService.newNotification()
                        .setText('✅ All JSON entries are valid!'))
                .build();
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


            cardBuilder.addSection(CardService.newCardSection()
                .addWidget(
                    CardService.newTextParagraph()
                        .setText('Select a range of cells containing JSON data in your sheet, then use the tools below to parse or validate the JSON.')));

            // Plugin Hub Section
            cardBuilder.addSection(Addon.Home.View._BuildPluginHubSection(data));

            // Advanced Sections
            cardBuilder.addSection(Addon.Home.View._BuildAdvancedSettingsSection(data));

            // Quick Access Section
            cardBuilder.addSection(Addon.Home.View._BuildQuickAccessSection(data));

            // Premium Membership Section
            if (!data.isPremium) {
                cardBuilder.addSection(Addon.Home.View._BuildPremiumMembershipSection(data));
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
        },
        _BuildPluginHubSection: (data = {}) => {
            const pluginHub = CardService.newCardSection()
                .setHeader('🛠️ Available Tools')
                .setCollapsible(false);

            // Add divider
            pluginHub.addWidget(CardService.newDivider());

            // Add a tool - Beautify JSON
            const beautifyJson = CardService.newDecoratedText()
                .setTopLabel('🎨 Beautify')
                .setBottomLabel('Format your JSON data for better readability.')
                .setWrapText(true)
                .setButton(
                    CardService.newTextButton()
                        .setText('Format')
                        .setAltText('Beautify JSON within selected cells')
                        .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
                        .setMaterialIcon(
                            CardService.newMaterialIcon()
                                .setName('format_indent_increase')
                                .setFill(false)
                        )
                        .setOnClickAction(
                            CardService.newAction()
                                .setFunctionName(`Addon.Home.Controller.Beautify`)
                        )
                );

            pluginHub.addWidget(beautifyJson);

            // Add another tool - Minify JSON
            const minifyJson = CardService.newDecoratedText()
                .setTopLabel('🗜️ Minify')
                .setBottomLabel('Compress your JSON data for efficient storage.')
                .setWrapText(true)
                .setButton(
                    CardService.newTextButton()
                        .setText('Minify')
                        .setAltText('Minify JSON within selected cells')
                        .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
                        .setMaterialIcon(
                            CardService.newMaterialIcon().setName('compress'))
                        .setOnClickAction(
                            CardService.newAction()
                                .setFunctionName(`Addon.Home.Controller.Minify`)
                        )
                );

            pluginHub.addWidget(minifyJson);

            // Add another tool - Validate JSON
            const validateJson = CardService.newDecoratedText()
                .setTopLabel('✅ Validate')
                .setBottomLabel('Check your JSON data for errors.')
                .setWrapText(true)
                .setButton(
                    CardService.newTextButton()
                        .setText('Validate')
                        .setAltText('Validate JSON within selected cells')
                        .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
                        .setMaterialIcon(
                            CardService.newMaterialIcon().setName('check_circle'))
                        .setOnClickAction(
                            CardService.newAction()
                                .setFunctionName(`Addon.Home.Controller.Validate`)
                        )
                );

            pluginHub.addWidget(validateJson);

            // Return the completed plugin hub section
            return pluginHub;
        },
        _BuildQuickAccessSection: (data = {}) => {
            return CardService.newCardSection()
                .setHeader('⚙️ Quick Access')
                .setCollapsible(true)
                // add divider
                .addWidget(CardService.newDivider())
                .addWidget(CardService.newButtonSet()
                    .addButton(CardService.newTextButton()
                        .setText('Settings')
                        .setOnClickAction(CardService.newAction()
                            .setFunctionName('Addon.Settings.Controller.Load')))
                    .addButton(CardService.newTextButton()
                        .setText('Help & Support')
                        .setOnClickAction(CardService.newAction()
                            .setFunctionName('Addon.Home.Controller.Help')))
                    .addButton(CardService.newTextButton()
                        .setText('About')
                        .setOnClickAction(CardService.newAction()
                            .setFunctionName('Addon.Home.Controller.About')))
                );
        },
        _BuildAdvancedSettingsSection: (data = {}) => {
            const advancedSection = CardService.newCardSection()
                .setHeader('🔧 Advanced Settings')
                .setCollapsible(true)
                .setNumUncollapsibleWidgets(0);

            // Add a divider
            advancedSection.addWidget(CardService.newDivider());
            // add short info about indentation spaces
            advancedSection.addWidget(CardService.newTextParagraph()
                .setText('Select the number of spaces to use for JSON indentation when beautifying.'));

            // Create a selection input for indentation levels
            const indentationLevelSelector =
                CardService.newSelectionInput()
                    .setType(CardService.SelectionInputType.DROPDOWN)
                    // Enable for premium users
                    .setTitle('Code Indentation Spaces')
                    .setFieldName(Addon.INPUT_PARAMETERS.indentation_spaces)
                    .addItem('1 {.}', '1', data.indentation_spaces === 1)
                    .addItem('2 {..} (default)', '2', data.indentation_spaces === 2) // Default selected
                    .addItem('4 {....}', '4', data.indentation_spaces === 4)
                    .addItem('6 {......}', '6', data.indentation_spaces === 6)
                    .addItem('8 {........}', '8', data.indentation_spaces === 8);

            // Add the selection input to the card section
            advancedSection.addWidget(indentationLevelSelector);

            // add divider
            advancedSection.addWidget(CardService.newDivider());

            // Create a decorated text with a switch for "Show Errors After Validation"
            const showErrorsDecoratedText = CardService.newDecoratedText()
                .setTopLabel('Show Errors After Validation')
                .setBottomLabel('Toggle to display detailed error reports after action.')
                .setWrapText(true)
                .setStartIcon(
                    CardService.newIconImage().setMaterialIcon(
                        CardService.newMaterialIcon()
                            .setName('error_outline')
                    )
                )
                .setSwitchControl(
                    CardService.newSwitch()
                        .setFieldName(Addon.INPUT_PARAMETERS.show_errors_switch)
                        .setValue('ON')
                        .setSelected(data.show_errors_switch === 'ON')
                        .setControlType(CardService.SwitchControlType.CHECK_BOX)
                );

            advancedSection.addWidget(showErrorsDecoratedText);
            return advancedSection;
        },
        _BuildPremiumMembershipSection: (data = {}) => {
            const membershipSection = CardService.newCardSection()
                .setHeader('💎 Premium Membership')
                .setCollapsible(false)
                .addWidget(CardService.newDecoratedText()
                    .setTopLabel('Membership Status')
                    .setText(data.isPremium ? 'Premium Member' : 'Free Member')
                    .setStartIcon(CardService.newIconImage().setMaterialIcon(
                        CardService.newMaterialIcon().setName('workspace_premium')))
                    .setBottomLabel(data.isPremium
                        ? `Expires on: ${data.expiresAt ? data.expiresAt.toDateString() : 'N/A'} | Balance: $${data.balance.toFixed(2)}`
                        : 'Upgrade to unlock advanced JSON tools.'));
            return membershipSection;
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
                ?.formInputs?.[Addon.INPUT_PARAMETERS.indentation_spaces]
                ?.stringInputs?.value[0] || "2";
            PropertiesService.getUserProperties().setProperty(Addon.INPUT_PARAMETERS.indentation_spaces, selectedSpaces);

            // show_errors_switch
            const showErrorsState = e?.commonEventObject
                ?.formInputs?.[Addon.INPUT_PARAMETERS.show_errors_switch]
                ?.stringInputs?.value[0] || "OFF";
            PropertiesService.getUserProperties().setProperty(Addon.INPUT_PARAMETERS.show_errors_switch, showErrorsState);

            // highlight_color
            const highlightColor = e?.commonEventObject
                ?.formInputs?.[Addon.INPUT_PARAMETERS.highlight_color]
                ?.stringInputs?.value[0] || "#FFFF00";
            PropertiesService.getUserProperties().setProperty(Addon.INPUT_PARAMETERS.highlight_color, highlightColor);

            // ignore_whitespace_switch
            const ignoreWhitespaceState = e?.commonEventObject
                ?.formInputs?.[Addon.INPUT_PARAMETERS.ignore_whitespace_switch]
                ?.stringInputs?.value[0] || "OFF";
            PropertiesService.getUserProperties().setProperty(Addon.INPUT_PARAMETERS.ignore_whitespace_switch, ignoreWhitespaceState);

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
            // Fetch properties with robust fallbacks
            const cardBuilder = CardService.newCardBuilder()
                .setName(Addon.Settings.name + '-Home')
                .setHeader(CardService.newCardHeader()
                    .setTitle(Addon.Settings.name)
                    .setSubtitle(Addon.Settings.short_description)
                    .setImageStyle(CardService.ImageStyle.SQUARE)
                    .setImageUrl(Addon.Settings.imageUrl)
                    .setImageAltText('Settings Logo'));

            // Indentation Level Selector (only for premium users)
            const advancedSettingsSection = CardService.newCardSection()
                .setHeader('⚙️ Advanced Settings');

            // create show errors card decorated text with switch widget
            const showErrorsDecoratedText = CardService.newDecoratedText()
                .setText('Show Errors After JSON Operations')
                .setBottomLabel('Display detailed error reports after performing JSON operations.')
                .setWrapText(true)
                .setStartIcon(
                    CardService.newIconImage().setMaterialIcon(
                        CardService.newMaterialIcon()
                            .setName('error_outline')
                    ))
                .setSwitchControl(
                    CardService.newSwitch()
                        .setFieldName(Addon.INPUT_PARAMETERS.show_errors_switch)
                        .setValue('ON')
                        .setSelected(data.show_errors_switch === 'ON')
                        .setControlType(CardService.SwitchControlType.CHECK_BOX)
                );

            advancedSettingsSection.addWidget(showErrorsDecoratedText);
            // add divider
            advancedSettingsSection.addWidget(CardService.newDivider());

            // add ignore whitespace decorated text with switch widget
            const ignoreWhitespaceDecoratedText = CardService.newDecoratedText()
                .setText('Ignore Whitespace')
                .setBottomLabel('Ignore empty cells or cells with only whitespace during JSON operations.')
                .setWrapText(true)
                .setStartIcon(
                    CardService.newIconImage().setMaterialIcon(
                        CardService.newMaterialIcon()
                            .setName('format_indent_increase')
                    ))
                .setSwitchControl(
                    CardService.newSwitch()
                        .setFieldName(Addon.INPUT_PARAMETERS.ignore_whitespace_switch)
                        .setValue('ON')
                        .setSelected(data.ignore_whitespace_switch === 'ON')
                        .setControlType(CardService.SwitchControlType.CHECK_BOX)
                );

            advancedSettingsSection.addWidget(ignoreWhitespaceDecoratedText);
            // add divider
            advancedSettingsSection.addWidget(CardService.newDivider());

            // Create a selection input for indentation spaces
            const indentationLevelSelector =
                CardService.newSelectionInput()
                    .setType(CardService.SelectionInputType.DROPDOWN)
                    // Enable for premium users
                    .setTitle('Indentation Spaces')
                    .setFieldName(Addon.INPUT_PARAMETERS.indentation_spaces)
                    .addItem('1 {.}', '1', data.indentation_spaces === 1)
                    .addItem('2 {..} (default)', '2', data.indentation_spaces === 2) // Default selected
                    .addItem('4 {....}', '4', data.indentation_spaces === 4)
                    .addItem('6 {......}', '6', data.indentation_spaces === 6)
                    .addItem('8 {........}', '8', data.indentation_spaces === 8);

            // Add the selection input to the card section
            advancedSettingsSection.addWidget(indentationLevelSelector);
            // add divider
            advancedSettingsSection.addWidget(CardService.newDivider());
            // Create a selection input for indentation spaces
            const highlightColor =
                CardService.newSelectionInput()
                    .setType(CardService.SelectionInputType.DROPDOWN)
                    // Enable for premium users
                    .setTitle('Highlight Color')
                    .setFieldName(Addon.INPUT_PARAMETERS.highlight_color)
                    .addItem('🔴 Red', '#FF0000', data.highlight_color === '#FF0000')
                    .addItem('🟢 Green', '#00FF00', data.highlight_color === '#00FF00')
                    .addItem('🔵 Blue', '#0000FF', data.highlight_color === '#0000FF')
                    .addItem('🟡 Yellow', '#FFFF00', data.highlight_color === '#FFFF00')
                    .addItem('🟣 Purple', '#800080', data.highlight_color === '#800080');
            // Add the selection input to the card section
            advancedSettingsSection.addWidget(highlightColor);

            // Add the advanced settings section to the card
            cardBuilder.addSection(advancedSettingsSection);

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
                let func = Addon;
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
    name: 'Result Exporter',
    short_description: 'Export operation results to Google Sheets',
    description: 'A widget that allows users to export JSON operation results directly to a Google Sheets spreadsheet for further analysis and record-keeping.',
    version: '1.0.0',
    imageUrl: Addon.Media.YOU_GOT_IT_IMG_URL,
    Controller: {
        Load: (e) => {
            try {
                const result = e?.commonEventObject?.parameters?.result ? JSON.parse(e.commonEventObject.parameters.result) : {};
                return CardService.newActionResponseBuilder()
                    .setNavigation(
                        CardService.newNavigation()
                            .pushCard(Addon.ResultWidget.View.BuildResultCard(result))
                    ).build();
            } catch (error) {
                return CardService.newActionResponseBuilder()
                    .setNotification(
                        CardService.newNotification()
                            .setText(`❌ Error loading result card: ${error.toString()}`))
                    .build();
            }
        },
        DumpResultToSheet: (e) => {
            const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();

            try {
                // extract parameters
                const a1n = e?.commonEventObject?.parameters?.a1n || 'A1';
                const sheetName = e?.commonEventObject?.parameters?.sheetName || activeSpreadsheet.getActiveSheet().getName();
                const report = e?.commonEventObject?.parameters?.report || '[]';

                // Dump data to sheet
                Addon.Modules.Sheet
                    .dumpObjectToSheet(activeSpreadsheet, sheetName, a1n, JSON.parse(report));

                // Return action response with notification
                return CardService.newActionResponseBuilder()
                    .setNotification(
                        CardService.newNotification()
                            .setText(`✅ Data dumped to sheet "${sheetName}" successfully at range "${a1n}".`))
                    .build();
            }
            catch (error) {
                return CardService.newActionResponseBuilder()
                    .setNotification(
                        CardService.newNotification()
                            .setText(`❌ Error dumping data to sheet: ${error.toString()}`))
                    .build();
            }
        },
        HighlightRange: (e) => {
            const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
            try {
                // extract parameters
                const a1n = e?.commonEventObject?.parameters?.a1n || 'A1';
                const sheetName = e?.commonEventObject?.parameters?.sheetName || activeSpreadsheet.getActiveSheet().getName();
                const sheet = activeSpreadsheet.getSheetByName(sheetName);
                const range = sheet.getRange(a1n);
                // Highlight the range with a yellow background
                const hightlightColor = PropertiesService.getUserProperties().getProperty(Addon.INPUT_PARAMETERS.highlight_color) || '#FFFF00';
                range.setBackground(hightlightColor);

                // Return action response with notification
                return CardService.newActionResponseBuilder()
                    .setNotification(
                        CardService.newNotification()
                            .setText(`✅ Highlighted range "${a1n}" in sheet "${sheetName}".`))
                    .build();
            }
            catch (error) {
                return CardService.newActionResponseBuilder()
                    .setNotification(
                        CardService.newNotification()
                            .setText(`⚠️ Error highlighting range: ${error.toString()}`))
                    .build();
            }
        }
    },
    View: {
        HomeCard: (result = {}) => {
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
                .setHeader('📋 Detailed Results')
                .setCollapsible(true)
                .setNumUncollapsibleWidgets(4);

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
                            .BuildExportWidget(result.range.getSheet().getName(), result.range, result.report)
                    )
            );
            return cardBuilder.build();
        },
        BuildResultCard: (result = {}) => {
            return Addon.ResultWidget.View.HomeCard(result);
        },
        BuildResultSummarySection: (range, report) => {
            return CardService.newCardSection()
                .setHeader('📊 Failures Report')
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
                        .setTopLabel('Summary')
                        .setText(`Total: ${range.getNumRows() * range.getNumColumns()}`
                            + ` | Successes: ${report.filter(item => !item.error).length}`
                            + ` | Failures: ${report.filter(item => item.error).length}`)
                        .setWrapText(true)
                        .setStartIcon(
                            CardService.newIconImage()
                                .setMaterialIcon(
                                    CardService.newMaterialIcon()
                                        .setName('assessment'))));
        },
        BuildResultWidget: (reportItem = {}) => {
            return CardService.newDecoratedText()
                //.setTopLabel(`${reportItem.a1n}`)
                .setText(`⚠️ ${reportItem.a1n}`)
                .setWrapText(true)
                .setBottomLabel(`${reportItem.error}`)
                .setButton(
                    CardService.newTextButton()
                        .setAltText('Highlight')
                        .setMaterialIcon(
                            CardService.newMaterialIcon()
                                .setName('highlight'))
                        .setOnClickAction(
                            CardService.newAction()
                                .setFunctionName('Addon.ResultWidget.Controller.HighlightRange')
                                .setParameters({
                                    a1n: reportItem.a1n,
                                    sheetName: reportItem.sheetName || ''
                                })
                        )
                );
        },
        BuildExportWidget: (sheetName = '', range = '', report = []) => {
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
                                    sheetName: sheetName,
                                    report: JSON.stringify(report),
                                    a1n: range.getA1Notation()
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