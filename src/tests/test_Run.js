// test_Run.sg
function doGet(e) {
    QUnit.urlParams(e.parameter);
    QUnit.config({
        title: "JSON Editor for Google Sheets™️. QUnit tests."
            + ` v${Global_Resources.version}`
    });
    QUnit.load(doGetMainTest);
    // see https://developers.google.com/apps-script/guides/services/tests#testing_doget_and_dopost
    return QUnit.getHtml();
}

function doGetMainTest() {
    new test_Helpers();
    new test_Addons();
}
