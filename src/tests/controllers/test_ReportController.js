// Google Apps Script code for Google Workspace Add-ons
class test_ReportController {
    constructor() {
        QUnit.module("ReportController (controllers)");
        this.runTests();
        QUnit.done(() => {
            //this.tearDown();
        });

    }

    runTests() {
        const tests = [
            "test_home",
        ];
        tests.forEach(test => this[test]());
    }
    test_home() {
        QUnit.test("Test core actions", (assert) => {
            // Mock a range report
            const mockRange = MockRangeBuilder.newMockRange()
                .withA1Notation("A1:B2")
                .withValues([
                    ["Header 1", "Header 2"],
                    ["Value 1", "Value 2"]
                ]);
            const rangeReport = ModuleBuilder.newRangeReport()
                .setRange(mockRange)
                .addItem(ReportItem.createInvalid("A1", "Invalid JSON in cell A1"))
                .addItem(ReportItem.createInvalid("B2", "Invalid JSON in cell B2"));

            const userStore = ModuleBuilder.newUserStore();
            const localization = AppManager.getLocalizationResources();
            // Create a ReportController instance
            const action = ControllerBuilder
                .newReportController(localization, userStore)
                .home(rangeReport)
                .build()
                .printJson();
            assert.ok(action, "Action response should be created successfully");

            const actionResponse = JSON.parse(action);

            assert.ok(actionResponse, "ActionResponse should be created successfully");
            const card = actionResponse.renderActions.action.navigations[0].pushCard;
            assert.ok(card, "Card should be created successfully");
            assert.strictEqual(
                card.header.title,
                localization.cards.report.title,
                "Card title should match localization"
            );
        });
    }
}