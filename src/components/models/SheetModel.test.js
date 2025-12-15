require('../../../tests');
const { SheetModel } = require('./SheetModel');
const SpreadsheetStubConfiguration = require('@ilanlal/gasmocks/src/spreadsheetapp/classes/SpreadsheetStubConfiguration');
const SpreadsheetApp = require('@ilanlal/gasmocks/src/spreadsheetapp/SpreadsheetApp');

describe('SheetModel', () => {
    beforeEach(() => {
        SpreadsheetStubConfiguration.reset();
    });

    it('should create an instance of SheetModel with new service instances', () => {
        const model = SheetModel.create(
            SpreadsheetApp.getActiveSpreadsheet()
        );
        expect(model).toBeDefined();
    });

    describe('SheetModel methods', () => {
        /** @type {SheetModel} */
        let model;
        beforeEach(() => {
            model = SheetModel.create(
                SpreadsheetApp.getActiveSpreadsheet()
            );
        });

        it('should get the active sheet based on sheetMeta', () => {
            const sheetMeta = {
                name: 'Test Sheet',
                columns: ['action', 'default', 'es', 'fr', 'ar', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko', 'he'],
            };
            const activeSheet = model.getSheet(sheetMeta);
            expect(activeSheet).toBeDefined();
            expect(activeSheet.getName()).toBe('Test Sheet');

        });

        it('should bind sample data to the active sheet', () => {
            const sheetMeta = {
                name: 'Test Sheet',
                columns: ['action', 'default', 'es', 'fr', 'ar', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko', 'he'],
                sample_data: [
                    ['action1', 'default1', 'es1', 'fr1', 'ar1', 'de1', 'it1', 'pt1', 'ru1', 'zh1', 'ja1', 'ko1', 'he1'],
                    ['action2', 'default2', 'es2', 'fr2', 'ar2', 'de2', 'it2', 'pt2', 'ru2', 'zh2', 'ja2', 'ko2', 'he2'],
                ]
            };
            model.bindSheetSampleData(sheetMeta);
            const activeSheet = model.getSheet(sheetMeta);
            const dataRange = activeSheet.getDataRange();
            const values = dataRange.getValues();
            expect(values.length).toBeGreaterThanOrEqual(2);
            expect(values[0]).toEqual(sheetMeta.columns);
            expect(values[1]).toEqual(sheetMeta.sample_data[0]);
            expect(values[2]).toEqual(sheetMeta.sample_data[1]);
        });
    });
});