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
    version: '1.12.0',
    build: '20260307.094300',
    author: 'Easy ADM (by Ilan Laloum)',
    website: 'https://www.easyadm.com',
    license: 'MIT License - see LICENSE file',
    imageUrl: Addon.Media.LOGO_PNG_URL,
    gitRepository: 'https://github.com/ilanlal/ss-json-editor'
};

Addon.INPUT_PARAMETERS = {
    get MEMBERSHIP_PROPERTY_KEY() {
        return 'membership';
    },
    get format_indent_increase() {
        return 'format_indent_increase';
    },
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
    },
    get GEMINI_API_KEY() {
        return 'GEMINI_API_KEY';
    },
    get GEMINI_MODEL() {
        return 'GEMINI_MODEL';
    },
    get isPremium() {
        return 'isPremium';
    },
    get balance() {
        return 'balance';
    },
    get expiresAt() {
        return 'expiresAt';
    },
    get createdOn() {
        return 'createdOn';
    }
};

Addon.Modules = {
    App: {
        get DEFAULT_INDENTATION_SPACES() {
            return '2';
        },
        getData() {
            const INP = Addon.INPUT_PARAMETERS;
            const MDL = Addon.Modules;
            const userProperties = PropertiesService.getUserProperties();
            const rawData = userProperties.getProperty(INP.MEMBERSHIP_PROPERTY_KEY);
            const membershipInfo = rawData ? JSON.parse(rawData) : {};
            const expiresAt = membershipInfo.expiresAt ? new Date(membershipInfo.expiresAt) : null;
            const balance = membershipInfo.balance || 0;
            const isPremium = (expiresAt && expiresAt > new Date()) || balance > 0;
            const indentationSpaces = userProperties.getProperty(INP.indentation_spaces) || MDL.App.DEFAULT_INDENTATION_SPACES;
            const showErrorsSwitch = userProperties.getProperty(INP.show_errors_switch) || 'ON';
            const highlightColor = userProperties.getProperty(INP.highlight_color) || '#FFFF00';
            const terminalOutputSwitch = userProperties.getProperty(INP.terminal_output_switch) || 'OFF';
            const focusTerminalOutput = userProperties.getProperty(INP.focus_terminal_output) || 'OFF';
            const ignoreWhitespaceSwitch = userProperties.getProperty(INP.ignore_whitespace_switch) || 'ON';
            const geminiApiKey = MDL.GeminiAPI.getApiKey();
            const apiResponseModel = MDL.GeminiAPI.getModel();

            return {
                indentation_spaces: parseInt(indentationSpaces, 10),
                show_errors_switch: showErrorsSwitch,
                highlight_color: highlightColor,
                terminal_output_switch: terminalOutputSwitch,
                focus_terminal_output: focusTerminalOutput,
                ignore_whitespace_switch: ignoreWhitespaceSwitch,
                GEMINI_API_KEY: geminiApiKey,
                GEMINI_MODEL: apiResponseModel,
                membership: membershipInfo,
                isPremium: isPremium,
                // Membership Info
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
    Membership: class {
        static get DEFAULT_LICENSE_KEY() {
            return "TRIAL";
        }

        static get DEFAULT_TRIAL_DAYS() {
            return 90;
        }

        static get DEFAULT_TRIAL_BALANCE() {
            return 5000;
        }

        static get MEMBERSHIP_PROPERTY_KEY() {
            return Addon.INPUT_PARAMETERS.MEMBERSHIP_PROPERTY_KEY;
        }

        static activate(days = this.DEFAULT_TRIAL_DAYS, balance = this.DEFAULT_TRIAL_BALANCE, licenseKey = this.DEFAULT_LICENSE_KEY) {
            // Create membership info with specified parameters
            const membershipInfo = this.createMembershipInfo(days, balance, licenseKey);
            // Save membership info to user properties
            this.setMembershipInfo(membershipInfo);
            return membershipInfo;
        }

        static revoke() {
            // Simulate revocation logic
            PropertiesService.getUserProperties().deleteProperty(this.MEMBERSHIP_PROPERTY_KEY);
            return true;
        }

        static createMembershipInfo(days = this.DEFAULT_TRIAL_DAYS, balance = this.DEFAULT_TRIAL_BALANCE, licenseKey = this.DEFAULT_LICENSE_KEY) {
            const membership = {
                createdOn: new Date().toISOString(),
                licenseKey: licenseKey,
                // Add the specified number of days to the current date
                expiresAt: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString(),
                balance: balance
            }
            return membership;
        }

        static getMembershipInfo() {
            const membershipData = PropertiesService.getUserProperties().getProperty(this.MEMBERSHIP_PROPERTY_KEY);
            if (!membershipData) {
                return null;
            }

            try {
                const { licenseKey, type, createdOn, expiresAt, balance = 0 } = JSON.parse(membershipData);
                return { licenseKey, type, createdOn, expiresAt, balance };
            } catch (error) {
                return null;
            }
        }

        static setMembershipInfo(membershipInfo = {}) {
            PropertiesService.getUserProperties().setProperty(this.MEMBERSHIP_PROPERTY_KEY, JSON.stringify(membershipInfo));
            return membershipInfo;
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
            return 10;
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
            const sheetName = activeSpreadsheet.getActiveSheet().getName();
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
                            sheetName: sheetName,
                            error: error.message,
                            cellValue: cell
                        });
                    }
                });
            });

            return { range: activeRange, report };
        }

        static validateActiveCell(activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet(), ignoreWhitespace = false) {
            const selectedCell = activeSpreadsheet.getActiveSheet().getCurrentCell();
            let activeCellValue = selectedCell.getValue();

            if (ignoreWhitespace && typeof activeCellValue === 'string') {
                activeCellValue = activeCellValue.trim();
                // If the cell is empty after trimming, consider it valid (or skip validation)
                if (activeCellValue === '') {
                    return {
                        a1n: selectedCell.getA1Notation(),
                        isValid: true,
                        cellValue: activeCellValue
                    };
                }
            }

            try {
                JSON.parse(activeCellValue);
                return {
                    a1n: selectedCell.getA1Notation(),
                    isValid: true,
                    cellValue: activeCellValue
                };
            }
            catch (error) {
                return {
                    a1n: selectedCell.getA1Notation(),
                    isValid: false,
                    cellValue: activeCellValue,
                    error: error.message
                };
            }
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
    },
    GeminiAPI: class {
        static get DEFAULT_MODEL() {
            return 'gemini-3-flash-preview';
        }

        static get MODELS() {
            return {
                'gemini-3-flash-preview': 'gemini-3-flash-preview',
                'gemini-2.5-pro': 'gemini-2.5-pro'
            };
        }

        static get API_ENDPOINT_URL() {
            return 'https://generativelanguage.googleapis.com/v1beta/models/';
        }

        /**
         * Generates content using the Gemini API.
         * @param {string} apiKey - The API key for authentication.
         * @param {string} model - The model name to use for content generation.
         * @param {{}} payload - The payload to send in the request.
         * @returns {{}} - The response content from the Gemini API.
         * @throws {Error} - If the API request fails.
         */
        static generateContent(apiKey, model, payload) {
            const url = `${this.API_ENDPOINT_URL}${model}:generateContent`;
            const options = {
                method: 'POST',
                contentType: 'application/json',
                headers: {
                    'x-goog-api-key': apiKey,
                },
                payload: JSON.stringify(payload)
            };

            const response = UrlFetchApp.fetch(url, options);
            if (response.getResponseCode() === 200) {
                return JSON.parse(response.getContentText());
            } else {
                throw new Error(`Gemini API request failed with status ${response.getResponseCode()}: ${response.getContentText()}`);
            }
        }

        static saveApiKey(apiKey) {
            PropertiesService.getScriptProperties().setProperty(Addon.INPUT_PARAMETERS.GEMINI_API_KEY, apiKey);
        }

        static getApiKey() {
            return PropertiesService.getScriptProperties().getProperty(Addon.INPUT_PARAMETERS.GEMINI_API_KEY);
        }

        static saveModel(model = this.DEFAULT_MODEL) {
            PropertiesService.getUserProperties().setProperty(Addon.INPUT_PARAMETERS.GEMINI_MODEL, model);
        }

        static getModel() {
            return PropertiesService.getUserProperties().getProperty(Addon.INPUT_PARAMETERS.GEMINI_MODEL) || this.DEFAULT_MODEL;
        }
    }
};

Addon.Home = {
    id: 'HomeAddon',
    name: 'Json Studio',
    short_description: 'JSON editing tools for Sheets',
    description: 'A collection of tools for editing and managing JSON data in Google Sheets.',
    version: '1.0.0',
    listOfTools: [
        {   // Validate Tool
            name: 'Validate',
            emoji: '✅',
            description: 'Verify selected JSON.',
            icon: 'check',
            action: 'Addon.Home.Controller.Validate'
        },
        {   // Beautify Tool
            name: 'Beautify',
            emoji: '🎨',
            description: 'Format your JSON data for better readability.',
            icon: 'brush',
            action: 'Addon.Home.Controller.Beautify'
        },
        {   // Minify Tool
            name: 'Minify',
            emoji: '💬',
            description: 'Minify your JSON data for compact representation.',
            icon: 'compress',
            action: 'Addon.Home.Controller.Minify'
        },
        {   // Fix Syntax Tool - Premium
            name: 'Fix Syntax',
            emoji: '💫',
            description: 'Automatically fix JSON syntax errors using AI.',
            icon: 'build', action: 'Addon.GeminiAssistant.Controller.FixJsonInActiveCell',
            requires: [Addon.INPUT_PARAMETERS.isPremium, Addon.INPUT_PARAMETERS.GEMINI_API_KEY]
        },
        {   // Generate JSON Tool - Premium
            name: 'Generate JSON',
            emoji: '💫',
            description: 'Generate JSON content using AI based on sheet data.',
            icon: 'flash_on',
            action: 'Addon.GeminiAssistant.Controller.GenerateJsonContent',
            requires: [Addon.INPUT_PARAMETERS.isPremium, Addon.INPUT_PARAMETERS.GEMINI_API_KEY]
        }
    ],
    Controller: {
        PushHomeCard: (e) => {
            // Build and return the Home Card
            const data = Addon.Modules.App.getData();

            // Return action response to update card
            return CardService.newActionResponseBuilder()
                .setNavigation(
                    CardService.newNavigation()
                        .pushCard(
                            Addon.Home.View.HomeCard(data)))
                .build();
        },
        UpdateHomeCard: (e) => {
            // Build and return the Home Card
            const data = Addon.Modules.App.getData();

            // Return action response to update card
            return CardService.newActionResponseBuilder()
                .setNavigation(
                    CardService.newNavigation()
                        .updateCard(
                            Addon.Home.View.HomeCard(data)))
                .build();
        },
        PushAboutCard: (e) => {
            // Build and return the About Card
            const data = Addon.Modules.App.getData();
            return CardService.newActionResponseBuilder()
                .setNavigation(
                    CardService.newNavigation()
                        .pushCard(Addon.Home.View.AboutCard(data))
                ).build();
        },
        PushHelpCard: (e) => {
            // Build and return the Help Card
            const data = Addon.Modules.App.getData();
            return CardService.newActionResponseBuilder()
                .setNavigation(
                    CardService.newNavigation()
                        .pushCard(Addon.Home.View.HelpCard(data))
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

            if (!data[Addon.INPUT_PARAMETERS.GEMINI_API_KEY]) {
                cardBuilder.addSection(
                    Addon.GeminiAssistant.View.BuildWelcomeSection(data));
            }

            // Add section for available tools
            Addon.Home.listOfTools.forEach(tool => {
                cardBuilder.addSection(
                    Addon.Home.View._BuildToolSection(data, tool));
            });

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
                            .setFunctionName('Addon.UserProfile.Controller.PushHomeCard'))));
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
                    // Add website link
                    .addWidget(
                        CardService.newTextButton()
                            .setText('🌐 Visit Website')
                            .setOpenLink(
                                CardService.newOpenLink()
                                    .setUrl(Addon.Package.website)))
                    // Documentation link
                    .addWidget(
                        CardService.newTextButton()
                            .setText('📄 Documentation')
                            .setOpenLink(
                                CardService.newOpenLink()
                                    .setUrl(`${Addon.Package.gitRepository}#readme`)))
                    // GitHub link
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

            // 4. Website & Contact Section
            cardBuilder.addSection(CardService.newCardSection()
                .setHeader('📞 Contact & Website')
                .addWidget(CardService.newTextButton()
                    .setText('🌐 Visit Website')
                    .setOpenLink(CardService.newOpenLink()
                        .setUrl(Addon.Package.website))));

            return cardBuilder.build();
        },
        _BuildToolSection: (data = {}, tool = {}) => {
            // Check if tool has requirements and if they are met
            const requirementsMet = !tool.requires || tool.requires.every(req => data[req]);

            const section = CardService.newCardSection()
                .setHeader(`${tool.emoji} ${tool.name}`)
                .setCollapsible(true)
                .setNumUncollapsibleWidgets(0);

            // If requirements are not met, show a warning and disable the button
            if (!requirementsMet) {
                // Determine which requirements are not met for the warning message
                const unmetRequirements = tool.requires.filter(req => !data[req]);
                const requirementMessages = {
                    [Addon.INPUT_PARAMETERS.isPremium]: 'Premium Membership required',
                    [Addon.INPUT_PARAMETERS.GEMINI_API_KEY]: 'Gemini API Key required'
                };
                const unmetMessages = unmetRequirements.map(req => requirementMessages[req] || 'Unknown requirement').join(' & ');
                section.addWidget(CardService.newDecoratedText()
                    .setText(`⚠️ ${unmetMessages}`)
                    .setWrapText(true)
                    .setStartIcon(CardService.newIconImage().setMaterialIcon(
                        CardService.newMaterialIcon().setName('warning')
                    )));
            }

            // Build the decorated text with a button for the tool
            const decoratedText = CardService.newDecoratedText()
                .setText(`${tool.emoji} ${tool.name}`)
                .setBottomLabel(tool.description)
                .setWrapText(true)
                .setButton(
                    CardService.newTextButton()
                        // Disable button if requirements are not met
                        .setDisabled(!requirementsMet)
                        .setText(tool.name)
                        .setAltText(`${tool.name} JSON within selected cells`)
                        .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
                        .setMaterialIcon(
                            CardService.newMaterialIcon()
                                .setName(tool.icon)
                                .setFill(false)
                        )
                        .setOnClickAction(
                            CardService.newAction()
                                .setFunctionName(`${tool.action}`)
                        )
                );

            // Add the decorated text to the section
            section.addWidget(decoratedText);
            return section;
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
                            .setFunctionName('Addon.Settings.Controller.PushHomeCard')))
                    .addButton(CardService.newTextButton()
                        .setText('Help & Support')
                        .setOnClickAction(CardService.newAction()
                            .setFunctionName('Addon.Home.Controller.PushHelpCard')))
                    .addButton(CardService.newTextButton()
                        .setText('About')
                        .setOnClickAction(CardService.newAction()
                            .setFunctionName('Addon.Home.Controller.PushAboutCard')))
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
        PushHomeCard: (e) => {
            // Build and return the Settings Home Card
            const appModelData = Addon.Modules.App.getData();
            return CardService.newActionResponseBuilder()
                .setNavigation(
                    CardService.newNavigation()
                        .pushCard(Addon.Settings.View.HomeCard({ ...appModelData }))
                ).build();
        },
        SaveSettings: (e) => {
            // ignore_whitespace_switch
            const ignoreWhitespaceState = e?.commonEventObject
                ?.formInputs?.[Addon.INPUT_PARAMETERS.ignore_whitespace_switch]
                ?.stringInputs?.value[0] || "ON";
            PropertiesService.getUserProperties().setProperty(Addon.INPUT_PARAMETERS.ignore_whitespace_switch, ignoreWhitespaceState);

            // indentation_spaces
            const selectedSpaces = e?.commonEventObject
                ?.formInputs?.[Addon.INPUT_PARAMETERS.indentation_spaces]
                ?.stringInputs?.value[0] || "2";
            PropertiesService.getUserProperties().setProperty(Addon.INPUT_PARAMETERS.indentation_spaces, selectedSpaces);

            // highlight_color
            const highlightColor = e?.commonEventObject
                ?.formInputs?.[Addon.INPUT_PARAMETERS.highlight_color]
                ?.stringInputs?.value[0] || "#FFFF00";
            PropertiesService.getUserProperties().setProperty(Addon.INPUT_PARAMETERS.highlight_color, highlightColor);


            // show_errors_switch
            const showErrorsState = e?.commonEventObject
                ?.formInputs?.[Addon.INPUT_PARAMETERS.show_errors_switch]
                ?.stringInputs?.value[0] || "OFF";
            PropertiesService.getUserProperties().setProperty(Addon.INPUT_PARAMETERS.show_errors_switch, showErrorsState);

            // terminal_output_switch
            const terminalOutputState = e?.commonEventObject
                ?.formInputs?.[Addon.INPUT_PARAMETERS.terminal_output_switch]
                ?.stringInputs?.value[0] || "ON";
            PropertiesService.getUserProperties().setProperty(Addon.INPUT_PARAMETERS.terminal_output_switch, terminalOutputState);


            // Build and return the Home Card
            const data = Addon.Modules.App.getData();
            return CardService.newActionResponseBuilder()
                .setNavigation(
                    CardService.newNavigation()
                        .popToRoot()
                        .updateCard(
                            Addon.Home.View.HomeCard(data))
                ).build();
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

            // Add audit settings section
            const auditSettingsSection = Addon.Settings.View._BuildAuditSettingsSection(data);
            cardBuilder.addSection(auditSettingsSection);

            // Add parsing settings section
            const parsingSettingsSection = Addon.Settings.View._BuildParseOptionsSection(data);
            cardBuilder.addSection(parsingSettingsSection);

            // Add UX settings section
            const uxSettingsSection = Addon.Settings.View._BuildUxOptionsSection(data);
            cardBuilder.addSection(uxSettingsSection);

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
        },
        _BuildAuditSettingsSection(data = {}) {
            const auditSection = CardService.newCardSection()
                .setHeader('Audit Settings')
                .setCollapsible(true)
                .setNumUncollapsibleWidgets(0);
            // Add a divider
            auditSection.addWidget(CardService.newDivider());

            // create enable terminal output decorated text with switch widget
            const enableTerminalOutput = CardService.newDecoratedText()
                .setText('Enable Terminal Output')
                .setBottomLabel('Toggle to enable or disable output of detailed logs and information to the sheet terminal for debugging purposes.')
                .setWrapText(true)
                .setStartIcon(
                    CardService.newIconImage().setMaterialIcon(
                        CardService.newMaterialIcon()
                            .setName('terminal')
                    ))
                .setSwitchControl(
                    CardService.newSwitch()
                        .setFieldName(Addon.INPUT_PARAMETERS.terminal_output_switch)
                        .setValue('ON')
                        .setSelected(data?.[Addon.INPUT_PARAMETERS.terminal_output_switch] === 'ON')
                        .setControlType(CardService.SwitchControlType.CHECK_BOX)
                );

            auditSection.addWidget(enableTerminalOutput);

            return auditSection;
        },
        _BuildParseOptionsSection(data = {}) {
            const parsingSection = CardService.newCardSection()
                .setHeader('Parsing Settings')
                .setCollapsible(true)
                .setNumUncollapsibleWidgets(0);

            // add ignore whitespace decorated text with switch widget
            const ignoreWhitespaceDecoratedText = CardService.newDecoratedText()
                .setText('Ignore Whitespace')
                .setBottomLabel('Ignore empty cells or cells with only whitespace during JSON operations.')
                .setWrapText(true)
                .setStartIcon(
                    CardService.newIconImage().setMaterialIcon(
                        CardService.newMaterialIcon()
                            .setName('ignore_changes')
                    ))
                .setSwitchControl(
                    CardService.newSwitch()
                        .setFieldName(Addon.INPUT_PARAMETERS.ignore_whitespace_switch)
                        .setValue('ON')
                        .setSelected(data.ignore_whitespace_switch === 'ON')
                        .setControlType(CardService.SwitchControlType.CHECK_BOX)
                );

            parsingSection.addWidget(ignoreWhitespaceDecoratedText);

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
            parsingSection.addWidget(indentationLevelSelector);

            // add divider
            parsingSection.addWidget(CardService.newDivider());

            // Create a selection input for highlight color
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
            parsingSection.addWidget(highlightColor);

            return parsingSection;
        },
        _BuildUxOptionsSection(data = {}) {
            const uxSection = CardService.newCardSection()
                .setHeader('UX Settings')
                .setCollapsible(true)
                .setNumUncollapsibleWidgets(0);

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

            uxSection.addWidget(showErrorsDecoratedText);

            return uxSection;
        }
    }
};

Addon.GeminiAssistant = {
    id: 'GeminiAssistantPlugin',
    name: 'Gemini Assistant',
    short_description: 'AI-powered assistant for your JSON data',
    description: 'Get intelligent suggestions and improvements for your JSON data using Gemini AI. This plugin analyzes your JSON and provides recommendations for optimization, error correction, and best practices.',
    version: '1.0.0',
    imageUrl: Addon.Media.BIG_TIME_IMG_URL,
    Controller: {
        PushHomeCard(e) {
            try {
                // Extract any necessary data from the event object if needed
                // const formInputs = e?.commonEventObject?.formInputs || {};
                let data = Addon.Modules.App.getData();

                return CardService.newActionResponseBuilder()
                    .setNavigation(
                        CardService.newNavigation()
                            .pushCard(
                                Addon.GeminiAssistant.View.HomeCard(data))
                    ).build();
            }
            catch (error) {
                return CardService.newActionResponseBuilder()
                    .setNotification(CardService.newNotification()
                        .setText('An error occurred while loading Gemini Suggestions.'))
                    .build();
            }
        },
        PushSetupCard(e) {
            try {
                let data = Addon.Modules.App.getData();

                return CardService.newActionResponseBuilder()
                    .setNavigation(
                        CardService.newNavigation()
                            .pushCard(
                                Addon.GeminiAssistant.View.SetupCard(data))
                    ).build();
            }
            catch (error) {
                return CardService.newActionResponseBuilder()
                    .setNotification(CardService.newNotification()
                        .setText('An error occurred while loading Gemini API settings.'))
                    .build();
            }
        },
        SaveSettings(e) {
            try {
                const formInputs = e?.commonEventObject?.formInputs || {};
                // Extract the Gemini API key from the form inputs
                const apiKey = formInputs?.[Addon.INPUT_PARAMETERS.GEMINI_API_KEY]?.stringInputs?.value[0];
                // Extract the Gemini model from the form inputs
                const model = formInputs?.[Addon.INPUT_PARAMETERS.GEMINI_MODEL]?.stringInputs?.value[0];

                // Save the Gemini model selection
                Addon.Modules.GeminiAPI.saveApiKey(apiKey);
                // Save the Gemini model selection
                Addon.Modules.GeminiAPI.saveModel(model);

                return CardService.newActionResponseBuilder()
                    .setNotification(CardService.newNotification()
                        .setText('Settings saved successfully.'))
                    .build();
            } catch (error) {
                return CardService.newActionResponseBuilder()
                    .setNotification(CardService.newNotification()
                        .setText('An error occurred while saving settings.' + error.toString()))
                    .build();
            }
        },
        FixJsonInActiveCell(e) {
            const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();

            try {
                const apiKey = Addon.Modules.GeminiAPI.getApiKey();
                const model = Addon.Modules.GeminiAPI.getModel();

                const sheet = activeSpreadsheet.getActiveSheet();

                // The cell wich content we want to fix or generate new content for.
                const activeCell = sheet.getActiveCell();

                const systemInstruction = {
                    "parts": [
                        {
                            "text": "You are a helpful assistant integrated within Google Sheets, designed to analyze sheet contents and generate JSON content given cell (active cell) based on the data in the sheet. The user wants to generate JSON content for the active cell based on the data in the sheet. The active cell may contain incomplete or unformatted JSON content, and your task is to analyze the content of the active cell along with the data from the sheet and generate properly formatted and structured JSON content that can be used within Google Sheets. Your response should be concise, accurate, and formatted according to the specified schema for easy integration back into Google Sheets."
                        }
                    ]
                };
                // Sheet name and values (relative to the active cell) to learn from.
                const learningRange = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn());
                const learningValues = learningRange.getValues();
                if (!learningValues || learningValues.length === 0) {
                    throw new Error('No data found in the sheet. Please ensure your sheet contains data to generate JSON content from.');
                }
                const payload = {
                    systemInstruction,
                    "generationConfig": {
                        "responseMimeType": "application/json",
                        "thinkingConfig": {
                            "includeThoughts": false,
                            "thinkingLevel": "MINIMAL"
                        },
                        // Optional. Controls the randomness of the output.
                        // When using Gemini 3 models, we strongly recommend keeping the temperature at its default value of 1.0 to maintain the quality and relevance of the generated suggestions. Adjusting the temperature can lead to less coherent or less useful responses, as Gemini 3 models are optimized for a balanced output at this setting. If you choose to experiment with different temperature values, please do so with caution and thoroughly evaluate the results to ensure they meet your expectations for accuracy and usefulness in analyzing JSON data.
                        "temperature": 1.0,
                        // The maximum cumulative probability of tokens to consider when sampling.
                        //"topP": 0.9,
                        // The maximum number of tokens to consider when sampling.
                        //"topK": 40,
                        // "maxOutputTokens": 1000,
                        "responseSchema": {
                            "type": "string",
                            "format": "json",
                            "nullable": false,
                            // A regex pattern to ensure the generated content is a valid JSON string, starting with { and ending with }, allowing for nested structures. This pattern helps to validate that the AI's response adheres to the expected JSON format, which is crucial for parsing and utilizing the generated suggestions effectively within Google Sheets.
                            "pattern": "^\\{(?:[^{}]|(?R))*\\}$",
                            "title": "Fixed JSON Content",
                            "description": "This string contains the generated fixed JSON content based on the analysis of the input data and system instructions. The content is formatted as a JSON string, which can be parsed and utilized within Google Sheets for various purposes such as data manipulation, error correction, or optimization suggestions. The structure and content of the generated JSON will depend on the specific instructions provided to the AI model and the input data it analyzed."
                        }
                    },
                    "contents": [
                        {
                            "role": "user",
                            "parts": [
                                {
                                    "text": `The user is working on a sheet named "${sheet.getName()}" and wants to generate JSON content based on the data in the sheet. The active cell is ${activeCell.getA1Notation()} (A1 Notation) and contains the following content: ${activeCell.getValue()}. Please generate new JSON content for the active cell based on the data in the sheet, ensuring that the generated content is properly formatted and structured for use within Google Sheets.`
                                },
                                {
                                    "text": "Here is the data matrix from the sheet to learn from: " + JSON.stringify(learningValues)
                                }
                            ]
                        }
                    ]
                };
                const result = Addon.Modules.GeminiAPI.generateContent(apiKey, model, payload);

                const generatedText = result?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
                const fixedJsonSyntax = JSON.stringify(JSON.parse(generatedText), null, 2);

                activeCell.setValue(fixedJsonSyntax);

                return CardService.newActionResponseBuilder()
                    .setNotification(CardService.newNotification()
                        .setText('JSON syntax has been fixed in the active cell. (use Ctrl+Z to undo)'))
                    .build();
            }
            catch (error) {
                return CardService.newActionResponseBuilder()
                    .setNotification(CardService.newNotification()
                        .setText('An error occurred while fixing JSON in the active cell.' + error.toString()))
                    .build();
            }
        },
        GenerateJsonContent(e) {
            const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();

            try {
                const apiKey = Addon.Modules.GeminiAPI.getApiKey();
                const model = Addon.Modules.GeminiAPI.getModel();

                const sheet = activeSpreadsheet.getActiveSheet();

                // The cell wich content we want to fix or generate new content for.
                const activeCell = sheet.getCurrentCell();
                if (!activeCell) {
                    throw new Error('No active cell found. Please select a cell to generate JSON content for.');
                }

                // Sheet name and values (relative to the active cell) to learn from.
                const dataRange = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn());
                const dataValues = dataRange.getValues();
                if (!dataValues || dataValues.length === 0) {
                    throw new Error('No data found in the sheet. Please ensure your sheet contains data to generate JSON content from.');
                }

                const systemInstruction = {
                    "parts": [
                        {
                            "text": "You are a helpful assistant integrated within Google Sheets, designed to analyze sheet contents and generate JSON content given cell (active cell) based on the data in the sheet. The user wants to generate JSON content for the active cell based on the data in the sheet. The active cell may contain incomplete or unformatted JSON content, and your task is to analyze the content of the active cell along with the data from the sheet and generate properly formatted and structured JSON content that can be used within Google Sheets. Your response should be concise, accurate, and formatted according to the specified schema for easy integration back into Google Sheets."
                        }
                    ]
                };

                const payload = {
                    systemInstruction,
                    "generationConfig": {
                        "responseMimeType": "application/json",
                        "thinkingConfig": {
                            "includeThoughts": false,
                            "thinkingLevel": "MINIMAL"
                        },
                        // Optional. Controls the randomness of the output.
                        // When using Gemini 3 models, we strongly recommend keeping the temperature at its default value of 1.0 to maintain the quality and relevance of the generated suggestions. Adjusting the temperature can lead to less coherent or less useful responses, as Gemini 3 models are optimized for a balanced output at this setting. If you choose to experiment with different temperature values, please do so with caution and thoroughly evaluate the results to ensure they meet your expectations for accuracy and usefulness in analyzing JSON data.
                        "temperature": 1.0,
                        // The maximum cumulative probability of tokens to consider when sampling.
                        //"topP": 0.9,
                        // The maximum number of tokens to consider when sampling.
                        //"topK": 40,
                        // "maxOutputTokens": 1000,
                        "responseSchema": {
                            "type": "string",
                            "format": "json",
                            "nullable": false,
                            // A regex pattern to ensure the generated content is a valid JSON string, starting with { and ending with }, allowing for nested structures. This pattern helps to validate that the AI's response adheres to the expected JSON format, which is crucial for parsing and utilizing the generated suggestions effectively within Google Sheets.
                            "pattern": "^\\{(?:[^{}]|(?R))*\\}$",
                            "title": "Generated JSON Content",
                            "description": "This string contains the generated JSON content based on the analysis of the input data and system instructions. The content is formatted as a JSON string, which can be parsed and utilized within Google Sheets for various purposes such as data manipulation, error correction, or optimization suggestions. The structure and content of the generated JSON will depend on the specific instructions provided to the AI model and the input data it analyzed."
                        }
                    },
                    "contents": [
                        {
                            "role": "user",
                            "parts": [
                                {
                                    "text": `The user is working on a sheet named "${sheet.getName()}" and wants to generate JSON content based on the data in the sheet. The active cell is ${activeCell.getA1Notation()} (A1 Notation) and contains the following content: ${activeCell.getValue()}. Please generate new JSON content for the active cell based on the data in the sheet, ensuring that the generated content is properly formatted and structured for use within Google Sheets.`
                                },
                                {
                                    "text": "Here is the data matrix of the sheet content to base the JSON generation on: " + JSON.stringify(dataValues)
                                }
                            ]
                        }
                    ]
                };
                const result = Addon.Modules.GeminiAPI.generateContent(apiKey, model, payload);

                const generatedText = result?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
                const fixedJsonSyntax = JSON.stringify(JSON.parse(generatedText), null, 2);

                activeCell.setValue(fixedJsonSyntax);

                return CardService.newActionResponseBuilder()
                    .setNotification(CardService.newNotification()
                        .setText('JSON content has been generated for the active cell. (use Ctrl+Z to undo)'))
                    .build();
            }
            catch (error) {
                return CardService.newActionResponseBuilder()
                    .setNotification(CardService.newNotification()
                        .setText('An error occurred while generating JSON content for the active cell. ' + error.toString()))
                    .build();
            }
        }
    },
    View: {
        HomeCard: (data = {}) => {
            const cardBuilder = CardService.newCardBuilder()
                .setName(Addon.GeminiAssistant.id + '-Home')
                .setHeader(CardService.newCardHeader()
                    .setTitle(Addon.GeminiAssistant.name)
                    .setSubtitle(Addon.GeminiAssistant.short_description)
                    .setImageStyle(CardService.ImageStyle.SQUARE)
                    .setImageUrl(Addon.GeminiAssistant.imageUrl)
                    .setImageAltText('Gemini Assistant Logo'));

            cardBuilder.addSection(
                Addon.GeminiAssistant.View
                    .BuildModelSelectorSection(data));

            return cardBuilder.build();
        },
        SetupCard: (data = {}) => {
            const cardBuilder = CardService.newCardBuilder()
                .setName(Addon.GeminiAssistant.id + '-Results');

            // Add a section for Gemini API key input
            cardBuilder.addSection(
                Addon.GeminiAssistant.View
                    .BuildGeminiApiKeyInputSection(data));

            // Add a section for selecting Gemini model
            cardBuilder.addSection(
                Addon.GeminiAssistant.View
                    .BuildModelSelectorSection(data));

            // Add a button to save Gemini API settings
            cardBuilder.addSection(
                CardService.newCardSection()
                    .addWidget(CardService.newTextButton()
                        .setText('Save Gemini API Settings')
                        .setOnClickAction(CardService.newAction()
                            .setFunctionName('Plugins.GeminiAssistant.Controller.SaveSettings')
                            .addRequiredWidget(Addon.INPUT_PARAMETERS.GEMINI_API_KEY)
                            .addRequiredWidget(Addon.INPUT_PARAMETERS.GEMINI_MODEL))));

            return cardBuilder.build();
        },
        BuildWelcomeSection(data = {}, hasApiKey = false) {
            const section = CardService.newCardSection()
                .setHeader('Welcome to Gemini Assistant!');

            // Add a welcoming message prompting the user to enter their Gemini API key in the settings
            section.addWidget(CardService.newTextParagraph()
                .setText('Welcome! Please enter your Gemini API key in the settings to get started.'));

            // Add a text input for the gemini API key.
            section.addWidget(CardService.newTextInput()
                .setVisibility(hasApiKey ? CardService.Visibility.HIDDEN : CardService.Visibility.VISIBLE)
                .setFieldName(Addon.INPUT_PARAMETERS.GEMINI_API_KEY)
                .setTitle('Gemini API Key')
                .setHint('Enter your Gemini API key')
                .setValue(data[Addon.INPUT_PARAMETERS.GEMINI_API_KEY] || ''));

            // Add divider
            section.addWidget(CardService.newDivider());

            // Add Launch Gemini Assistant button
            section.addWidget(CardService.newTextButton()
                .setText('Launch Gemini Assistant')
                .setMaterialIcon(CardService.newMaterialIcon().setName('rocket_launch'))
                .setOnClickAction(CardService.newAction()
                    .setFunctionName('Plugins.GeminiAssistant.Controller.PushSetupCard')));

            return section;
        },
        BuildModelSelectorSection(data = {}) {
            const section = CardService.newCardSection();

            // Add a dropdown to select the Gemini model
            const geminiModelSelector = CardService.newSelectionInput()
                .setType(CardService.SelectionInputType.DROPDOWN)
                .setTitle('Select Gemini Model')
                .setFieldName(Addon.INPUT_PARAMETERS.GEMINI_MODEL);

            // Loop through the available Gemini models and add them as options to the selector
            const geminiModels = Addon.Modules.GeminiAPI.MODELS;
            for (const modelKey in geminiModels) {
                const model = geminiModels[modelKey];
                geminiModelSelector.addItem(model, modelKey, data[Addon.INPUT_PARAMETERS.GEMINI_MODEL] === modelKey);
            }

            section.addWidget(geminiModelSelector);

            return section;
        },
        BuildGeminiApiKeyInputSection(data = {}) {
            return CardService.newCardSection()
                .setHeader('Gemini API Key Configuration')
                // Add divider
                .addWidget(CardService.newDivider())
                // Add text input for Gemini API key
                .addWidget(CardService.newTextInput()
                    .setFieldName(Addon.INPUT_PARAMETERS.GEMINI_API_KEY)
                    .setTitle('Gemini API Key')
                    .setHint('Enter your Gemini API key')
                    .setValue(data[Addon.INPUT_PARAMETERS.GEMINI_API_KEY] || '[YOUR GEMINI API KEY]'));
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
        PushHomeCard(e) {
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
                Addon.Modules.Membership.activate(
                    Addon.Modules.Membership.DEFAULT_TRIAL_DAYS,
                    Addon.Modules.Membership.DEFAULT_TRIAL_BALANCE,
                    'trial');

                // Build and return the Home Card
                const data = Addon.Modules.App.getData();
                return CardService.newActionResponseBuilder()
                    .setNavigation(
                        CardService.newNavigation()
                            .popToRoot()
                            .updateCard(
                                Addon.Home.View.HomeCard(data))
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
            return Addon.ConfirmationCard.Controller.PushHomeCard({
                commonEventObject: {
                    parameters: { title, message, onClickFunctionName, onClickParameters }
                }
            });
        },
        RevokeLicense(e) {
            try {
                // Simulate license revocation logic
                Addon.Modules.Membership.revoke();

                // Build and return the Home Card
                const data = Addon.Modules.App.getData();
                return CardService.newActionResponseBuilder()
                    .setNavigation(
                        CardService.newNavigation()
                            .popToRoot()
                            .updateCard(
                                Addon.Home.View.HomeCard(data))
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

            // 1. Membership Status & details Section            
            cardBuilder.addSection(Addon.UserProfile.View._BuildMembershipSection(data));

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
                    .setBottomLabel(data?.[Addon.INPUT_PARAMETERS.isPremium] ? 'Active' : 'Premium Only'));
            });

            cardBuilder.addSection(featureSection);

            return cardBuilder.build();
        },
        _BuildMembershipSection: (data = {}, membershipData = {}) => {
            const isPremium = data?.[Addon.INPUT_PARAMETERS.isPremium] || false;

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
                // Calculate days left until expiration
                const expiresAt = membershipData?.[Addon.INPUT_PARAMETERS.expiresAt] ? new Date(membershipData[Addon.INPUT_PARAMETERS.expiresAt]) : null;
                const daysLeft = expiresAt ? Math.ceil((expiresAt - new Date()) / (1000 * 60 * 60 * 24)) : null;

                // Display days left until expiration if available
                newSection.addWidget(CardService.newDecoratedText()
                    .setTopLabel(`Membership Expiration`)
                    .setText(expiresAt ? expiresAt.toDateString() : 'N/A')
                    .setStartIcon(CardService.newIconImage().setMaterialIcon(
                        CardService.newMaterialIcon().setName('event').setFill(false)))
                    .setBottomLabel(typeof daysLeft === 'number' ? `${daysLeft} day(s) left` : '')
                    .setWrapText(true));

                // Display balance if available
                newSection.addWidget(CardService.newDecoratedText()
                    .setTopLabel('Balance')
                    .setText(`${membershipData?.[Addon.INPUT_PARAMETERS.balance] || 0}`)
                    .setStartIcon(CardService.newIconImage().setMaterialIcon(
                        CardService.newMaterialIcon().setName('account_balance_wallet').setFill(false)))
                    .setWrapText(true));

                // Add a "Cancel Subscription" button for premium users
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