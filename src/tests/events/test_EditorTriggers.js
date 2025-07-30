// Google Apps Script code for Google Workspace Add-ons
class test_AddonTriggers {
    constructor() {
        QUnit.module("Addon Triggers (e2e)");
        this.userStore = new UserStore();
        this.dummySheet = this.initializeTestSheet();
        this.runTests();
    }
    runTests() {
        const tests = [
            this.test_onIndentSpacesSelectorChange.bind(this),
            this.test_onFormatRange.bind(this),
            this.test_onMinifyRange.bind(this),
            // Add more test methods here as needed
        ];
        tests.forEach(test => {
            try {
                test();
                console.log(`Test passed: ${test.name}`);
            } catch (error) {
                console.error(`Test failed: ${test.name}`);
                console.error(error);
            }
        });
    }

    test_onIndentSpacesSelectorChange() {
        let that = this;
        QUnit.test("onIndentSpacesSelectorChange", function (assert) {
            // Mock event object
            const e = {
                commonEventObject: {
                    formInputs: {
                        "indentSpaces": {
                            stringInputs: {
                                value: ["4"]
                            }
                        }
                    }
                }
            };


            onIndentSpacesSelectorChange(e);
            assert.equal(that.userStore.getIndentSpaces(), "4", "Indent spaces should be set to 4");
            // Check if indentSpaces is set to a different value
            e.commonEventObject.formInputs.indentSpaces.stringInputs.value[0] = "6";
            onIndentSpacesSelectorChange(e);
            assert.equal(that.userStore.getIndentSpaces(), "6", "Indent spaces should be set to 6");
            // Check for default value if no input is provided
            const eDefault = {
                commonEventObject: undefined
            };
            onIndentSpacesSelectorChange(eDefault);
            assert.equal(that.userStore.getIndentSpaces(), "2", "Indent spaces should default to 2");
        });
    }

    test_onFormatRange() {
        let that = this;
        QUnit.test("Format Range Tests", function (assert) {
            // Mock a range with minified JSON data
            const values = [
                ['{"key":"value"}', '{"array":[1,2,3]}'],
                ['{"nested":{"key":"value"}}', '{"boolean":true}']
            ];

            // Set the values in the dummy sheet
            that.dummySheet.getRange("A1:B2").setValues(values);
            // Activate the range to be formatted
            that.dummySheet.getRange("A1:B2").activate();

            // Mock event object
            const e = undefined; // No specific event object needed for this test
            onFormatRange(e);

            const expectedValues = [
                ['{\n  "key": "value"\n}', '{\n  "array": [\n    1,\n    2,\n    3\n  ]\n}'],
                ['{\n  "nested": {\n    "key": "value"\n  }\n}', '{\n  "boolean": true\n}']
            ];
            assert.deepEqual(
                that.dummySheet.getRange("A1:B2").getValues(),
                expectedValues,
                "Range should be formatted correctly");
        });
    }

    test_onMinifyRange() {
        let that = this;
        QUnit.test("Minify Range Tests", function (assert) {
            // Mock a range with JSON data
            const values = [
                ['{"key": "value"}', '{"array": [1, 2, 3]}'],
                ['{"nested": {"key": "value"}}', '{"boolean": true}']
            ];
            // Set the values in the dummy sheet
            that.dummySheet.getRange("A1:B2").setValues(values);
            // Activate the range to be minified
            that.dummySheet.getRange("A1:B2").activate();
            // Mock event object
            const e = undefined; // No specific event object needed for this test
            onMinifyRange(e);

            const expectedValues = [
                ['{"key":"value"}', '{"array":[1,2,3]}'],
                ['{"nested":{"key":"value"}}', '{"boolean":true}']
            ];
            assert.deepEqual(
                that.dummySheet.getRange("A1:B2").getValues(),
                expectedValues,
                "Range should be minified correctly");
        });
    }

    // Create Sheet for testing
    initializeTestSheet() {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        var sheet = ss.getSheetByName("TestSheet");
        if (!sheet) {
            sheet = ss.insertSheet("TestSheet");
        }
        // Activate the sheet to ensure it's ready for testing
        // set as active sheet
        ss.setActiveSheet(sheet);
        ss.setActiveRange(sheet.getRange("A1:B4")); // Set a default range for testing

        // Clear existing data
        sheet.clear(); // Clear the sheet before adding new data
        return sheet;
    }
}