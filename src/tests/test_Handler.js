// Test_Hendler.gs
class Test_Hendler {
    constructor() {
        QUnit.module("Handlers");
        this.runTests();
    }
    runTests() {
        const tests = [
            "test_onClick"
        ];
        tests.forEach(test => this[test]());
    }

    test_onClick() {
        QUnit.test("onClick", function (assert) {
            assert.ok(false, "Not implemented");
        });
    }
}