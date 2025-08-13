// Google Apps Script code for Google Workspace Add-ons
class test_RangeReport {
    constructor() {
        QUnit.module("RangeReport (models)");
        this.runTests();
        QUnit.done(() => {
            //this.tearDown();
        });
    }

    runTests() {
        const tests = [
            "test_core"
        ];
        tests.forEach(test => this[test]());
    }

    test_core() {
        QUnit.test("Test core functionality", (assert) => {
            // Create a mock range with dummy data
            const mockRange = MockRangeBuilder.newMockRange()
                .withA1Notation("A1")
                .withValues([["Test value"]])
                .build();

            const rangeReport = ModelBuilder.newRangeReport()
                .setRange(mockRange)
                .addItem(ModelBuilder.newReportItem()
                    .setA1Notation("A1")
                    .setMessage("Invalid JSON in cell A1")
                    .setStatus(ReportItem.Status.INVALID));

            assert.ok(rangeReport, "RangeReport instance should be created");
            assert.strictEqual(rangeReport.getA1Notation(), mockRange.getA1Notation(), "A1 notation should match");
            assert.strictEqual(rangeReport.getRange(), mockRange, "Range should match the mock range");
            assert.strictEqual(rangeReport.getEffectedCells(), 0, "Effected cells should be initialized to 0");
            assert.ok(rangeReport.hasItems(), "RangeReport should have items");
            assert.strictEqual(rangeReport.getItems().length, 1, "RangeReport should contain one item");
        });
    }
}