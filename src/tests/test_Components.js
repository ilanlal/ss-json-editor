// test_Components.gs
class test_Components {
    constructor() {
        QUnit.module("components");
        this.runTests();

    }

    runTests() {
        const tests = [
            "test_helpPage",
            "test_Rendering"
        ];
        tests.forEach(test => this[test]());
    }

    test_helpPage() {
        QUnit.test("Global_Resources", function (assert) {
            // load JavaScript.html file content 
            const filePath = "component/help/JavaScript";
            const content = HtmlService.createHtmlOutputFromFile(filePath).getContent();
            assert.ok(content, filePath + ".html content loaded");
        });
    }

    test_Rendering() {
        QUnit.test("renderSiderbar", function (assert) {
            assert.ok(false, "Not implemented");
        });
    }
}