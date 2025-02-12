// Test_Helpers.gs
class Test_Helpers {
    constructor() {
        QUnit.module("Helpers");
        this.runTests();
    }
    runTests() {
        const tests = [
            "getEventLogSheet_",
            "log",
            "error"
        ];
        tests.forEach(test => this[test]());
    }

    getEventLogSheet_() {
        QUnit.test("getEventLogSheet_", function(assert) {
            const sheet = AspSpreadsheetEventLog.getEventLogSheet_();
            assert.ok(sheet, "getEventLogSheet_");
        });
    }

    log() {
        QUnit.test("log", function(assert) {
            const action = "action";
            const title = "title";
            const detail = "details are here";
            AspSpreadsheetEventLog.log({ action, title, detail });
            assert.ok(true, "log");
        });
    }

    error() {
        QUnit.test("error", function(assert) {
            const action = "action";
            const title = "error";
            const detail = "details are here";
            
            AspSpreadsheetEventLog.error({ action, title, detail });
            assert.ok(true, "error");
        });
    }
}