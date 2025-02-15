// test_ViewModel.gs
class Test_ViewModel {
    constructor() {
        QUnit.module("ViewModel");
        this.runTests();
    }

    runTests() {
        const tests = [
            "test_AB",
            "test_Rendering"
        ];
        tests.forEach(test => this[test]());
    }

    // This is example of "content" from JavaScript.html file:
    // <script>
    //      var AddOns = AddOns || {}; 
    //      AddOns.ViewModel = AddOns.ViewModel || {};</script>"
    // </script>
    test_AB() {
        QUnit.test("AB Test", function (assert) {
            // load JavaScript.html file content 
            const content = HtmlService.createHtmlOutputFromFile('component/validator/JavaScript').getContent();
            assert.ok(content, "JavaScript content loaded");

            // bind script content to new object
            const javaScript = new Function(content.replaceAll('<script>', '').replaceAll('</script>', ''));
            assert.ok(javaScript, "Script content binded to new object");
            // execute 'new AddOns.ViewModel()' and bind it to 'viewModel'

            const jsObject = new javaScript();
            assert.ok(jsObject, "Script executed");

            // check if 'jsObject' is an object
            assert.ok(jsObject instanceof Object, "viewModel is an object");

            // check if 'jsObject' has 'AddOns' namespace
            assert.ok(jsObject.AddOns, "viewModel has AddOns namespace");
        });
    }

    test_Rendering() {
        QUnit.test("renderSiderbar", function (assert) {
            assert.ok(false, "Not implemented");
        });
    }
}