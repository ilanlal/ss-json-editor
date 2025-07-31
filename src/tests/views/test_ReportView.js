// Apps Script QUnit Tests for Report View
class test_ReportView {
    constructor() {
        QUnit.module("Report Card (views)");
        this.runTests();
        QUnit.done(() => {
            //this.tearDown();
        });
    }
    runTests() {
        const tests = [
            "test_create"
        ];
        tests.forEach(test => this[test]());
    }

    test_create() {
        QUnit.test("Test create report card", (assert) => {
            const localization = AppManager.getLocalizationResources();
            // Mock a range report
            const mockRange = {
                getA1Notation: () => "A1:B2",
                getValues: () => [
                    ["Header 1", "Header 2"],
                    ["Value 1", "Value 2"]
                ]
            };
            const rangeReport = new RangeReport(mockRange.getA1Notation());
            const userLicense = new UserLicense(
                'user@example.com',
                'premium',
                '2023-01-01',
                '2024-01-01'
            );
            // Create a ReportCard instance
            const cardBuilder = ReportCard.create(
                userLicense,
                rangeReport,
                localization);
            assert.ok(cardBuilder, "Card builder should be created successfully");
            // Check if the card is created correctly
            const card = cardBuilder.build()
                .printJson();
            assert.ok(card, "Card should be created successfully");
            const cardJson = JSON.parse(card);
            assert.ok(cardJson, "Card JSON should be created successfully");
        });
    }
}