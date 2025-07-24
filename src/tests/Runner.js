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

function test_minifyRange() {
    // todo create a dummy sheet for testing
    const dummySheet = SpreadsheetApp.getActiveSpreadsheet()
        .getSheetByName("TestSheet_minify") ||
        SpreadsheetApp.getActiveSpreadsheet().insertSheet("TestSheet_minify");
    const localization = AppManager.getLocalizationResources();
    const userStore = new UserStore();
    const jsonStudio = new JsonStudio(dummySheet, localization, userStore);
    const values = [
        ['{"key": "value"}', '{"array": [1, 2, 3]}'],
        ['{"nested": {"key": "value"}}', '{"boolean": true}'],
        ['{"invalid: "json"',''], // This should trigger an error
        ['{"another", "invalid"}',''] // This should also trigger an error
    ];
    dummySheet.getRange("A1:B4").setValues(values);
    // set A1:B4 as the range to be minified
    dummySheet.getRange("A1:B4").activate();
    const res = jsonStudio.minifyRange();
    Logger.log(JSON.stringify(res));
}