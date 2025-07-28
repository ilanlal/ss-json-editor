// Google Apps Script code for Google Workspace Add-ons
class test_ReportController {
    constructor() {
        QUnit.module("Report controller Tests");
        this.runTests();
        QUnit.done(() => {
            //this.tearDown();
        });
        
    }

    runTests() {
        const tests = [
            "test_createReportController",
            "test_addItem",
            "test_getResults"
        ];
        tests.forEach(test => this[test]());
    }

    test_createReportController() {
        QUnit.test("Test createReportController", (assert) => {
            const rangeReport = new RangeReport("A1:B2");
            const reportController = new ReportController(rangeReport);
            assert.ok(reportController, "ReportController instance should be created");
            assert.strictEqual(reportController.a1Notation, "A1:B2", "A1 notation should match");
            assert.ok(reportController.rangeReport instanceof RangeReport, "RangeReport should be initialized");
        });
    }

    test_addItem() {
        QUnit.test("Test addItem", (assert) => {
            const rangeReport = new RangeReport("A1:B2");
            const reportController = new ReportController(rangeReport);
            const a1Notation = "B2";
            const message = "Test message";
            const status = ReportItem.Status.INVALID;

            reportController.addItem(a1Notation, message, status);

            const results = reportController.getResults();
            assert.strictEqual(results.items.length, 1, "Should have one item in the report");
            assert.strictEqual(results.items[0].a1Notation, a1Notation, "A1 notation should match");
            assert.strictEqual(results.items[0].message, message, "Message should match");
            assert.strictEqual(results.items[0].status, status, "Status should match");
        });
    }

    test_getResults() {
        QUnit.test("Test getResults", (assert) => {
            const rangeReport = new RangeReport("A1:B2");
            const reportController = new ReportController(rangeReport);
            const a1Notation = "B2";
            const message = "Test message";
            const status = ReportItem.Status.INVALID;

            reportController.addItem(a1Notation, message, status);

            const results = reportController.getResults();
            assert.ok(results, "Results should be returned");
            assert.strictEqual(results.items.length, 1, "Should have one item in the report");
            assert.strictEqual(results.items[0].a1Notation, a1Notation, "A1 notation should match");
            assert.strictEqual(results.items[0].message, message, "Message should match");
            assert.strictEqual(results.items[0].status, status, "Status should match");
        });
    }
}