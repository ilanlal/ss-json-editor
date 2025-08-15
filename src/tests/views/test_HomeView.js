// Google Apps Script code for Google Workspace Add-ons
class test_HomeView {
    constructor() {
        QUnit.module("HomeCard (views)");
        this.runTests();
        QUnit.done(() => {
            //this.tearDown();
        });
    }

    runTests() {
        const tests = [
            "test_cardCreate"
        ];
        tests.forEach(test => this[test]());
    }

    test_cardCreate() {
        QUnit.test("Test create HomeCard", (assert) => {
            const localization = AppManager.getLocalizationResources();
            const indentationSpaces = "2";
            const planId = "test_plan"; // Default plan ID
            // Default user ID
            const userId = "code_user"; // Default user ID
            const createdOn = new Date();  // Current date as createdOn
            // Expiration date in 14 days
            const expirationDate = new Date(createdOn.getTime() + 14 * 24 * 60 * 60 * 1000);

            const dummyUserLicense = ModelBuilder.newUserLicense()
                .setUserId(userId)
                .setPlanId(planId)
                .setCreatedOn(createdOn)
                .setExpirationDate(expirationDate)
                .setAmount(0);
            const dummyUserInfo = ModelBuilder.newUserInfo()
                .setUserId(userId)
                .setUserLicense(dummyUserLicense);

            const obj = ViewBuilder.newHomeCard(localization, dummyUserInfo, indentationSpaces);
            assert.ok(obj, "HomeCard object should be created successfully");
            const build = obj.build();
            assert.ok(build, "HomeCard build should be created successfully");
            const card = JSON.parse(build.printJson());
            assert.strictEqual(
                card.header.title,
                localization.cards.home.title,
                "Home card title should match localization"
            );

            // Check with undefined userLicense (userInfo)
            const objWithUndefinedLicense = ViewBuilder.newHomeCard(localization,undefined, indentationSpaces);
            assert.ok(objWithUndefinedLicense, "HomeCard object should be created successfully with undefined userLicense");
            const buildWithUndefinedLicense = objWithUndefinedLicense.build();
            assert.ok(buildWithUndefinedLicense, "HomeCard build should be created successfully with undefined userLicense");
            const cardWithUndefinedLicense = JSON.parse(buildWithUndefinedLicense.printJson());
            assert.strictEqual(
                cardWithUndefinedLicense.header.title,
                localization.cards.home.title,
                "Home card title should match localization with undefined userLicense"
            );
        });
    }
}