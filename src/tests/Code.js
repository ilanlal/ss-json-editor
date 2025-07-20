// test_Run.sg
function doGet(e) {
    QUnit.urlParams(e.parameter);
    QUnit.config({
        title: `${Global_Resources.appName}. my qunit 🚨`
            + ` | version: ${Global_Resources.version}`
    });
    QUnit.load(doGetMainTest);
    return QUnit.getHtml();
}

function doGetMainTest() {
    //new test_Components();
    new test_Events();
}