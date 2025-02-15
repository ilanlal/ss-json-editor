// test_TextEditorHandler.gs
class Test_TextEditorHandler {
    constructor() {
        QUnit.module("TextEditorHandler");
        this.runTests();
    }
    runTests() {
        const tests = [
            "test_start",
            "test_onClick",
            "test_onKeyUp",
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

    test_onKeyUp() {
        QUnit.test("onKeyUp", function (assert) {
            assert.ok(false, "Not implemented");
        });
    }
}