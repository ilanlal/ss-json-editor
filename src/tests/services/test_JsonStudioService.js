// Google Apps Script code for Google Workspace Add-ons
class test_JsonStudioService {
    constructor() {
        QUnit.module("JsonStudio (services)");
        
        // Clean up after tests
        QUnit.done(() => {
            // Any necessary cleanup can be done here
            // For example, resetting the user store or localization
            //this.userStore.setIndentSpaces(UserStore.DEFAULT_INDENT_SPACES);
        });

        this.runTests();
    }

    runTests() {
        const tests = [
            "test_minifyRange",
            "test_prettifyRange",
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

            let mockRange = MockRangeBuilder.newMockRange()
                .withA1Notation("A1:B2")
                .withValues(values)
                .build();

            let report = ServiceBuilder.newJsonStudio().minifyRange(mockRange);

            const expectedValues = [
                ['{"key":"value"}', '{"array":[1,2,3]}'],
                ['{"nested":{"key":"value"}}', '{"boolean":true}']
            ];
            assert.deepEqual(
                mockRange.getValues(),
                expectedValues, "Range should be minified correctly");

            // Check the report for any errors
            assert.strictEqual(report.getItems().length, 0, "There should be no errors in the report");

            // Check invalid JSON handling
            const invalidValues = [
                ['{"key": "value"', '{"array": [1, 2, 3]}'],
                ['{"nested": {"key": "value"}}', '{"boolean": true']
            ];
            mockRange.setValues(invalidValues);

            report = ServiceBuilder.newJsonStudio().minifyRange(mockRange);
            const items = report.getItems();

            assert.strictEqual(items.length, 2, "There should be two errors in the report");
        });
    }

    test_prettifyRange() {
        QUnit.test("Test prettifyRange", (assert) => {
            // Mock a range with minified JSON data
            const values = [
                ['{"key":"value"}', '{"array":[1,2,3]}'],
                ['{"nested":{"key":"value"}}', '{"boolean":true}']
            ];

            let mockRange = MockRangeBuilder.newMockRange()
                .withA1Notation("A1:B2")
                .withValues(values)
                .build();

            // Call formatRange to format the JSON data
            let report = ServiceBuilder.newJsonStudio().prettifyRange(mockRange, 2);

            const expectedValues = [
                ['{\n  "key": "value"\n}', '{\n  "array": [\n    1,\n    2,\n    3\n  ]\n}'],
                ['{\n  "nested": {\n    "key": "value"\n  }\n}', '{\n  "boolean": true\n}']
            ];
            assert.deepEqual(
                mockRange.getValues(),
                expectedValues, "Range should be formatted correctly");

            // Check the report for any errors
            assert.strictEqual(report.getItems().length, 0, "There should be no errors in the report");

            // Check invalid JSON handling
            const invalidValues = [
                ['{"key": "value"', '{"array": [1, 2, 3]}'],
                ['{"nested": {"key": "value"}}', '{"boolean": true']
            ];
            mockRange.setValues(invalidValues);
            report = ServiceBuilder.newJsonStudio().prettifyRange(mockRange, 2);
            const items = report.getItems();
            assert.strictEqual(items.length, 2, "There should be two errors in the report");
        });
    }
}