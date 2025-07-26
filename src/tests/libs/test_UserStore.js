// src/tests/test_UserStore.js
// test_UserStore.gs
class test_UserStore {
    constructor() {
        QUnit.module("UserStore Tests");
        this.runTests();
    }

    runTests() {
        const tests = [
            "test_localization",
            "test_identSpaces",
            "test_userLicenseCRUD"
        ];
        tests.forEach(test => this[test]());
    }

    test_identSpaces() {
        QUnit.test("identSpaces", (assert) => {
            const userStore = new UserStore();
            userStore.setIdentSpaces(4);
            const identSpaces = userStore.getIdentSpaces();
            assert.equal(identSpaces, 4, "identSpaces should return the correct identSpaces");

            // check if identSpaces is set to a different value
            userStore.setIdentSpaces("6");
            const newIdentSpaces = userStore.getIdentSpaces();
            assert.equal(newIdentSpaces, "6", "identSpaces should return the correct identSpaces");

            // Check for default value if no input is provided
            userStore.setIdentSpaces(""); // Reset to empty to check default
            const defaultIdentSpaces = userStore.getIdentSpaces();
            assert.equal(defaultIdentSpaces, "2", "identSpaces should default to 2 if not set");
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