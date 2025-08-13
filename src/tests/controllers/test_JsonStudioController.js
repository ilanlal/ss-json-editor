// Google Apps Script code for Google Workspace Add-ons
class test_JsonStudioController {
    constructor() {
        QUnit.module("JsonStudioController (controllers)");
        this.runTests();
        QUnit.done(() => {
            // Cleanup or finalization if needed
        });
    }

    runTests() {
        const tests = [
            "test_core",
            // Add more test methods here as needed
        ];
        tests.forEach(test => this[test]());
    }

    test_core() {
        QUnit.test("Test core functionality", (assert) => {
            // Mock a range object
            const mockRange = MockRangeBuilder.newMockRange()
                .withA1Notation("A1:B2")
                .withValues([
                    ['{"key": "value"}', '{"array": [1, 2, 3]}'],
                    ['{"nested": {"key": "value"}}', '{"boolean": true}']
                ])
                .build();

            const localization = AppManager.getLocalizationResources();
            const userStore = ServiceBuilder.newUserStore();
            const action = ControllerBuilder.newJsonStudioController(localization, userStore)
                .minifyRange(mockRange)
                .build()
                .printJson();
            assert.ok(action, "Action response should be created successfully");
            const actionResponse = JSON.parse(action);
            assert.ok(actionResponse, "ActionResponse should be created successfully");
            assert.ok(actionResponse.renderActions.action, "Action should have renderActions");
        });
    }
}