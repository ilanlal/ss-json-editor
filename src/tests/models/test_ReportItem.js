class test_ReportItem {
    constructor() {
        QUnit.module("ReportItem (models)");
        this.runTests();
    }

    runTests() {
        const tests = [
            "test_core"
        ];
        tests.forEach(test => this[test]());
    }

    test_core() {
        QUnit.test("Test ReportItem model operations", (assert) => {
            const a1Notation = "A1";
            const message = "Test message";
            const status = ReportItem.Status.INVALID;

            let item = ModelBuilder.newReportItem("TestSheet")
                .setA1Notation(a1Notation)
                .setMessage(message)
                .setStatus(status);

            assert.strictEqual(item.getA1Notation(), a1Notation, "A1 notation should match");
            assert.strictEqual(item.getMessage(), message, "Message should match");
            assert.strictEqual(item.getStatus(), status, "INVALID status should match");
            assert.strictEqual(item.icon, ReportItem.Icons[status], "Icon should match the status icon");
        });
    }
}