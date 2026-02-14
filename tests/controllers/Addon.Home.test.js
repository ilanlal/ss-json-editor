require('..');
const { Addon } = require('../../src/Addon');

const controller = Addon.Home.Controller;

describe('Addon.Home.Controller', () => {
    beforeEach(() => {
        // UrlFetchAppStubConfiguration.reset();
    });

    describe('Actions', () => {
        // Load test
        it('should handle Load', () => {
            // mock event parameters
            const e = { parameters: {} };
            const homeCard = controller.Load(e);
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

        // OnHelp test
        it('should handle OnHelp', () => {
            // mock event parameters
            const e = { parameters: {} };
            const helpCard = controller.Help(e);
            expect(helpCard).toBeDefined();
            const cardData = helpCard.getData();
            expect(cardData).toBeDefined();
            // no notification
            expect(cardData.notification).toBeUndefined();
        });

        // OnAbout test
        it('should handle OnAbout', () => {
            // mock event parameters
            const e = { parameters: {} };
            const aboutCard = controller.About(e);
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
            const beautifyResult = controller.Beautify(e);
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
            const minifyResult = controller.Minify(e);
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
            const validateResult = controller.Validate(e);
            expect(validateResult).toBeDefined();
            const resultData = validateResult.getData();
            expect(resultData).toBeDefined();

            // notification
            expect(resultData.notification).toBeDefined();
            // Completed! with error(s): (1)
            expect(resultData.notification.text).toContain('⚠️ Completed with 1 error(s). \n\nEnable "Show Errors" in Advanced Settings to view details.');
        });
    });
});