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
        QUnit.test("Test create ReportCard", (assert) => {
            const localization = AppManager.getLocalizationResources();
            // Mock a range report
            const mockRange = MockRangeBuilder.newMockRange()
                .withA1Notation("A1:B2")
                .withValues([
                    ["Header 1", "Header 2"],
                    ["Value 1", "Value 2"]
                ]);

            const rangeReport = ModelBuilder.newRangeReport()
                .setRange(mockRange.build())
                .addItem(ModelBuilder.newReportItem("TestSheet")
                    .setA1Notation("A1")
                    .setMessage('This is a test message')
                    .setStatus(ReportItem.Status.INVALID)
                );
            const userLicense = ModelBuilder.newUserLicense()
                .setUserId('user@example.com')
                .setPlanId('premium')
                .setCreatedOn('2023-01-01')
                .setExpirationDate('2024-01-01');
            // Create a ReportCard instance
            const cardBuilder = ViewBuilder.newReportCard(
                rangeReport,
                userLicense,
                localization
            );
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