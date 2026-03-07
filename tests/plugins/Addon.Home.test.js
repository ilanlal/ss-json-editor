require('..');
const { Addon } = require('../../src/Addon');

describe('Addon.Home tests', () => {
    beforeEach(() => {
        // UrlFetchAppStubConfiguration.reset();
    });

    describe('Controller', () => {
        const Controller = Addon.Home.Controller;
        beforeEach(() => {
            // UrlFetchAppStubConfiguration.reset();
        });

        // PushHomeCard test
        it('should handle PushHomeCard', () => {
            // mock event parameters
            const e = { parameters: {} };
            const homeCard = Controller.PushHomeCard(e);
            expect(homeCard).toBeDefined();
            const cardData = homeCard.getData();
            expect(cardData).toBeDefined();
            expect(cardData.cardNavigations).toBeDefined();
            expect(cardData.cardNavigations.length).toBeGreaterThan(0);
            expect(cardData.cardNavigations[0].pushCard).toBeDefined();
            // No notification
            expect(cardData.notification).toBeUndefined();
            // pushCard data
            const pushCardData = cardData.cardNavigations[0].pushCard;
            expect(pushCardData.name).toBe(Addon.Home.id + '-Home');
        });

        // PushHelpCard test
        it('should handle PushHelpCard', () => {
            // mock event parameters
            const e = { parameters: {} };
            const helpCard = Controller.PushHelpCard(e);
            expect(helpCard).toBeDefined();
            const cardData = helpCard.getData();
            expect(cardData).toBeDefined();
            // no notification
            expect(cardData.notification).toBeUndefined();
        });

        // PushAboutCard test
        it('should handle PushAboutCard', () => {
            // mock event parameters
            const e = { parameters: {} };
            const aboutCard = Controller.PushAboutCard(e);
            expect(aboutCard).toBeDefined();
            const cardData = aboutCard.getData();
            expect(cardData).toBeDefined();
            // no notification
            expect(cardData.notification).toBeUndefined();
        });

        // Beautify test
        it('should handle Beautify', () => {
            const inputJson = '{"name":"John","age":30,"city":"New York"}';
            // set up active spreadsheet
            const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
            // set A1 value to inputJson
            activeSpreadsheet.getActiveSheet().getRange('A1').setValue(inputJson);
            // set a1 as active range
            activeSpreadsheet.getActiveSheet().setActiveRange(
                activeSpreadsheet.getActiveSheet().getRange('A1')
            );
            // mock event parameters
            const e = { parameters: {} };
            const beautifyResult = Controller.Beautify(e);
            expect(beautifyResult).toBeDefined();
            const resultData = beautifyResult.getData();
            expect(resultData).toBeDefined();
            // notification
            expect(resultData.notification).toBeDefined();

            const expectedOutput = JSON.stringify(JSON.parse(inputJson), null, 2);

            expect(
                activeSpreadsheet.getActiveSheet().getActiveRange().getValue()
            ).toBe(expectedOutput);
        });

        // Minify test
        it('should handle Minify', () => {
            const inputJson = '{\n  "name": "John",\n  "age": 30,\n  "city": "New York"\n}';

            // set up active spreadsheet
            const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();

            // set A1 value to inputJson
            activeSpreadsheet.getActiveSheet().getRange('A1').setValue(inputJson);

            // set a1 as active range
            activeSpreadsheet.getActiveSheet().setActiveRange(
                activeSpreadsheet.getActiveSheet().getRange('A1')
            );

            // mock event parameters
            const e = { parameters: {} };
            const minifyResult = Controller.Minify(e);
            expect(minifyResult).toBeDefined();
            const resultData = minifyResult.getData();
            expect(resultData).toBeDefined();
            // notification
            expect(resultData.notification).toBeDefined();

            const expectedOutput = JSON.stringify(JSON.parse(inputJson));

            expect(
                activeSpreadsheet.getActiveSheet().getActiveRange().getValue()
            ).toBe(expectedOutput);
        });

        // Validate test
        it('should handle Validate', () => {
            const inputJson = '{"name":"John","age":30,"city":"New York"}';
            const invalidJson = '{"name":"John","age":30,"city":"New York"'; // missing closing }

            // set up active spreadsheet
            const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
            // set A1 value to inputJson
            activeSpreadsheet.getActiveSheet().appendRow([inputJson]);
            activeSpreadsheet.getActiveSheet().appendRow([invalidJson]);

            // set range A1:A2 as active range
            activeSpreadsheet.getActiveSheet().setActiveRange(
                activeSpreadsheet.getActiveSheet().getRange('A1:A2')
            );

            // mock event parameters
            const e = { parameters: {} };
            const validateResult = Controller.Validate(e);
            expect(validateResult).toBeDefined();
            const resultData = validateResult.getData();
            expect(resultData).toBeDefined();

            // notification
            expect(resultData.notification).toBeDefined();
            // Completed! with error(s): (1)
            expect(resultData.notification.text).toContain('⚠️ Completed with 1 error(s). \n\nEnable "Show Errors" in Advanced Settings to view details.');
        });
    });

    describe('View', () => {
        const View = Addon.Home.View;

        beforeEach(() => {
            // UrlFetchAppStubConfiguration.reset();
        });

        describe('HomeCard', () => {
            // default
            it('should build Home Card with no Gemini API key and welcome section', () => {
                const data = Addon.Modules.App.getData();

                const homeCard = View.HomeCard(data);
                expect(homeCard).toBeDefined();
                const cardData = homeCard.getData();
                expect(cardData).toBeDefined();
                expect(cardData.name).toBe(Addon.Home.id + '-Home');

                // Expect the welcome section to be present
                //console.log(JSON.stringify(cardData, null, 2));
                const welcomeSection = cardData.sections.find(section => section.header === 'Welcome to Gemini Assistant!');
                expect(welcomeSection).toBeDefined();
            });
        });

        // HelpCard test
        it('should handle HelpCard', () => {
            // mock event parameters
            const data = {};
            const helpCard = View.HelpCard(data);

            expect(helpCard).toBeDefined();
            const cardData = helpCard.getData();
            expect(cardData).toBeDefined();
        });

        // AboutCard test
        it('should handle AboutCard', () => {
            // mock event parameters
            const data = {};
            const aboutCard = View.AboutCard(data);
            expect(aboutCard).toBeDefined();
            const cardData = aboutCard.getData();
            expect(cardData).toBeDefined();
            // check for mor than 1 sections
            expect(cardData.sections.length).toBeGreaterThan(1);
        });
    });
});