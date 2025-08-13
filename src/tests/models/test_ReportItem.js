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
        QUnit.test("Test ReportItem core operations", (assert) => {
            const a1Notation = "A1";
            const message = "Test message";
            const status = ReportItem.Status.INVALID;

            let item = ReportItem.createInvalid(a1Notation, message);

            assert.strictEqual(item.a1Notation, a1Notation, "A1 notation should match");
            assert.strictEqual(item.message, message, "Message should match");
            assert.strictEqual(item.status, status, "INVALID status should match");
            assert.strictEqual(item.icon, ReportItem.Icons[status], "Icon should match the status icon");
        });
    }
}