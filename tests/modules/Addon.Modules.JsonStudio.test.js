require('..');
const { Addon } = require('../../src/Addon');

describe('Addon.Modules.JsonStudio', () => {
    beforeEach(() => {
        SpreadsheetStubConfiguration.reset();
    });

    // Add tests for JsonStudio module here
    it('should have required properties', () => {
        expect(Addon.Modules.JsonStudio).toBeDefined();
        // Add more property checks as needed
    });

    // beautifyActiveRange method test
    it('should beautify active range correctly', () => {
        const inputJson = '{"name":"John","age":30,"city":"New York"}';
        // set up active spreadsheet
        const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();

        // set A1 value to inputJson
        activeSpreadsheet.getActiveSheet().getRange('A1').setValue(inputJson);
        // set a1 as active range
        activeSpreadsheet.getActiveSheet().setActiveRange(
            activeSpreadsheet.getActiveSheet().getRange('A1')
        );

        const result = Addon.Modules.JsonStudio.beautifyActiveRange(activeSpreadsheet);

        expect(result).toBeDefined();
        expect(result.range.getA1Notation()).toBe('A1');
        expect(result.report.length).toBe(0); // No errors
        expect(
            activeSpreadsheet.getActiveSheet().getActiveRange().getValue()
        ).toBeDefined();

        const expectedOutput = JSON.stringify(JSON.parse(inputJson), null, 2);

        expect(
            activeSpreadsheet.getActiveSheet().getActiveRange().getValue()
        ).toBe(expectedOutput);
    });

    // minifyActiveRange method test
    it('should minify active range correctly', () => {
        const inputJson = '{\n  "name": "John",\n  "age": 30,\n  "city": "New York"\n}';
        // set up active spreadsheet
        const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();

        // set A1 value to inputJson
        activeSpreadsheet.getActiveSheet().getRange('A1').setValue(inputJson);
        // set a1 as active range
        activeSpreadsheet.getActiveSheet().setActiveRange(
            activeSpreadsheet.getActiveSheet().getRange('A1')
        );
        const result = Addon.Modules.JsonStudio.minifyActiveRange(activeSpreadsheet);

        expect(result).toBeDefined();
        expect(result.range.getA1Notation()).toBe('A1');
        expect(result.report.length).toBe(0); // No errors
        expect(
            activeSpreadsheet.getActiveSheet().getActiveRange().getValue()
        ).toBeDefined();
        const expectedOutput = JSON.stringify(JSON.parse(inputJson));

        expect(
            activeSpreadsheet.getActiveSheet().getActiveRange().getValue()
        ).toBe(expectedOutput);
    });

    // validateActiveRange method test
    it('should validate active range correctly', () => {
        const validJson = '{"name":"John","age":30,"city":"New York"}';
        const invalidJson = '{"name":"John","age":30,"city":"New York"'; // Missing closing brace
        // set up active spreadsheet
        const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
        // set A1 value to valid JSON
        activeSpreadsheet.getActiveSheet().appendRow([validJson]);
        // set A2 value to invalid JSON
        activeSpreadsheet.getActiveSheet().appendRow([invalidJson]);
        
        // set A1:A2 as active range
        activeSpreadsheet.getActiveSheet().setActiveRange(
            activeSpreadsheet.getActiveSheet().getRange('A1:A2')
        );

        // call validateActiveRange
        const result = Addon.Modules.JsonStudio.validateActiveRange(activeSpreadsheet);

        expect(result).toBeDefined();
        //expect(result.range.getA1Notation()).toBe('A1:A2');
        expect(result.report.length).toBe(1); // One error for invalid JSON
        expect(result.report[0].a1n).toBe('A2');
        expect(result.report[0].error).toBeDefined();
    });
});