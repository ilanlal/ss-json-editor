// Apps Script code for Google Workspace Add-ons
class test_AppManager {
    constructor() {
        // Initialize QUnit for testing
        QUnit.module("AppManager Tests", function () {
            this.runTests();
        });

        QUnit.done(() => {
            // Cleanup or finalization if needed
        });
    }

    runTests() {
        const tests = [
            this.testGetLocalizationResources.bind(this)
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

    testGetLocalizationResources() {
        QUnit.test("Test getLocalizationResources", (assert) => {
            const localization = AppManager.getLocalizationResources();
            assert.ok(localization, "Localization resources should be defined");
            assert.strictEqual(
                localization.messages.totalCellFailed,
                "Total cells failed: {0}",
                "Localization message for total cell failed should match"
            );
            assert.strictEqual(
                localization.messages.failure,
                "Failure",
                "Localization message for failure should match"
            );
        });
    }
}
