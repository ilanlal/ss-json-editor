// test_Addons.gs is a test class for the functioalities of the add-ons.
class test_Addons {
    constructor() {
        QUnit.module("Addons");
        this.runTests();
    }
    runTests() {
        const tests = [
            "openJsonEditor",
            "verifyCellJsonFormat"
        ];
        tests.forEach(test => this[test]());
    }

    openJsonEditor() {
        QUnit.test("openJsonEditor", function (assert) {
            const e = {};
            try {
                openJsonEditor(e);
            } catch (error) {
                const message = 'Cannot call SpreadsheetApp.getUi() from this context.';
                assert.equal(error.message, message, "openJsonEditor");
            }
        });
    }

    verifyCellJsonFormat() {
        QUnit.test("verifyCellJsonFormat", function (assert) {
            var e = {
                cell: "A1",
                parameter: {
                    A1: '{"name": "John"}'
                }
            };
            var json = verifyCellJsonFormat(e);
            assert.deepEqual(json, { name: "John" }, "A1: valid json");

            e = {
                cell: "A1",
                parameter: {
                    A1: '{"name": "John"'
                }
            };
            json = verifyCellJsonFormat(e);
            assert.deepEqual(json, null, "A1: invalid json");

            e = {
                cell: "A1",
                parameter: {
                    A1: '{"name": "John"}'
                }
            };
            json = verifyCellJsonFormat(e);
            assert.deepEqual(json, { name: "John" }, "A1: valid json");

            e = {
                cell: "A1",
                parameter: {
                    A1: '{"name": "John"}'
                }
            };
            json = verifyCellJsonFormat(e);
            assert.deepEqual(json, { name: "John" }, "A1: valid json");
        });
    }

    test_ui() {
        QUnit.test("test_ui", function (assert) {
            var ui = SpreadsheetApp.getUi();
            assert.ok(ui, "SpreadsheetApp.getUi()");
        });
    }
}