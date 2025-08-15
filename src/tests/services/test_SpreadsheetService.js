class test_SpreadsheetService {
    constructor() {
        this.spreadsheetService = ServiceBuilder.newSpreadsheetService("TestSheet");
        QUnit.module("SpreadsheetService (services)");
        this.runTests();   
        QUnit.done(() => {
            //this.tearDown();
        });
    }

    runTests() {
       
    }
}
