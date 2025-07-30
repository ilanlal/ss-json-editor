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
            "test_createRangeReport",
            "test_addItem"
        ];
        tests.forEach(test => this[test]());
    }

    test_createRangeReport() {
        QUnit.test("Test create RangeReport object", (assert) => {
            // Create a mock range with dummy data
            const mockRange = SpreadsheetApp
                .getActiveSpreadsheet()
                .getActiveSheet()
                .getRange("A1:B2");
            const rangeReport = new RangeReport(mockRange.getA1Notation());
            assert.ok(rangeReport, "RangeReport instance should be created");
            assert.strictEqual(rangeReport.a1Notation, mockRange.getA1Notation(), "A1 notation should match");

            // Check if items array is initialized
            assert.ok(Array.isArray(rangeReport.items), "Items should be an array");
            assert.strictEqual(rangeReport.items.length, 0, "Items array should be empty initially");
        });
    }

    test_addItem() {
        QUnit.test("Test addItem", (assert) => {
            const mockRange = SpreadsheetApp
                .getActiveSpreadsheet()
                .getActiveSheet()
                .getRange("A1:B2");
            const rangeReport = new RangeReport(mockRange.getA1Notation());

            // Add an item to the report
            rangeReport
                .addItem(
                    new ReportItem(
                        "A1",
                        "Test message",
                        ReportItem.Status.VALID));

            // Check if the item was added
            assert.strictEqual(rangeReport.items.length, 1, "Items array should contain one item");
            assert.strictEqual(rangeReport.items[0].a1Notation, "A1", "A1 notation should match");
            assert.strictEqual(rangeReport.items[0].message, "Test message", "Message should match");
            assert.strictEqual(rangeReport.items[0].status, ReportItem.Status.VALID, "Status should match");
        });
    }
}