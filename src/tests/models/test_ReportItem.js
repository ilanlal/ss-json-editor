class test_ReportItem {
    constructor() {
        QUnit.module("Report Item (models)");
        this.runTests();
    }

    runTests() {
        const tests = [
            "test_constructor",
            "test_statusEnums"
        ];
        tests.forEach(test => this[test]());
    }

    test_constructor() {
        QUnit.test("Test ReportItem constructor", (assert) => {
            const a1Notation = "A1";
            const message = "Test message";
            const status = ReportItem.Status.INVALID;

            const item = new ReportItem(a1Notation, message, status);

            assert.strictEqual(item.a1Notation, a1Notation, "A1 notation should match");
            assert.strictEqual(item.message, message, "Message should match");
            assert.strictEqual(item.status, status, "Status should match");
            assert.strictEqual(item.icon, ReportItem.Icons[status], "Icon should match the status icon");
        });
    }

    test_statusEnums() {
        QUnit.test("Test ReportItem status enums", (assert) => {
            assert.strictEqual(ReportItem.Status.VALID, 'VALID', "Valid status should be 'VALID'");
            assert.strictEqual(ReportItem.Status.INVALID, 'INVALID', "Invalid status should be 'INVALID'");
            assert.strictEqual(ReportItem.Status.ERROR, 'ERROR', "Error status should be 'ERROR'");

            assert.strictEqual(ReportItem.Icons[ReportItem.Status.VALID], '💫', "Valid icon should be '💫'");
            assert.strictEqual(ReportItem.Icons[ReportItem.Status.INVALID], '⚠️', "Invalid icon should be '⚠️'");
            assert.strictEqual(ReportItem.Icons[ReportItem.Status.ERROR], '‼️', "Error icon should be '‼️'");
        });
    }
}