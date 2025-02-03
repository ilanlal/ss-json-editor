// test_Html.gs
class Test_Html {
    constructor() {
        QUnit.module("UI/Html");
        this.runTests();
    }
    runTests() {
        const tests = [
            "onOpen"
        ];
        tests.forEach(test => this[test]());
    }

    onOpen() {
        QUnit.test("test jsonEditor", function (assert) {
            const content = HtmlService.createHtmlOutputFromFile('../html/jsonEditor').getContent();
            assert.ok(content, "jsonEditor");

            // test the jsonEditor dialog
            
        });
    }
}