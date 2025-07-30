class test_SpreadsheetHelper {
    constructor() {
        // Initialize QUnit for testing
        QUnit.module("SpreadsheetHelper (helpers)");
        this.runTests();

        QUnit.done(() => {
            // Cleanup or finalization if needed
        });
    }

    runTests() {
        const tests = [
            this.testGetOptimalRange.bind(this),
            this.testIsRangeWithinLimits.bind(this)
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

    testGetOptimalRange() {
        QUnit.test("Test getOptimalRange", (assert) => {
            const sheet = SpreadsheetApp.getActiveSpreadsheet()
                .getActiveSheet();
            // Set up a test range
            sheet.getRange("A1:B3").setValues([["Test1", "Test2"], ["Test3", "Test4"],["", ""]]);
            // Get the optimal range
            const range = SpreadsheetHelper.getOptimalRange(sheet);
            assert.ok(range, "Range should be defined");
            assert.strictEqual(
                range.getA1Notation(),
                "A1:B2",
                "Range should match expected A1:B2 notation");
        });
    }

    testIsRangeWithinLimits() {
        QUnit.test("Test isRangeWithinLimits", (assert) => {
            const range = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange("A1:B2");
            assert.ok(SpreadsheetHelper.isRangeWithinLimits(range), "Range should be within limits");
        });
    }
}