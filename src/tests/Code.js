/// <reference path="../data/Global_Resources.js" />
// test_Run.sg
function doGet(e) {
    QUnit.urlParams(e.parameter);
    QUnit.config({
        title: `${Global_Resources.appName}. my qunit 🚨`
            + ` (v${Global_Resources.version})`
    });
    QUnit.load(doGetMainTest);
    return QUnit.getHtml();
}

function doGetMainTest() {
    new test_Components();
    new test_ServerCode();
}