// Google Apps Script code for Google Workspace Add-ons
class test_RangeReport {
    constructor() {
        QUnit.module("RangeReport (modules)");
        this.runTests();
        QUnit.done(() => {
            //this.tearDown();
        });
    }

    runTests() {
        const tests = [
            "test_getA1Notation",
            "test_addItem"
        ];
        tests.forEach(test => this[test]());
    }

    test_getA1Notation() {
        QUnit.test("Test getA1Notation", (assert) => {
            // Create a mock range with dummy data
            const mockRange = {
                getA1Notation: () => "A1:B2",
                getValues: () => [['', ''], ['', '']],
            };
            const rangeReport = ModuleBuilder.newRangeReport().setRange(mockRange);
            assert.ok(rangeReport, "RangeReport instance should be created");
            assert.strictEqual(rangeReport.getA1Notation(), mockRange.getA1Notation(), "A1:B2 notation should match");
        });
    }

    test_addItem() {
        QUnit.test("Test addItem", (assert) => {
            const rangeReport = ModuleBuilder.newRangeReport()
                .addItem(ReportItem.createInvalid("A1", "Test message"));

            assert.ok(rangeReport, "RangeReport instance should be created");
            const items = rangeReport.getItems();
            // Check if the item was added
            assert.strictEqual(items.length, 1, "Items array should contain one item");
            assert.strictEqual(items[0].a1Notation, "A1", "A1 notation should match");
            assert.strictEqual(items[0].message, "Test message", "Message should match");
            assert.strictEqual(items[0].status, ReportItem.Status.INVALID, "Status should match");
        });
    }
}