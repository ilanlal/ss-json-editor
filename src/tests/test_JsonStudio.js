class test_JsonStudio {
    constructor() {
        QUnit.module("Json Studio Tests");
        this.localization = getLocalizationResources();
        this.userStore = new UserStore();
        this.dummySheet = this.initializeTestSheet();
        this.jsonStudio = new JsonStudio(this.dummySheet, this.localization, this.userStore);
        this.runTests();
    }

    runTests() {
        const tests = [
            "test_minifyRange",
            "test_formatRange"
        ];
        tests.forEach(test => this[test]());
    }

    test_minifyRange() {
        QUnit.test("Test minifyRange", (assert) => {
            // Mock a range with JSON data
            const values = [
                ['{"key": "value"}', '{"array": [1, 2, 3]}'],
                ['{"nested": {"key": "value"}}', '{"boolean": true}']
            ];
            this.dummySheet.getRange("A1:B2").setValues(values);

            this.jsonStudio.minifyRange();

            const expectedValues = [
                ['{"key":"value"}', '{"array":[1,2,3]}'],
                ['{"nested":{"key":"value"}}', '{"boolean":true}']
            ];
            assert.deepEqual(this.dummySheet.getRange("A1:B2").getValues(), expectedValues, "Range should be minified correctly");
        });
    }

    test_formatRange() {
        QUnit.test("Test formatRange", (assert) => {
            // Mock a range with minified JSON data
            const values = [
                ['{"key":"value"}', '{"array":[1,2,3]}'],
                ['{"nested":{"key":"value"}}', '{"boolean":true}']
            ];
            this.dummySheet.getRange("A1:B2").setValues(values);

            this.jsonStudio.formatRange();

            const expectedValues = [
                ['{\n  "key": "value"\n}', '{\n  "array": [\n    1,\n    2,\n    3\n  ]\n}'],
                ['{\n  "nested": {\n    "key": "value"\n  }\n}', '{\n  "boolean": true\n}']
            ];
            assert.deepEqual(this.dummySheet.getRange("A1:B2").getValues(), expectedValues, "Range should be formatted correctly");
        });
    }

    initializeTestSheet() {
        // Create (if not exists) a dummy sheet for testing
        // This is a utility method to ensure tests have a valid range to work with
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        let sheet = ss.getSheetByName("TestSheet");
        if (!sheet) {
            sheet = ss.insertSheet("TestSheet");
        }
        // Clear the sheet before adding new data
        sheet.clear();
        return sheet;
    }

    tearDown() {
        // Clean up after tests
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const sheet = ss.getSheetByName("TestSheet");
        if (sheet) {
            ss.deleteSheet(sheet);
        }
    }
}