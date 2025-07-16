// test_ServerCode.gs
class test_ServerCode {
    constructor() {
        QUnit.module("Code.gs (Server Code)");
        this.runTests();
    }
    runTests() {
        const tests = [
            "test_minifyRange",
            "test_prettifyRange"
        ];
        tests.forEach(test => this[test]());
    }

    test_minifyRange() {
        QUnit.test("minifyRange", function (assert) {
            // Mock the SpreadsheetApp and its methods
            const mockSpreadsheet = {
                getActiveSpreadsheet: () => ({
                    getActiveSheet: () => ({
                        getRange: () => ({
                            getValue: () => '{"key": "value"}',
                            setValue: (value) => assert.strictEqual(value, '{"key":"value"}', "Minified JSON value set correctly")
                        })
                    })
                })
            };
            globalThis.SpreadsheetApp = { getActiveSpreadsheet: mockSpreadsheet.getActiveSpreadsheet };

            // Call the function to test
            minifyRange();

            // Clean up
            delete globalThis.SpreadsheetApp;
        });
    }
}