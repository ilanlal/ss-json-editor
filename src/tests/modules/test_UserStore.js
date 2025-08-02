// Google Apps Script code for Google Workspace Add-ons
class test_UserStore {
    constructor() {
        QUnit.module("UserStore (modules)");
        this.runTests();
    }

    runTests() {
        const tests = [
            this.test_localization.bind(this),
            this.test_indentSpaces.bind(this),
            this.test_userLicenseCRUD.bind(this)
        ];
        tests.forEach(test => {
            try {
                test();
            } catch (error) {
                console.error(`Test failed: ${test.name} at UserStore (modules)`);
                console.error(error);
            }
        });
    }

    test_indentSpaces() {
        QUnit.test("indentSpaces", (assert) => {
            const userStore = new UserStore();
            userStore.setIndentSpaces(4);
            const indentSpaces = userStore.getIndentSpaces();
            assert.equal(indentSpaces, 4, "indentSpaces should return the correct indentSpaces");

            // check if indentSpaces is set to a different value
            userStore.setIndentSpaces("6");
            const newIndentSpaces = userStore.getIndentSpaces();
            assert.equal(newIndentSpaces, "6", "indentSpaces should return the correct indentSpaces");

            // Check for default value if no input is provided
            userStore.setIndentSpaces(""); // Reset to empty to check default
            const defaultIndentSpaces = userStore.getIndentSpaces();
            assert.equal(defaultIndentSpaces, "2", "indentSpaces should default to 2 if not set");
        });
    }

    test_localization() {
        QUnit.test("localization", (assert) => {
            const userStore = new UserStore();
            userStore.setLocalization("fr");
            const localization = userStore.getLocalization();
            assert.equal(localization, "fr", "localization should return the correct localization");

            // Check for default value if no input is provided
            userStore.setLocalization(""); // Reset to empty to check default
            const defaultLocalization = userStore.getLocalization();
            assert.equal(defaultLocalization, "en", "localization should default to 'en' if not set");
        });
    }

    test_userLicenseCRUD() {
        QUnit.test("User License CRUD Operations", (assert) => {
            // Set up unique user license for testing
            // Randomly generated unique IDs for userid and planid
            const randomUserId = () => Math.random().toString(36).substring(2, 15);
            const randomPlanId = () => Math.random().toString(36).substring(2, 15);

            const userId = randomUserId();
            const planId = randomPlanId();
            // Ysterday's date for createdOn
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);


            // Expires in one year
            const expiresInOneYear = new Date();
            expiresInOneYear.setFullYear(expiresInOneYear.getFullYear() + 1);

            const randomAmount = Math.floor(Math.random() * 1000) + 1; // Random amount between 1 and 1000

            const userLicense = new UserLicense(
                userId,
                planId,
                yesterday.toISOString(),
                expiresInOneYear.toISOString(),
                randomAmount
            );

            // Assuming UserStore has already been initialized
            const userStore = new UserStore();
            const license = userStore.setUserLicense(userLicense);
            assert.ok(license, "User license should be set successfully");

            // Retrieve the license
            const retrievedLicense = userStore.getUserLicense();
            assert.ok(retrievedLicense, "User license should be retrieved successfully");
            assert.strictEqual(retrievedLicense.userId, userId, "User ID should match");
            assert.strictEqual(retrievedLicense.planId, planId, "Plan ID should match");
            assert.strictEqual(retrievedLicense.createdOn, yesterday.toISOString(), "CreatedOn date should match");
            assert.strictEqual(retrievedLicense.utcExpirationDate, expiresInOneYear.toISOString(), "Expiration date should match");
            assert.strictEqual(retrievedLicense.amount, randomAmount, "Amount should match");

            // Clean up
            userStore.clearUserLicense();
            const clearedLicense = userStore.getUserLicense();
            assert.strictEqual(clearedLicense, undefined, "User license should be cleared successfully");
        });
    }
}