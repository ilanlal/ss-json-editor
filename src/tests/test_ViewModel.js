// Test_ViewModel.gs
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

    test_AB() {
        QUnit.test("AB Test", function (assert) {
            // load JavaScript.html file content 
            // this is the content of the JavaScript.html file
            // <script>
            //      var AddOns = AddOns || {}; 
            //      AddOns.ViewModel = AddOns.ViewModel || {};</script>"
            // </script>
            const htmlScript = HtmlService.createHtmlOutputFromFile('JavaScript').getContent();
            assert.ok(htmlScript, "JavaScript file");
            // evaluate the content of the JavaScript.html file
            // this will create the AddOns object
            // and the ViewModel object
            const htmlOutput = HtmlService.createHtmlOutput(htmlScript).evaluate();
            assert.ok(htmlOutput, "JavaScript output");

            // get the content of the htmlOutput
            const content = htmlOutput.getContent();
            assert.ok(content, "JavaScript content");
        });
    }

    test_Rendering() {
        QUnit.test("renderSiderbar", function (assert) {
            assert.ok(false, "Not implemented");
        });
    }
}