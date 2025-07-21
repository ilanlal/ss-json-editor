// test_Run.sg
function doGet(e) {
    QUnit.urlParams(e.parameter);
    QUnit.config({
        title: `${Global_Resources.appName}. my qunit 🚨`
            + ` | version: ${Global_Resources.version}`
    });
    QUnit.load(allTests);
    return QUnit.getHtml();
}

function allTests() {
    new test_UserStore();
    new test_JsonStudio();
    new test_EditorTriggers();
}