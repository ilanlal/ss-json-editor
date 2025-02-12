// test_Run.sg
function doGet(e) {
    QUnit.urlParams(e.parameter);
    QUnit.config({
        title: "JSON Editor for Google Sheets™️. QUnit tests."
            + ` v${Global_Resources.version}`
    });
    QUnit.load(doGetMainTest);
    return QUnit.getHtml();
}

function doGetMainTest() {
    new Test_Helpers();
    new Test_ViewModel();
    new Test_Hendler();
    new Test_Addons();
}
