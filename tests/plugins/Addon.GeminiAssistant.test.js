require('..');
const PropertiesService = require('@ilanlal/gasmocks/src/properties/PropertiesService');
const { Addon } = require('../../src/Addon');
const UrlFetchAppStubConfiguration = require('@ilanlal/gasmocks/src/url-fetch/classes/UrlFetchAppStubConfiguration');
const HttpResponse = require('@ilanlal/gasmocks/src/url-fetch/classes/HttpResponse');

describe('Addon.GeminiAssistant', () => {
    const INP = Addon.INPUT_PARAMETERS;
    const MDL = Addon.Modules;
    describe('Controller', () => {
        const Controller = Addon.GeminiAssistant.Controller;
        const apiKey = 'test-api-key';
        beforeEach(() => {
            // Set up any necessary mocks or spies
            PropertiesService.getScriptProperties().setProperty(INP.GEMINI_API_KEY, apiKey);
            // Reset UrlFetchApp mock if necessary
            UrlFetchAppStubConfiguration.reset();

        });

        // PushHomeCard test
        it('should handle PushHomeCard', () => {
            const e = { parameters: {} };

            // Call the controller method expecte no errors and the response to contain the expected data
            let actionResponse = Controller.PushHomeCard(e);
            expect(actionResponse).toBeDefined();

            // Verify that the response contains a notification with the expected message (e.g., "Premium features activated!")
            let data = actionResponse.getData();
            expect(data).toBeDefined();

            const cardData = data.cardNavigations[0].pushCard;
            expect(cardData).toBeDefined();
            expect(cardData.name).toBe(Addon.GeminiAssistant.id + '-Home');
        });

        // PushSetupCard test
        it('should handle PushSetupCard', () => {
            const e = { parameters: {} };
            // Call the controller method expecte no errors and the response to contain the expected data
            let actionResponse = Controller.PushSetupCard(e);
            expect(actionResponse).toBeDefined();

            // Verify that the response contains a notification with the expected message (e.g., "Premium features activated!")
            let data = actionResponse.getData();
            expect(data).toBeDefined();

            if (!data.cardNavigations || data.cardNavigations.length === 0) {
                console.log(JSON.stringify(data, null, 2));
            }
            // Expect cardNavigations to be defined
            expect(data.cardNavigations).toBeDefined();

            const cardData = data.cardNavigations[0].pushCard;
            expect(cardData).toBeDefined();
            expect(cardData.name).toBe(Addon.GeminiAssistant.id + '-Setup');
        });

        // FixJsonInActiveCell test
        it('should handle FixJsonInActiveCell', () => {
            const e = { parameters: {} };
            const mockedActiveSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
            // Set header row with keys
            const sheet = mockedActiveSpreadsheet.getActiveSheet();
            // set header row with keys
            sheet.appendRow(['ID', 'Person', 'Action', 'Transaction', 'Amount', 'Currency', 'Date']);
            // Add a row with invalid JSON string in the 'Person' column (B)
            const invalidJson = '{"name:"John","age":30,"city":"New York"}';
            sheet.appendRow(['1', invalidJson, 'Purchase', 'TX123', '100', 'USD', '2024-01-01']);

            const expectedFixedJson = '{"name":"John","age":30,"city":"New York"}'; // Expected fixed JSON
            const model = MDL.GeminiAPI.MODELS['gemini-3-flash-preview'];

            // Mock the UrlFetchApp response for the Gemini API fixJsonSyntax call
            const url = MDL.GeminiAPI.API_ENDPOINT_URL + model + ':generateContent';

            UrlFetchAppStubConfiguration.when(url)
                .return(new HttpResponse()
                    .setContentText(
                        JSON.stringify({
                            data: {
                                candidates: [{
                                    content: {
                                        parts: [{ 'text': expectedFixedJson }]
                                    }
                                }]
                            }
                        })
                    )
                );

            // Call the controller method expecte no errors and the active cell to be updated with the fixed JSON
            let actionResponse = Controller.FixJsonInActiveCell(e);
            expect(actionResponse).toBeDefined();
            // Verify that the response contains a notification with the expected message (no 'error' in this case)
            let data = actionResponse.getData();
            expect(data).toBeDefined();
            expect(data.notification).toBeDefined();
            // no "error" in the notification message
            expect(data.notification.text.toLowerCase()).not.toContain('error');
        });

        // GenerateJsonContent test
        it('should handle GenerateJsonContent', () => {
            const e = { parameters: {} };
            const validJson = '{"name":"John","age":30,"city":"New York"}';
            const invalidJson = '{"name":"John","age":30,"city":"New York"'; // Missing closing brace
            // set up active spreadsheet
            const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
            // set A1 value to valid JSON
            activeSpreadsheet.getActiveSheet().appendRow([validJson]);
            // set A2 value to invalid JSON
            activeSpreadsheet.getActiveSheet().appendRow([invalidJson]);
            // set A1 as active cell
            activeSpreadsheet.getActiveSheet().setCurrentCell(
                activeSpreadsheet.getActiveSheet().getRange('A1')
            );

            // Mock the UrlFetchApp response for the Gemini API generateContent call
            const expectedResponse = '{"name":"John","age":30,"city":"New York"}';
            const model = MDL.GeminiAPI.MODELS['gemini-3-flash-preview'];
            const url = MDL.GeminiAPI.API_ENDPOINT_URL + model + ':generateContent';
            UrlFetchAppStubConfiguration.when(url)
                .return(new HttpResponse()
                    .setContentText(
                        JSON.stringify({
                            data: {
                                candidates: [{
                                    content: {
                                        parts: [{ 'text': expectedResponse }]
                                    }
                                }]
                            }
                        })
                    )
                );
            const actionResponse = Controller.GenerateJsonContent(e);
            expect(actionResponse).toBeDefined();
            const data = actionResponse.getData();
            expect(data).toBeDefined();

            // Verify that the response contains a notification with the expected message
            expect(data.notification).toBeDefined();
            expect(data.notification.text.toLowerCase()).not.toContain('error');
        });

        afterEach(() => {
            // Clean up any mocks or spies if necessary
            PropertiesService.getScriptProperties().deleteAllProperties();
        });

    });

    describe('View', () => {
        const View = Addon.GeminiAssistant.View;
    });

    it('should be defined', () => {
        expect(Addon.GeminiAssistant).toBeDefined();
    });
});
