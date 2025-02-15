// test_AppHendler.gs
class Test_AppHendler {
    constructor() {
        QUnit.module("AppHandler");
        this.runTests();
    }
    runTests() {
        const tests = [
            "test_start",
            "test_onClick"
        ];
        tests.forEach(test => this[test]());
    }

    test_start() {
        QUnit.test("start", function (assert) {
            assert.ok(false, "Not implemented");
        });
    }

    test_onClick() {
        QUnit.test("onClick", function (assert) {
            assert.ok(false, "Not implemented");
        });
    }
}