// Apps Script QUnit Runner

/*
 * This file is the entry point for running QUnit tests in Google Apps Script.
 * It sets up the QUnit environment and runs all tests defined in the project.
 * The tests are organized into different categories such as types, app objects, MVW (Model-View-Whatever), and end-to-end triggers.
 * The results of the tests can be viewed in the QUnit HTML report.
 * To run the tests, deploy the script as a web app and access the URL provided in the deployment settings.
 * The QUnit tests will be executed, and the results will be displayed in the browser.
 * Make sure to include the QUnit library in your project for this to work.
 * @see https://qunitjs.com/api/
 * @see https://developers.google.com/apps-script/guides/html/overview
 */

function doGet(e) {
    QUnit.urlParams(e.parameter);
    QUnit.config({
        title: `${Global_Resources.appName}. my qunit 🚨`
            + ` | version: ${Global_Resources.version}`,
        // hide passed tests as default
        // https://qunitjs.com/api/config/
        hidepassed: true,

    });

    //QUnit.config.hidepassed = true;
    QUnit.load(allTests);
    return QUnit.getHtml();
}

function allTests() {
    test_types();
    test_appModules();
    test_mvw();
    test_e2eTriggers();
}

function test_app() {
    //new test_Global_Resources();
}
function test_types() {
    new test_ReportItem();
    new test_RangeReport();
    new test_UserLicense();
}

function test_appModules() {
    new test_AppManager();
    new test_JsonStudio();
    new test_UserStore();
}

function test_mvw() {
    new test_Home();
    new test_Report();
    new test_ReportController();

}

function test_e2eTriggers() {
    new test_EditorTriggers();
}