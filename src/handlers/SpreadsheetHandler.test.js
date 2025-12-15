require('../../tests');
const { SpreadsheetHandler } = require('./SpreadsheetHandler');
const { EMD } = require('../config/EMD');

describe('SpreadsheetHandler', () => {
    beforeEach(() => {
        SpreadsheetStubConfiguration.reset();
    });

    it('should create an instance using the static create method', () => {
        const spreadsheetHandler = new SpreadsheetHandler()
        expect(spreadsheetHandler).toBeInstanceOf(SpreadsheetHandler);
    });

    // onActivateSheetClick
    it('should handle activate sheet click', () => {
        const builtResponse = SpreadsheetHandler.Addon.onActivateSheetClick({
            parameters: {
                sheet: 'EMD.Spreadsheet.BasicAutomation'
            }
        });
        expect(builtResponse).toBeDefined();
        const data = builtResponse.getData();
        expect(data).toBeDefined();
        // Additional assertions can be added here based on expected behavior
    });

    // onInsertSampleDataClick
    it('should handle insert sample data click', () => {
        const builtResponse = SpreadsheetHandler.Addon.onInsertSampleDataClick({
            parameters: {
                sheet: 'EMD.Spreadsheet.BotSetup'
            }
        });
        expect(builtResponse).toBeDefined();
        const data = builtResponse.getData();
        expect(data).toBeDefined();
        // Additional assertions can be added here based on expected behavior
    });
});