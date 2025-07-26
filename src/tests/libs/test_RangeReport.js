class test_RangeReport {
    constructor() {
        QUnit.module("RangeReport Tests");
        this.runTests();
        QUnit.done(() => {
            //this.tearDown();
        });
    }

    runTests() {
        const tests = [
            "test_addItem",
            "test_getReport"
        ];
        tests.forEach(test => this[test]());
    }

    test_addItem() {
        QUnit.test("Test addItem", (assert) => {
            const range = SpreadsheetApp
                .getActiveSpreadsheet()
                .getActiveSheet()
                .getRange("A1");
            const report = new RangeReport(range);
            const a1Notation = "B2";
            const message = "Test message";
            const status = ReportItem.Status.INVALID;

            report.addItem(a1Notation, message, status);

            const results = report.getResults();
            assert.strictEqual(results.items.length, 1, "Should have one item in the report");
            assert.strictEqual(results.items[0].a1Notation, a1Notation, "A1 notation should match");
            assert.strictEqual(results.items[0].message, message, "Message should match");
            assert.strictEqual(results.items[0].status, status, "Status should match");
            assert.strictEqual(results.items[0].icon, ReportItem.Icons[status], "Icon should match the status icon");
            assert.strictEqual(results.range, range.getA1Notation(), "Range A1 notation should match");

        });
    }

    test_getReport() {
        QUnit.test("Test getReport", (assert) => {
            const range = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange("A1");
            const report = new RangeReport(range);
            report.addItem("B2", "Test message 1", ReportItem.Status.VALID);
            report.addItem("C3", "Test message 2", ReportItem.Status.ERROR);

            const results = report.getResults();
            assert.strictEqual(results.items.length, 2, "Should have two items in the report");
            assert.strictEqual(results.items[0].a1Notation, "B2", "First item A1 notation should match");
            assert.strictEqual(results.items[1].a1Notation, "C3", "Second item A1 notation should match");
            assert.strictEqual(results.items[0].status, ReportItem.Status.VALID, "First item status should be VALID");
            assert.strictEqual(results.items[1].status, ReportItem.Status.ERROR, "Second item status should be ERROR");
            assert.strictEqual(results.range, range.getA1Notation(), "Range A1 notation should match");
        });
    }
}