// test_Addons.gs
class Test_Addons {
    constructor() {
        QUnit.module("Addons");
        this.runTests();
    }
    runTests() {
        const tests = [
            "test_AB"
        ];
        tests.forEach(test => this[test]());
    }

    test_AB() {
        QUnit.test("AB Test", function (assert) {
            assert.ok(false, "Not implemented");
        });
    }
}