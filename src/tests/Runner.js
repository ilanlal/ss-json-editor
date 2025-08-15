// Google Apps Script code for Google Workspace Add-ons
// Apps Script QUnit Runner
class QUnitRunner {
    constructor(e) {
        console.log("QUnitRunner initialized - event:", e);
        console.log("version:", Static_Resources.package.version);
        console.log("build:", Static_Resources.package.build);
        // Initialize QUnit for testing
        QUnit.urlParams(e.parameter);
        QUnit.config({
            title: `${JsonStudio_qUnit_Resources.title}.`
                + ` | version: ${Static_Resources.package.version}`
                + ` | build: ${Static_Resources.package.build}`,
            // hide passed tests as default
            // https://qunitjs.com/api/config/
            hidepassed: JsonStudio_qUnit_Resources.hidepassed
        });

        //QUnit.config.hidepassed = true;
        QUnit.load(this.allTests.bind(this));
    }

    getHtml() {
        return QUnit.getHtml();
    }

    allTests() {
        // Run all tests
        this.test_types();
        this.test_helpers();
        // Run modules, views, controllers, and end-to-end tests
        this.test_services();
        this.test_views();
        this.test_controllers();
        this.test_e2eTriggers();
    }

    test_types() {
        new test_ReportItem();
        new test_RangeReport();
        new test_UserLicense();
    }

    test_helpers() {        
        new test_AppManager();
    }

    test_services() {
        new test_JsonStudioService();
        new test_UserStoreService();
        //new test_SpreadsheetService();
        new test_RangeService();
    }

    test_views() {
        new test_AboutView();
        new test_HomeView();
        new test_AccountView();
        new test_ReportView();
    }

    test_controllers() {
        new test_AboutController();
        new test_HomeController();
        new test_AccountController();
        new test_ReportController();
        new test_JsonStudioController();
    }


    test_e2eTriggers() {
        new test_AddonTriggers();
    }
}