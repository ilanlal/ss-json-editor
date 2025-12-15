require('../../../tests');
const { SpreadsheetController } = require('./SpreadsheetController');
const { EMD } = require('../../config/EMD');

describe('Spreadsheet Controller', () => {

    test('should create an instance using the static create method', () => {
        const spreadsheetController = SpreadsheetController.create();
        expect(spreadsheetController).toBeInstanceOf(SpreadsheetController);
    });
});
