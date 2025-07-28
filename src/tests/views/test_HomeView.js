// Google Apps Script code for Google Workspace Add-ons
class test_HomeView {
    constructor() {
        QUnit.module("Home view tests");
        this.runTests();
        QUnit.done(() => {
            //this.tearDown();
        });
    }

    runTests() {
        const tests = [
            "test_create"
        ];
        tests.forEach(test => this[test]());
    }

    test_create() {
        QUnit.test("create", (assert) => {
            const localization = AppManager.getLocalizationResources();
            const identSpaces = "2";
            const planId = "free trial"; // Default plan ID
            // Default user ID
            const userId = "me"; // Default user ID
            const createdOn = new Date();  // Current date as createdOn
            // Expiration date in 14 days
            const utcExpirationDate = new Date(createdOn.getTime() + 14 * 24 * 60 * 60 * 1000);

            const userLicense = new UserLicense(
                userId, planId, createdOn, utcExpirationDate, 0);

            const obj = HomeCard.create(userLicense, localization, identSpaces);
            assert.ok(obj, "HomeCard object should be created successfully");
            const build = obj.build();
            assert.ok(build, "HomeCard build should be created successfully");
            const card = JSON.parse(build.printJson());
            assert.strictEqual(
                card.header.title,
                localization.cards.home.title,
                "Home card title should match localization"
            );

            // Check with undefined userLicense
            const objWithUndefinedLicense = HomeCard.create(undefined, localization, identSpaces);
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