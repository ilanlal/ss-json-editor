// test_Run.gs
function doGet(e) {
    QUnit.urlParams(e.parameter);
    QUnit.config({
        title: `${Global_Resources.appName}. my qunit 🚨`
            + ` | version: ${Global_Resources.version}`,
        hidepassed: true,

    });

    // hide passed tests
    //QUnit.config.hidepassed = true;
    QUnit.load(allTests);
    return QUnit.getHtml();
}

function allTests() {
    new test_ReportItem();
    new test_RangeReport();
    new test_UserLicense();
    new test_UserStore();
    new test_JsonStudio();
    new test_ReportController();
    new test_ReportCard();
    new test_EditorTriggers();
}
