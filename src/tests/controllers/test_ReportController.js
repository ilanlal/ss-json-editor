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
            const rangeReport = new RangeReport(mockRange.getA1Notation());
            const userStore = new UserStore();
            const localization = AppManager.getLocalizationResources();
            // Create a ReportController instance
            const reportController =
                new ReportController(
                    rangeReport,
                    userStore,
                    localization
                );
            const actionResponse = reportController.home().build().printJson();
            assert.ok(actionResponse, "Action response should be created successfully");
            const card = JSON.parse(actionResponse).renderActions.action.navigations[0].pushCard;
            assert.ok(card, "Card should be created successfully");
            assert.strictEqual(
                card.header.title,
                AppManager.getLocalizationResources().cards.report.title,
                "Card title should match localization"
            );
        });
    }
}