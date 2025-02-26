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
            const filePath = "component/help/Index";
            const content = HtmlService.createHtmlOutputFromFile(filePath).getContent();
            assert.ok(content, filePath + ".html content loaded");

            // bind script content to new object
            const newScript = new Function(content.replaceAll('<script>', '').replaceAll('</script>', ''));
            // append new object to global object
            newScript();
            assert.ok(newScript, "Content eval as js to new object");

            assert.ok(Global_Resources, "Global_Resources: " + Global_Resources.version);
            //assert.ok(Sidebar, "Sidebar is loaded");
            //assert.ok(Sidebar.ViewModel, "Sidebar.VieModel is loaded");
        });
    }

    test_Rendering() {
        QUnit.test("renderSiderbar", function (assert) {
            assert.ok(false, "Not implemented");
        });
    }
}