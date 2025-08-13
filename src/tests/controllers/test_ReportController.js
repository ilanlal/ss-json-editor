// Google Apps Script code for Google Workspace Add-ons
class test_ReportController {
    constructor() {
        QUnit.module("Report (controllers)");
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
        QUnit.test("Test home action", (assert) => {
            // Mock a range report
            const mockRange = {
                getA1Notation: () => "A1:B2",
                getValues: () => [
                    ["Header 1", "Header 2"],
                    ["Value 1", "Value 2"]
                ]
            };
            const rangeReport = ModuleBuilder.newRangeReport().setRange(mockRange);
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