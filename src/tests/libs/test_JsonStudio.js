class test_JsonStudio {
    constructor() {
        QUnit.module("Json Studio Tests");
        this.localization = AppManager.getLocalizationResources();
        this.userStore = new UserStore();
        this.dummySheet = this.initializeTestSheet();

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
            let jsonStudio = new JsonStudio(this.dummySheet, this.localization, this.userStore);
            let report = jsonStudio.minifyRange();

            const expectedValues = [
                ['{"key":"value"}', '{"array":[1,2,3]}'],
                ['{"nested":{"key":"value"}}', '{"boolean":true}']
            ];
            assert.deepEqual(
                this.dummySheet.getRange("A1:B2").getValues(),
                expectedValues, "Range should be minified correctly");

            // Check the report for any errors
            assert.strictEqual(report.getItems().length, 0, "There should be no errors in the report");

            // Check invalid JSON handling
            const invalidValues = [
                ['{"key": "value"', '{"array": [1, 2, 3]}'],
                ['{"nested": {"key": "value"}}', '{"boolean": true']
            ];
            this.dummySheet.getRange("A1:B2").setValues(invalidValues);

            jsonStudio = new JsonStudio(this.dummySheet, this.localization, this.userStore);
            report = jsonStudio.minifyRange();
            const items = report.getItems();

            assert.strictEqual(items.length, 2, "There should be two errors in the report");
            assert.strictEqual(items[0].status, ReportItem.Status.INVALID, "First item should be INVALID");
            assert.strictEqual(items[1].status, ReportItem.Status.INVALID, "Second item should be INVALID");
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
            let jsonStudio = new JsonStudio(this.dummySheet, this.localization, this.userStore);
            // Call formatRange to format the JSON data
            let report = jsonStudio.formatRange();

            const expectedValues = [
                ['{\n  "key": "value"\n}', '{\n  "array": [\n    1,\n    2,\n    3\n  ]\n}'],
                ['{\n  "nested": {\n    "key": "value"\n  }\n}', '{\n  "boolean": true\n}']
            ];
            assert.deepEqual(
                this.dummySheet.getRange("A1:B2").getValues(),
                expectedValues, "Range should be formatted correctly");

            // Check the report for any errors
            assert.strictEqual(report.getItems().length, 0, "There should be no errors in the report");

            // Check invalid JSON handling
            const invalidValues = [
                ['{"key": "value"', '{"array": [1, 2, 3]}'],
                ['{"nested": {"key": "value"}}', '{"boolean": true']
            ];
            this.dummySheet.getRange("A1:B2").setValues(invalidValues);
            jsonStudio = new JsonStudio(
                this.dummySheet,
                this.localization,
                this.userStore);
            // Call formatRange to format the JSON data
            report = jsonStudio.formatRange();
            const items = report.getItems();
            assert.strictEqual(items.length, 2, "There should be two errors in the report");
            assert.strictEqual(items[0].status, ReportItem.Status.INVALID, "First item should be INVALID");
            assert.strictEqual(items[1].status, ReportItem.Status.INVALID, "Second item should be INVALID");
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

        // Activate the sheet to ensure it's ready for testing
        ss.setActiveSheet(sheet);
        ss.setActiveRange(sheet.getRange("A1:B4")); // Set a default range for testing
        // Clear existing data
        sheet.clear(); // Clear the sheet before adding new data
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