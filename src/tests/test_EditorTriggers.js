// test_EditorTriggers.gs
class test_EditorTriggers {
    constructor() {
        QUnit.module("Editor Triggers Tests");
        this.userStore = new UserStore();
        this.dummySheet = this.initializeTestSheet();
        this.range = this.dummySheet.getRange("A1:B4");
        this.initializeUserStoreForTesting();
        this.runTests();
    }
    runTests() {
        const tests = [
            "test_onIdentSpacesSelectorChange",
            //"test_onFormatRange",
            //"test_onMinifyRange",
            // Add more test methods here as needed
        ];
        tests.forEach(test => this[test]());
    }

    test_onIdentSpacesSelectorChange() {
        let that = this;
        QUnit.test("Test onIdentSpacesSelectorChange", function (assert) {
            // Mock event object
            const e = {
                commonEventObject: {
                    formInputs: {
                        "identSpaces": {
                            stringInputs: {
                                value: ["4"]
                            }
                        }
                    }
                }
            };


            onIdentSpacesSelectorChange(e);
            assert.equal(that.userStore.getIdentSpaces(), "4", "Ident spaces should be set to 4");
            // Check if identSpaces is set to a different value
            e.commonEventObject.formInputs.identSpaces.stringInputs.value[0] = "6";
            onIdentSpacesSelectorChange(e);
            assert.equal(that.userStore.getIdentSpaces(), "6", "Ident spaces should be set to 6");
            // Check for default value if no input is provided
            const eDefault = {
                commonEventObject: undefined
            };
            onIdentSpacesSelectorChange(eDefault);
            assert.equal(that.userStore.getIdentSpaces(), "2", "Ident spaces should default to 2");
        });
    }

    test_onFormatRange() {
        let that = this;
        QUnit.test("onFormatRange", function (assert) {
            // Mock a range with minified JSON data
            const values = [
                ['{"key":"value"}', '{"array":[1,2,3]}'],
                ['{"nested":{"key":"value"}}', '{"boolean":true}']
            ];
            that.range.setValues(values);

            // Mock event object
            const e = undefined; // No specific event object needed for this test
            onFormatRange(e);

            const expectedValues = [
                ['{\n  "key": "value"\n}', '{\n  "array": [\n    1,\n    2,\n    3\n  ]\n}'],
                ['{\n  "nested": {\n    "key": "value"\n  }\n}', '{\n  "boolean": true\n}']
            ];
            assert.deepEqual(
                that.range.getValues(),
                expectedValues,
                "Range should be formatted correctly");
        });
    }

    test_onMinifyRange() {
        let that = this;
        QUnit.test("Test onMinifyRange", function (assert) {
            // Mock a range with JSON data
            const values = [
                ['{"key": "value"}', '{"array": [1, 2, 3]}'],
                ['{"nested": {"key": "value"}}', '{"boolean": true}']
            ];
            that.range.setValues(values);

            // Mock event object
            const e = undefined; // No specific event object needed for this test
            onMinifyRange(e);

            const expectedValues = [
                ['{"key":"value"}', '{"array":[1,2,3]}'],
                ['{"nested":{"key":"value"}}', '{"boolean":true}']
            ];
            assert.deepEqual(that.range.getValues(), expectedValues, "Range should be minified correctly");
        });
    }

    initializeUserStoreForTesting() {
        // This method is used to initialize the UserStore for testing purposes
        this.userStore.setIdentSpaces("2"); // Default value for identSpaces
        this.userStore.setFailNoteFlag(false); // Default value for failNoteFlag
        this.userStore.setShowErrorsFlag(false); // Default value for showErrorsFlag
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